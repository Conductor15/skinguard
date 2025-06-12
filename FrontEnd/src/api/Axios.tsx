import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Sửa lại baseURL nếu backend đổi port hoặc domain
  timeout: 10000, // 10s, có thể bỏ nếu không cần
  headers: {
    'Content-Type': 'application/json',
  },
});

// Có thể thêm interceptor để tự động gắn token hoặc xử lý lỗi
axiosInstance.interceptors.request.use(
  (config) => {
    // Ví dụ: gắn token nếu có
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi tập trung ở đây nếu cần
    return Promise.reject(error);
  }
);

export default axiosInstance;