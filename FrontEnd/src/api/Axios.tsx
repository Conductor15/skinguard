import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Đúng với backend port
  timeout: 10000,
  withCredentials: true, // Để gửi cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: tự động gắn token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: xử lý lỗi và refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu token expired (401) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Thử refresh token
        const refreshResponse = await axios.get('/auth/refresh', {
          withCredentials: true,
          baseURL: 'http://localhost:8000'
        });

        if (refreshResponse.data.access_token) {
          localStorage.setItem('access_token', refreshResponse.data.access_token);
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access_token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/register-login?mode=login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;