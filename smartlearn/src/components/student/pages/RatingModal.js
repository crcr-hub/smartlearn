import React, { useState } from "react";

const RatingModal = ({ show, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  if (!show) return null; // Don't render if modal is not visible

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Leave a Rating</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Rating (1-5):</label>
              <select className="form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="0">Select Rating</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} ⭐</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Feedback:</label>
              <textarea className="form-control" rows="3" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={() => onSubmit(rating, feedback)}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
