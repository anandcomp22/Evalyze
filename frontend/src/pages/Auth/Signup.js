import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";
import { Container, TextField, Button, Typography, Box, Alert, MenuItem } from "@mui/material";

const Signup = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { user, token } = await signup(name, email, password, address, role);

      loginUser(user, token);

      const normalizedRole = user.role.toUpperCase();
        if (normalizedRole === "ADMIN") navigate("/admin/dashboard");
        else if (normalizedRole === "OWNER") navigate("/store-owner/dashboard");
        else navigate("/user/dashboard");
        
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role); 

      setSuccess("Signup successful!");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Signup
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Address"
          fullWidth
          margin="normal"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
        <TextField
          select
          label="Role"
          fullWidth
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <MenuItem value="USER">User</MenuItem>
          <MenuItem value="OWNER">Owner</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Signup
        </Button>
      </Box>
    </Container>
  );
};

export default Signup;
