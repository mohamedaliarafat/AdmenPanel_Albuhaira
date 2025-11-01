import axios from 'axios';

const API_URL = 'https://back-end-albuhairaadmenpanel.onrender.com'; // رابط الباك إند النهائي

const api = axios.create({
  baseURL: API_URL,
});


// إضافة JWT تلقائي لكل الطلبات بعد تسجيل الدخول
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export default api;
