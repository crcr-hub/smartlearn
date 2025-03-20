import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import "./videoPlayer.css";

const VideoPlayer1 = ({ videoUrl }) => {
    const [playing, setPlaying] = useState(true); // Controls if the video is playing
    const [error, setError] = useState(null); // To handle errors
    const [key, setKey] = useState(0); // State to force component remount when video URL changes
    const playerRef = useRef(null); // Ref for ReactPlayer
    useEffect(() => {
      if (!videoUrl) return;
  
      // Reset the error state when the video URL changes
      setError(null);
  
      // Force re-mount of the player when the video URL changes by updating the key
      setKey(prevKey => prevKey + 1);
    }, [videoUrl]);
  
    const handleError = (e) => {
      setError("Failed to load video.");
    };
  
    const handlePause = () => {
      setPlaying(false); // Pause video
    };
  
    const handlePlay = () => {
      setPlaying(true); // Play video
    };
  
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "auto",
          backgroundColor: "black",
        }}
      >
        {error && <div style={{ color: "red" }}>{error}</div>} {/* Show error message */}
        <ReactPlayer
          key={key} // Force re-mount when the video URL changes
          ref={playerRef}
          url={videoUrl}
          controls={true}
          width="100%"
          height="100%"
          playing={playing}
          onPlay={handlePlay}
          onPause={handlePause}
          onError={handleError}
         
          config={{
            file: {
                type: "application/x-mpegURL",  // Setting the MIME type for HLS stream
              },
          }}
        />
      </div>
  );
};

export default VideoPlayer1;
