import axios from "axios";

const API_URL = "http://localhost:8000/admin";

export const getStores = async (token) => {
  return axios.get(`${API_URL}/stores`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteStore = async (storeId, token) => {
  return axios.delete(`${API_URL}/store/${storeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUsers = async (token) => {
  return axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const resetUserPassword = async (data, token) => {
  return axios.put(`${API_URL}/reset-password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addUser = async (data, token) => {
  return axios.post(`${API_URL}/add-user`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addStore = async (data, token) => {
  return axios.post(`${API_URL}/add-store`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getDashboardStats = async (token) => {
  return axios.get(`${API_URL}/dashboard-stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUserDetails = async (userId, token) => {
  return axios.get(`${API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
