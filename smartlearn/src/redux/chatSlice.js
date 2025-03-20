import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   messages: [], // Stores chat history & real-time messages
//   activeRoom: null, // Stores current chat room ID
// };

// const chatSlice = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     addMessage: (state, action) => {
//       state.messages.push({
//           message: action.payload.message,
//           sender_id: action.payload.sender,  // Ensure sender_id is stored
//           sender_username: action.payload.sender_username
//       });
//     },
//     setMessages(state, action) {
//       console.log("from slice action",action.payload)
//       state.messages = action.payload; // Load chat history when room changes
//     },
//     setActiveRoom(state, action) {
//       if (state.activeRoom !== action.payload) {
//         state.activeRoom = action.payload;
//         state.messages = []; // Clear messages when switching rooms
//       }
//     },
//   },
// });

// export const { addMessage, setMessages, setActiveRoom } = chatSlice.actions;


// export default chatSlice.reducer;

const initialState = {
  rooms: {}, // Stores messages for each room
  activeRoom: null, // Stores the current chat room ID
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { roomName, message, sender, sender_username,image,time_stamp } = action.payload;
     console.log("from slice",roomName)
      // Ensure we don't mutate state directly
      state.rooms = {
        ...state.rooms,
        [roomName]: [...(state.rooms[roomName] || []), { message, sender, sender_username,image,time_stamp }]
      };
    },
    

    setMessages: (state, action) => {
      const { roomName, messages } = action.payload;
      state.rooms[roomName] = messages.map(msg => ({
        message: msg.content, 
        sender: msg.sender, 
        image:msg.image,
        sender_username: "Unknown",  
        time_stamp :msg.timestamp
      }));
    },

    setActiveRoom: (state, action) => {
      const newRoom = action.payload;

      // Set active room and clear messages when switching rooms
      if (state.activeRoom !== newRoom) {
        state.activeRoom = newRoom;
      }
    },



    
  },
});

export const { addMessage, setMessages, setActiveRoom } = chatSlice.actions;
export default chatSlice.reducer;
