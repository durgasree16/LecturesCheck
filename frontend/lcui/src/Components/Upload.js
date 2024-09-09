import React, { useState } from 'react';
import axios from 'axios';
import './Upload.css';
import { Row, Col, Button, Upload as AntUpload, message, Input, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    YAxis
} from 'recharts';

const { Title } = Typography;

const FileUpload = ({ fileType, handleFileChange, file, title, setTitle }) => (
    <div style={{ padding: '20px', border: '1px solid #d9d9d9', borderRadius: '4px', height: '100%' }}>
        <Input
            placeholder={`Enter ${fileType} title`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: '10px' }}
        />
        <AntUpload
            accept={fileType === 'video' ? 'video/*' : 'application/pdf'}
            customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                    onSuccess("ok");
                }, 0);
            }}
            onChange={handleFileChange}
        >
            <Button icon={<UploadOutlined />}>Choose {fileType} File</Button>
        </AntUpload>
        {file && fileType === 'video' && (
            <video
                width="100%"
                height="250px"
                controls
                style={{ marginTop: '10px' }}
            >
                <source src={URL.createObjectURL(file)} type={file.type} />
                Your browser does not support the video tag.
            </video>
        )}
        {file && fileType === 'pdf' && (
            <object
                data={URL.createObjectURL(file)}
                type="application/pdf"
                width="100%"
                height="250px"
                style={{ marginTop: '10px' }}
            >
                <p>PDF cannot be displayed.</p>
            </object>
        )}
    </div>
);

const Upload = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [videoTitle, setVideoTitle] = useState('');
    const [pdfTitle, setPdfTitle] = useState('');
    const [similarity, setSimilarity] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePdfChange = (info) => {
        if (info.file.status === 'done') {
            setPdfFile(info.file.originFileObj);
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleVideoChange = (info) => {
        if (info.file.status === 'done') {
            setVideoFile(info.file.originFileObj);
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('pdf_file', pdfFile);
        formData.append('video_file', videoFile);
        formData.append('video_title', videoTitle);
        formData.append('pdf_title', pdfTitle);

        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:5000/extract_text', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const similarityResult = response.data.result;
            setSimilarity(similarityResult);
            if (similarityResult < 50) {
                setError('You might have uploaded mismatched video and PDF files. Please upload the correct files.');
            } else {
                setError('');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            setError('There was an error uploading the files. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const pieChartData = [
        { name: 'Similarity', value: similarity },
        { name: 'Difference', value: 100 - similarity }
    ];

    const barChartData = [
        { name: 'Similarity', value: similarity },
        { name: 'Difference', value: 100 - similarity }
    ];

    const colors = ['#0088FE', '#00C49F'];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <img src="/upload.jpeg" alt="Upload Icon" style={{ width: '32px', marginRight: '10px' }} /> Upload
            </Title>
            <form onSubmit={handleSubmit}>
                <Row gutter={16} style={{ marginBottom: '20px' }}>
                    <Col span={12}>
                        <FileUpload
                            fileType="video"
                            handleFileChange={handleVideoChange}
                            file={videoFile}
                            title={videoTitle}
                            setTitle={setVideoTitle}
                        />
                    </Col>
                    <Col span={12}>
                        <FileUpload
                            fileType="pdf"
                            handleFileChange={handlePdfChange}
                            file={pdfFile}
                            title={pdfTitle}
                            setTitle={setPdfTitle}
                        />
                    </Col>
                </Row>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                        display: 'block',
                        margin: '0 auto',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                    loading={loading}
                >
                    Upload and Compare
                </Button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {similarity !== null && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p>Similarity: {similarity}%</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                                labelLine={false}
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill={colors[0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default Upload;
