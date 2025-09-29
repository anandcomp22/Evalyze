import React, { useEffect, useState } from "react";
import { getUsers, deleteStore, getUserDetails, resetUserPassword } from "../../api/admin";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const ManageUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  
  const fetchUsers = async () => {
    try {
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

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button onClick={() => handleResetPassword(user.id)} variant="contained" color="primary">
                  Reset Password
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageUsers;
