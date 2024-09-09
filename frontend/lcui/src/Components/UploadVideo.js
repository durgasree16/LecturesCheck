import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form, Table } from "react-bootstrap";
import { BACKEND_URI } from "../Config/constants";

const UploadVideo = () => {
  const [name, setName] = useState("");
  const [videos, setVideos] = useState([]);
  const [medias, setMedias] = useState([]);

  useEffect(() => {
    getAllMedias();
  }, []);

  const getAllMedias = async () => {
    try {
      const response = await axios.get(`${BACKEND_URI}/api/v1/media/all`);
      setMedias(response.data);
    } catch (error) {
      console.error("Error fetching media:", error);
      alert("Error fetching media!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Array.from(videos).forEach((video) => {
      formData.append("videos", video);
    });
    formData.append("name", name);

    try {
      const response = await axios.post(`${BACKEND_URI}/api/v1/media/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status === "ok") {
        alert("Videos uploaded successfully!");
        getAllMedias(); // Refresh media list after upload
      }
    } catch (error) {
      console.error("Error uploading videos:", error);
      alert("Error uploading videos!");
    }
  };

  const handleFileChange = (e) => {
    setVideos(e.target.files);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Upload Videos</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="file"
                    multiple
                    accept=".mp4, .mkv"
                    required
                    onChange={handleFileChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Upload
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h4>Uploaded Videos:</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Videos</th>
              </tr>
            </thead>
            <tbody>
              {medias.map((media, index) => (
                <tr key={index}>
                  <td>{media.name}</td>
                  <td>
                    {media.videos.map((video, vidIndex) => (
                      <video key={vidIndex} width="200" controls>
                        <source src={`${BACKEND_URI}${video}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default UploadVideo;
