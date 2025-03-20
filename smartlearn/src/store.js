import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/authSlices';  // Correct import for the default export of authSlice.reducer
import chatReducer from './redux/chatSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,  // This will handle authentication state
    chat: chatReducer,
  },
});


