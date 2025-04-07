// // redux/chatThunks.js
// import { handleNotification, recentMessages } from './authSlices';
// import { addMessage, setMessages } from './chatSlice';


// const sockets = {};
// export const connectWebSocket = (roomName) => (dispatch) => {
//   // Open WebSocket connection
//   if (sockets[roomName]) {
//     console.log(`Already connected to room: ${roomName}`);
//     return sockets[roomName];  // Return existing connection
//   }


//   const token = localStorage.getItem('access');  // Retrieve the access token from localStorage
//   if (!token) {
//     console.error('No token found in localStorage');
//     return;
//   }
//   const socketUrl = `ws://localhost:8000/ws/chat/${roomName}/?token=${token}`;

//   const socket = new WebSocket(socketUrl);

//   socket.onopen = () => {
//     console.log("Connected to WebSocket");
//     console.log(`Connected to the room: ${roomName}`);
//     // Optionally send a join message if required
//     socket.send(
//       JSON.stringify({ type: "join", roomName })
//     );
//   };

//   socket.onmessage = (event) => {
//     try {
//       const message = JSON.parse(event.data);
//       if (message.type === "old_messages") {
//         console.log("Received old messages:", message.messages);
//         dispatch(setMessages({ roomName, messages: message.messages })); 
//       } else if(message.type === "notification"){
//         console.log("Received old messages................:", message);
       
//           dispatch(handleNotification(message.reciepient));
        
//       } else if (message.sender && (message.message || message.image)) {
//         // ✅ Now handles both text and image messages
//         const messagePayload = {
//           roomName: roomName,
//           message: message.message || null, // Can be empty
//           sender: message.sender,
//           sender_username: message.sender_username || "Unknown",
//           time_stamp: message.timestamp,
//           image: message.image || null, // ✅ Image support
//         };
  
//         console.log("Dispatching message:", messagePayload);
  
//         dispatch(addMessage(messagePayload)); //  Dispatch message correctly
       
//       } else {
//         console.warn("Received message with unexpected format", message);
//       }
//     } catch (error) {
//       console.error("Error parsing WebSocket message:", error);
//     }
//   };
  
  

//   socket.onerror = (error) => {
//     console.error("WebSocket error", error);
//   };

//   socket.onclose = () => {
//     console.log("WebSocket connection closed");
//     delete sockets[roomName];
//   };

//   return socket;
// };



// export const sendMessage = (socket, message, senderId, recipientId, image = null) => {
//   return () => {
//     const payload = {
//       message, // Text message
//       sender_id: senderId, 
//       recipient_id: recipientId,
//       image, // Image URL
//     };

//     socket.send(JSON.stringify(payload));
//   };
// };




// redux/chatThunks.js
import { handleNotification, recentMessages } from './authSlices';
import { addMessage, setMessages } from './chatSlice';

const sockets = {};
const MAX_RETRIES = 5; // Limit reconnection attempts
const RECONNECT_DELAY = 3000; // Delay in milliseconds (3 seconds)
const retryCounts = {}; // Track retry attempts per room

export const connectWebSocket = (roomName) => (dispatch) => {
  if (sockets[roomName]) {
    console.log(`Already connected to room: ${roomName}`);
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
      console.log(`Connected to the room: ${roomName}`);
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
