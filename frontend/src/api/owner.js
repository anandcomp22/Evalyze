import axios from "axios";

const API_URL = "http://localhost:8000";

export const getOwnerDashboard = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/store-owner/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
};

export const updateOwnerPassword = async (data, token) => {
  try {
    const res = await axios.put(`${API_URL}/store-owner/password`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res;
  } catch (err) {
    throw err.response ? err.response.data : err;
  }
};
