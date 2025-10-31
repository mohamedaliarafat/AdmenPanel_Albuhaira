// import axios from 'axios';

// const API_URL = 'http://localhost:6014/api'; // عنوان السيرفر Backend

// // إرسال OTP
// export const sendOTP = (phone) => {
//   return axios.post(`${API_URL}/auth/send-otp`, { phone });
// };

// // التحقق من OTP
// export const verifyOTP = (phone, code) => {
//   return axios.post(`${API_URL}/auth/verify-otp`, { phone, code });
// };

// // مثال CRUD للمستخدمين
// export const getUsers = (token) => {
//   return axios.get(`${API_URL}/users`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };
// export const addUser = (userData, token) => {
//   return axios.post(`${API_URL}/users`, userData, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };
// export const updateUser = (id, userData, token) => {
//   return axios.put(`${API_URL}/users/${id}`, userData, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };
// export const deleteUser = (id, token) => {
//   return axios.delete(`${API_URL}/users/${id}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
// };
