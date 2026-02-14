import React from 'react';

const VideoPlayer = ({ videoUrl, onClose }) => {
  return (
    <div className="video-player">
      <div className="video-container">
        <video controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default VideoPlayer;