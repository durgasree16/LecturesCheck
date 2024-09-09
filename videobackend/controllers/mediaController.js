const axios = require("axios");
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');
const Media = require("../models/Media");

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Function to convert video to audio
const convertVideoToAudio = (videoPath, audioPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .audioBitrate(128)
      .save(audioPath)
      .on('end', () => {
        console.log('Audio extraction complete.');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error during audio extraction:', err);
        reject(err);
      });
  });
};

// Controller to get all media
exports.getAll = async (req, res) => {
  try {
    const media = await Media.find();
    res.json(media);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// Controller to create new media and convert video to audio
exports.create = async (req, res) => {
  const { name } = req.body;
  let videosPaths = [];

  if (Array.isArray(req.files.videos) && req.files.videos.length > 0) {
    for (let video of req.files.videos) {
      videosPaths.push("/" + video.path);
    }
  }

  try {
    const createdMedia = await Media.create({
      name,
      videos: videosPaths,
    });

    // Ensure the audios directory exists
    const audiosDir = path.join(__dirname, '..', 'public', 'audios');
    if (!fs.existsSync(audiosDir)) {
      fs.mkdirSync(audiosDir, { recursive: true });
    }

    // Convert each uploaded video to audio and transcribe
    let transcriptionResults = [];
    for (const videoPath of videosPaths) {
      const fullVideoPath = path.join(__dirname, '..', videoPath);
      const audioFilename = `${path.parse(fullVideoPath).name}.mp3`;
      const audioPath = path.join(audiosDir, audioFilename);
      
      await convertVideoToAudio(fullVideoPath, audioPath);

      // Call the Flask API to transcribe the audio
      try {
        const response = await axios.post("http://127.0.0.1:5000/transcribe", {
          file_path: audioPath
        });

        console.log("Transcription:", response.data.transcription);
        transcriptionResults.push({
          video: videoPath,
          transcription: response.data.transcription
        });

        // Optionally, save the transcription to the database
        createdMedia.transcription = response.data.transcription;
        await createdMedia.save();
      } catch (err) {
        console.error("Error during transcription:", err);
      }

      // Optionally, remove the audio file after processing
      // fs.unlinkSync(audioPath);
    }

    res.json({ message: "Media created successfully", createdMedia, transcriptionResults });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
