

// redux/chatThunks.js
import { handleNotification } from './authSlices';
import { addMessage, setMessages } from './chatSlice';

const sockets = {};
const MAX_RETRIES = 5; // Limit reconnection attempts
const RECONNECT_DELAY = 3000; // Delay in milliseconds (3 seconds)
const retryCounts = {}; // Track retry attempts per room

export const connectWebSocket = (roomName) => (dispatch) => {
  if (sockets[roomName]) {
    return sockets[roomName];  
  }

  const token = localStorage.getItem('access');  
  if (!token) {
    console.error('No token found in localStorage');
    return;
  }

  const socketUrl = `wss://mysmartlearn.com/ws/chat/${roomName}/?token=${token}`;

  const createSocket = () => {
    const socket = new WebSocket(socketUrl);
    sockets[roomName] = socket; 

    socket.onopen = () => {
      retryCounts[roomName] = 0; // Reset retry count on successful connection
      socket.send(JSON.stringify({ type: "join", roomName }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "old_messages") {
          dispatch(setMessages({ roomName, messages: message.messages })); 
        } else if (message.type === "notification") {
          dispatch(handleNotification(message.recipient));
        } else if (message.sender && (message.message || message.image)) {
          dispatch(addMessage({
            roomName,
            message: message.message || null,
            sender: message.sender,
            sender_username: message.sender_username || "Unknown",
            time_stamp: message.timestamp,
            image: message.image || null,
          }));
        } else {
          console.warn("Unexpected message format", message);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed for room: ${roomName}`, event);

      // Attempt reconnection if it wasn't a manual close
      if (!event.wasClean && retryCounts[roomName] < MAX_RETRIES) {
        retryCounts[roomName] = (retryCounts[roomName] || 0) + 1;
        console.log(`Reconnecting to ${roomName} in ${RECONNECT_DELAY / 1000} seconds... Attempt ${retryCounts[roomName]}`);
        
        setTimeout(() => {
          createSocket(); // Recreate socket connection
        }, RECONNECT_DELAY);
      } else {
        console.warn(`Max reconnection attempts reached for room: ${roomName}`);
        delete sockets[roomName];
      }
    };
  };

  createSocket(); // Initial connection attempt
  return sockets[roomName];
};

export const sendMessage = (socket, message, senderId, recipientId, image = null) => {
  return () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message, sender_id: senderId, recipient_id: recipientId, image }));
    } else {
      console.warn("WebSocket is not open. Message not sent.");
    }
  };
};
