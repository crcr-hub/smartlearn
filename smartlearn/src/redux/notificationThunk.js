import { handleNotification } from "./authSlices";

const MAX_RETRIES = 5; // Maximum reconnection attempts
const RECONNECT_DELAY = 3000; // Reconnection delay in milliseconds (3 seconds)
let retryCount = 0; // Track the number of retry attempts

export const connectNotificationSocket = () => (dispatch) => {
  const token = localStorage.getItem("access");
  if (!token) {
    console.error("No token for notification socket");
    return;
  }

  const createSocket = () => {
    const notificationSocket = new WebSocket(
      `wss://mysmartlearn.com/ws/notifications/?token=${token}`
    );

    notificationSocket.onopen = () => {
      console.log("Notification WebSocket connected");
      retryCount = 0; // Reset retry count on successful connection
    };

    notificationSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "notification") {
        // Dispatch the action to handle the notification
        dispatch(handleNotification(data.reciepient));
      }
    };

    notificationSocket.onclose = (event) => {
      console.log("Notification WebSocket closed", event);
      // Try to reconnect if the connection was closed unexpectedly
      if (!event.wasClean && retryCount < MAX_RETRIES) {
        retryCount += 1;
        console.log(
          `Reconnecting to notification WebSocket in ${RECONNECT_DELAY / 1000} seconds... Attempt ${retryCount}`
        );
        setTimeout(createSocket, RECONNECT_DELAY);
      } else {
        console.warn(`Max reconnection attempts reached for notification socket`);
      }
    };

    notificationSocket.onerror = (event) => {
      console.error("Notification WebSocket error:", event);
    };
  };

  createSocket(); // Initial connection attempt
};
