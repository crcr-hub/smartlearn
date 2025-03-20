import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectWebSocket, sendMessage } from '../../../redux/chatThunk';
import { useParams, useLocation } from 'react-router-dom';
import { setActiveRoom } from '../../../redux/chatSlice';
import TeacherSideBar from '../TeacherSideBar';
import { handleNotification } from '../../../redux/authSlices';
import { Paperclip } from "lucide-react";

const TutorChatComponent = () => {
    const { sid } = useParams(); // Get sid from URL
    const location = useLocation();
    const studentName = location.state?.studentName || 'Student'; 
    const {user} = useSelector((state)=> state.auth)

    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [selectedFile,setSelectedFile] = useState(null)
    const dispatch = useDispatch();
 
    // Ref to store WebSocket instance
    const socketRef = useRef(null);



    
    // Access messages from Redux store
    const activeRoom = useSelector((state) => state.chat.activeRoom);
    const rooms = useSelector((state) => state.chat.rooms);
    const messages = activeRoom ? rooms[activeRoom] : [];
    const {tprofile} = useSelector((state)=>state.auth) 
   
    // useEffect(() => {
    //     // Unique room name for tutor-student chat

    //     if (user?.user_id){
    //         dispatch(handleNotification(user.user_id));
    //     }
    //     if (tprofile?.id && sid){
    //     const roomName = `chat_tutor_${tprofile.id}_student_${sid}`;
    //     dispatch(setActiveRoom(roomName));
    //     const socket = dispatch(connectWebSocket(roomName));
    //     socketRef.current = socket;

    //     return () => {
    //         if (socketRef.current) {
    //             socketRef.current.close(); // Close WebSocket on unmount
    //             socketRef.current = null;
    //         }
    //     };
    // }
    // }, [dispatch, sid]);

    useEffect(() => {
        // Restore active room from localStorage
        let storedRoom = localStorage.getItem("activeRoom");
    
        if (user?.user_id) {
            dispatch(handleNotification(user.user_id));
        }
    
        if (tprofile?.id && sid) {
            const roomName = `chat_tutor_${tprofile.id}_student_${sid}`;
            dispatch(setActiveRoom(roomName));
    
            // Store active room in localStorage to persist after refresh
            localStorage.setItem("activeRoom", roomName);
    
            const socket = dispatch(connectWebSocket(roomName));
            socketRef.current = socket;
    
            return () => {
                if (socketRef.current) {
                    socketRef.current.close();
                    socketRef.current = null;
                }
            };
        } else if (storedRoom) {
            // If no sid but a stored room exists (from refresh), reconnect
            dispatch(setActiveRoom(storedRoom));
            const socket = dispatch(connectWebSocket(storedRoom));
            socketRef.current = socket;
        }
    }, [dispatch, sid, tprofile?.id]);
    
    




    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
    
        try {
            const response = await fetch("http://localhost:8000/api/upload-image/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
                body: formData,
            });
    
            if (!response.ok) throw new Error("Failed to upload image");
    
            const data = await response.json();
            return data.image_url; // Get the uploaded image URL from the backend
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };
    

    const handleSendMessage = async () => {
        let imageUrl = null;
    
        if (selectedFile) {
            imageUrl = await uploadImage(selectedFile); // Upload the image first
        }
    
        if ((message.trim() || imageUrl) && socketRef.current) {
            dispatch(sendMessage(socketRef.current, message, tprofile.id, sid, imageUrl));
            setMessage(""); 
            setSelectedFile(null); // Reset the file input
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <TeacherSideBar/>
                <section className="col-md-9">
                    <h3>Chat with {studentName}</h3>
                    <div>
                    <div style={{ width: "700px", padding: "10px" }}>
                                {/* Chat Header */}
                                <div style={{marginBottom:"10px", width: "100%", height: "40px", backgroundColor: "grey", textAlign: "left", color: "white", fontWeight: "bold", lineHeight: "40px" }}>
                                    {studentName}
                                </div>
                                <div style={{height:"450px",

                                    overflowY: "auto", // Enables scrolling for messages
                                    display: "flex",
                                    flexDirection: "column-reverse", // New messages appear at the bottom
                                }}>

                                {/* Messages List */}
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {messages?.map((msg, index) => {
                                        const isUser = msg.sender === tprofile.id;
                                        const messageDate = new Date(msg.time_stamp);
                                        const todayDate = new Date().toLocaleDateString();
                                        const formattedDate = messageDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
                                
                                        // Show date label only if it's the first message of that day
                                        const showDateLabel = index === 0 || new Date(messages[index - 1].time_stamp).toLocaleDateString() !== messageDate.toLocaleDateString();
                                
                                        return (
                                            <div key={index}>
                                        {/* Show "Today" only once at the first message of today */}
                                    {showDateLabel && (
                                    <p style={{
                                        textAlign: "center", fontWeight: "bold",fontSize:"10px", 
                                        color: "grey", 
                                        padding: "5px", borderRadius: "5px"
                                    }}>
                                        {messageDate.toLocaleDateString() === todayDate ? "Today" : formattedDate}
                                    </p>
                                )}

                                        <li
                                            style={{
                                                display: "flex",
                                                justifyContent: isUser ? "flex-end" : "flex-start",
                                                marginBottom: "8px"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    padding: "10px",
                                                    borderRadius: "10px",
                                                    backgroundColor: isUser ? "#007bff" : "#28a745",
                                                    color: "white",
                                                    maxWidth: "60%",
                                                    textAlign: "left"
                                                }}
                                            >
                                                {msg.message}
                                                {msg.image && (
                                                        <img src={msg.image} alt="Sent" style={{ width: "200px", borderRadius: "8px", marginTop: "5px" }} />
                                                    )}
                                                <span style={{ fontWeight: "lighter", marginLeft: "6px", fontSize: "12px" }}>
                                                    {new Date(msg.time_stamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </span>
                                        </li>
                                    </div>
                                        );
                                    })}
                                </ul>
                                </div>
                            </div>
                        </div>
                    <div style={{display:"flex"}}>
                        <input style={{width:"650px"}} className="form-control"
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message"
                        />
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", border: "1px solid #ccc", borderRadius: "8px", background: "#fff" }}>
                                {/* Attachment Button */}
                                <label style={{ 
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    width: "40px", height: "40px", borderRadius: "50%", background: "#e0e0e0",
                                    cursor: "pointer", transition: "background 0.3s" 
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "#d6d6d6"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "#e0e0e0"}
                                >
                                    <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    />
                                    📎 {/* Unicode for a paperclip (you can replace this with an icon library) */}
                                </label>

                                {/* Send Button */}
                                <button
                                    type="button"
                                    style={{
                                    padding: "8px 16px",
                                    background: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    transition: "background 0.3s"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "#0056b3"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "#007bff"}
                                    onClick={handleSendMessage}
                                >
                                    Send
                                </button>
                                </div>

                    </div>
                </section>
            </div>
        </div>
    );
};

export default TutorChatComponent;
