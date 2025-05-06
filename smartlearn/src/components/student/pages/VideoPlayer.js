import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./videoPlayer.css";

const VideoPlayer = ({ videoUrl }) => {
  const videoNode = useRef(null); // Ref for the video element
  const playerRef = useRef(null); // Ref for the video.js player instance

  useEffect(() => {
    if (!videoNode.current) return;
    if (!playerRef.current) {
      playerRef.current = videojs(videoNode.current, {
        muted: false,
        autoplay: true,
        controls: true,
        width: "100%",
        height: "auto",
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
      });
    }
  
    // Pause the current video before updating the source
    const player = playerRef.current;
    player.pause();
    player.src({
      src: videoUrl,
      type: "application/x-mpegURL",
    });
    player.load(); // Force reload the new video
    player.play(); // Ensure it plays
  

  
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl]); // Run the effect whenever videoUrl changes

  return (
    <div >
      {/* Video player element */}
      <video ref={videoNode} className="video-js vjs-default-skin" />
    </div>
    );
  };
export default VideoPlayer;
