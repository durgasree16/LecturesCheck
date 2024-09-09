import React, { useState } from 'react';
import './Feedback.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Feedback = () => {
    const [feedbackType, setFeedbackType] = useState('usability');
    const [feedbackDetails, setFeedbackDetails] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate submission (you can replace this with actual submission logic)
        setSubmitted(true);
        // Reset form fields after submission
        setFeedbackType('usability');
        setFeedbackDetails('');
    };

    return (
        <div className="container feedback-container mt-4">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Feedback</h2>
                    <p className="card-text">Provide feedback on system usability, request new features, or report issues encountered:</p>

                    {submitted ? (
                        <div className="feedback-submitted alert alert-success">
                            <p>Thank you for your feedback! It has been submitted successfully.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Feedback Type:</label>
                                <select
                                    className="form-control"
                                    value={feedbackType}
                                    onChange={(e) => setFeedbackType(e.target.value)}
                                    required
                                >
                                    <option value="usability">Usability</option>
                                    <option value="feature-request">Feature Request</option>
                                    <option value="issue">Issue Encountered</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Details:</label>
                                <textarea
                                    className="form-control"
                                    rows={6}
                                    placeholder="Please provide details..."
                                    value={feedbackDetails}
                                    onChange={(e) => setFeedbackDetails(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">
                                Submit Feedback
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
