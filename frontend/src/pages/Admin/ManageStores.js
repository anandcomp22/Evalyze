import React, { useEffect, useState } from "react";
import { getStores, addStore, deleteStore } from "../../api/admin";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Box } from "@mui/material";

const ManageStores = ({ token }) => {
  const [stores, setStores] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getStores(token);
      setStores(res.data.stores);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stores");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleAddStore = async () => {
    if (!storeName || !address) return alert("Please enter store name and address");

    try {
      await addStore({ storeName, email, address }, token);
      alert("Store added successfully");
      setStoreName("");
      setAddress("");
      fetchStores();
    } catch (err) {
      console.error(err);
      alert("Failed to add store");
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    try {
      await deleteStore(storeId, token);
      alert("Store deleted successfully");
      fetchStores(); // refresh the list
    } catch (err) {
      console.error(err);
      alert("Failed to delete store");
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Manage Stores
      </Typography>

      {/* Add Store Form */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
        />
        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button onClick={handleAddStore} variant="contained" color="primary">
          Add Store
        </Button>
      </Box>

      {/* Stores Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Store Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Average Rating</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stores.map((store) => (
            <TableRow key={store.id}>
              <TableCell>{store.id}</TableCell>
              <TableCell>{store.storeName}</TableCell>
              <TableCell>{store.address}</TableCell>
              <TableCell>{store.averageRating || "N/A"}</TableCell>
              <TableCell>
                <Button onClick={() => handleDeleteStore(store.id)} variant="contained" color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageStores;
