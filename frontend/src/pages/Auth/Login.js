import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { login } from "../../api/auth";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { user, token } = await login(email, password);
      console.log("Logged in user:", user);
      console.log("Token:", token);

      loginUser(user, token);
      console.log("Role:", user.role);

      switch (user.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "OWNER":
          navigate("/store-owner/dashboard");
          break;
        default:
          navigate("/user/dashboard");
      }
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
