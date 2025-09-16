// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://127.0.0.1:8000/api/',
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });


// export default axiosInstance
import axios from 'axios';
import { baseUrl } from './constant';


const axiosInstance = axios.create({
   baseURL: 'http://127.0.0.1:8000/api/',
 // baseURL : baseUrl
});

axiosInstance.interceptors.request.use(
  
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to refresh token
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post('https://mysmartlearn.com/api/token/refresh/', {
      refresh: refresh,
    });

    localStorage.setItem('access', response.data.access); // Save new access token
    return response.data.access;
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    
    return null;
  }
};

// Response Interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();

      if (newToken) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry the failed request
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

