import React, { useEffect, useState } from "react";
import { addUser, getUsers, getUserDetails, resetUserPassword } from "../../api/admin";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Box, MenuItem, Grid, Alert } from "@mui/material";

const ManageUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState({ name: "", email: "", role: "" });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getUsers(token);
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleResetPassword = async (userId) => {
    const newPassword = prompt("Enter new password:");
    if (!newPassword) return;
    try {
      await resetUserPassword({ userId, newPassword }, token);
      alert("Password reset successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to reset password");
    }
  };

  const handleAddUser = async () => {
    const { name, email, password, address, role } = newUser;
    if (!name || !email || !password || !address || !role) {
      setError("All fields are required");
      return;
    }
    try {
      await addUser(newUser, token);
      setSuccess("User added successfully!");
      setError("");
      setNewUser({ name: "", email: "", password: "", address: "", role: "USER" });
      fetchUsers(); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add user");
    }
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(search.name.toLowerCase()) &&
      u.email.toLowerCase().includes(search.email.toLowerCase()) &&
      (search.role === "" || u.role === search.role)
    );
  });

  const handleViewDetails = async (userId) => {
  try {
    const res = await getUserDetails(userId, token);
    const user = res.data.user;
    alert(
      `User Details:\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nAddress: ${user.address}`
    );
  } catch (err) {
    console.error(err);
    alert("Failed to fetch user details");
  }
};


  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>

      {/* Add User Form */}
      <Box mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
        <Typography variant="h6">Add New User</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              fullWidth
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              fullWidth
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Role"
              fullWidth
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="OWNER">Owner</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" color="primary" fullWidth onClick={handleAddUser}>
              Add User
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Search/Filter */}
      <Box mb={3} display="flex" gap={2}>
        <TextField
          label="Search Name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <TextField
          label="Search Email"
          value={search.email}
          onChange={(e) => setSearch({ ...search, email: e.target.value })}
        />
        <TextField
          select
          label="Role"
          value={search.role}
          onChange={(e) => setSearch({ ...search, role: e.target.value })}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="USER">User</MenuItem>
          <MenuItem value="OWNER">Owner</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>
      </Box>

      {/* Users Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <Button
                    onClick={() => handleResetPassword(user.id)}
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Reset Password
                  </Button>
                  <Button
                    onClick={() => handleViewDetails(user.id)}
                    variant="outlined"
                    color="secondary"
                    size="small"
                  >
                    View Details
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageUsers;