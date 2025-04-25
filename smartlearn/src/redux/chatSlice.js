import { createSlice } from "@reduxjs/toolkit";



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
