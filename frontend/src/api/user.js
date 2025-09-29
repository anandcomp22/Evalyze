import axios from "axios";

const API_URL = "http://localhost:8000";

export const getStores = async (token) => {
  return axios.get(`${API_URL}/user/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updatePassword = async (data, token) => {
  return axios.put(`${API_URL}/user/password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const submitRating = async (data, token) => {
  return axios.post(`${API_URL}/user/rating`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const modifyRating = async (data, token) => {
  return axios.put(`${API_URL}/user/rating`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
