import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import {  fetchCourse, fetchModules } from '../../../redux/authSlices';
import { useDispatch, useSelector } from 'react-redux';
import 'video.js/dist/video-js.css'
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

function ViewModules() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { modules } = useSelector((state) => state.auth);
    const { course, courseLoading, courseError } = useSelector((state) => state.auth); 
    // const sortedModules = [...modules].sort((a, b) => a.number - b.number);
    const sortedModules = React.useMemo(
        () => [...modules].sort((a, b) => a.number - b.number),
        [modules]
      );
        

     useEffect(() => {
                dispatch(fetchModules(id));
                dispatch(fetchCourse(id));
              }, [dispatch, id]); 
              
              

        // Modal and video state
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // Initialize Video.js when modal opens
  useEffect(() => {
    console.log("url",videoUrl)
    if (showModal && videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
          {
            src: videoUrl,
            type: 'application/x-mpegURL', // for HLS streaming
          },
        ],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [showModal, videoUrl]);

  const openModal = (url) => {
    setVideoUrl(url);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setVideoUrl('');
  };
  return (

    <div>
              {courseLoading ? (
                <h3>Loading course data...</h3>
              ) : (
                <h3>Modules for Course: {course?.course?.name}</h3>
              )}
            <table className="table">
              <thead>
                <tr>
                  <th>Module Number</th>
                  <th>Topic</th>
                  <th>Subtopic</th>
                  <th>Media URL</th>
                  <th>Media Status</th> {/* Action column for buttons */}
                </tr>
              </thead>
              <tbody>
   


        {/* Existing modules */}
        {sortedModules.map((module) => (
          <tr key={module.id}>
            
               
                <td>{module.number}</td>
                <td>{module.topic}</td>
                <td>{module.sub_topic}</td>
                <td>
                  <>
                  {module.processing_status ==="Completed"?
                 <button
                 className="btn btn-primary"
                 onClick={() => openModal(module.media)}
               >
                 Play
               </button> : module.media
                  }
                  </>
                </td>
                <td> {module.processing_status}</td>
           
          </tr>
        ))}


        
      </tbody>
    </table>



           {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'relative', width: '80%', maxWidth: '900px' }}>
          <button
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '-40px',
              right: '0',
              fontSize: '2rem',
              color: '#fff',
              backgroundColor: 'transparent',
              border: 'none',
              zIndex: 1001,
              cursor: 'pointer',
            }}
          >
            &times;
          </button>

            <video
              ref={videoRef}
              className="video-js vjs-default-skin"
              controls
              playsInline
            />
          </div>
        </div>
      )}   
          
   
    </div>
  )
}

export default ViewModules
