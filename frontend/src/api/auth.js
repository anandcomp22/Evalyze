import axios from "axios";

const API_URL = "http://localhost:8000";

export const signup = async (name, email, password, address, role) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password, address, role });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const logout = async (token, role = "USER") => {
  try {
    let endpoint = "/auth/logout";
    if (role === "ADMIN") endpoint = "/admin/logout";
    else if (role === "OWNER") endpoint = "/store-owner/logout";

    const response = await axios.post(`${API_URL}${endpoint}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
