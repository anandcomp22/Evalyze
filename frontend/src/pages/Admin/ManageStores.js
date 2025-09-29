import React, { useEffect, useState } from "react";
import { getStores, addStore, deleteStore, getUserDetails } from "../../api/admin";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Box,
  Alert,
  Grid,
} from "@mui/material";

const ManageStores = () => {
  const token = localStorage.getItem("token");
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", email: "" });
  const [newStore, setNewStore] = useState({ storeName: "", email: "", address: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStores = async () => {
    try {
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
    const { storeName, email, address } = newStore;
    if (!storeName || !address) {
      setError("Store name and address are required");
      return;
    }
    try {
      await addStore(newStore, token);
      setSuccess("Store added successfully!");
      setError("");
      setNewStore({ storeName: "", email: "", address: "" });
      fetchStores();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add store");
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    try {
      await deleteStore(storeId, token);
      alert("Store deleted successfully");
      fetchStores();
    } catch (err) {
      console.error(err);
      alert("Failed to delete store");
    }
  };

  const handleViewDetails = async (ownerId) => {
    try {
      const res = await getUserDetails(ownerId, token);
      const user = res.data.user;
      alert(
        `Owner Details:\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nAddress: ${user.address}`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to fetch owner details");
    }
  };

  const filteredStores = stores.filter((store) => {
  return (
    (store.storeName?.toLowerCase() || "").includes(search.name?.toLowerCase() || "") &&
    (store.email?.toLowerCase() || "").includes(search.email?.toLowerCase() || "")
  );
});

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Manage Stores
      </Typography>

      {/* Add Store Form */}
      <Box mb={3} p={2} border="1px solid #ccc" borderRadius={2}>
        <Typography variant="h6">Add New Store</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Store Name"
              fullWidth
              value={newStore.storeName}
              onChange={(e) => setNewStore({ ...newStore, storeName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Email"
              fullWidth
              value={newStore.email}
              onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Address"
              fullWidth
              value={newStore.address}
              onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleAddStore}>
              Add Store
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Search/Filter */}
      <Box mb={3} display="flex" gap={2}>
        <TextField
          label="Search Store Name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
        />
        <TextField
          label="Search Email"
          value={search.email}
          onChange={(e) => setSearch({ ...search, email: e.target.value })}
        />
      </Box>

      {/* Stores Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Store Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Average Rating</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStores.map((store) => (
            <TableRow key={store.id}>
              <TableCell>{store.id}</TableCell>
              <TableCell>{store.storeName}</TableCell>
              <TableCell>{store.email || "N/A"}</TableCell>
              <TableCell>{store.address}</TableCell>
              <TableCell>{store.averageRating || "N/A"}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleViewDetails(store.ownerId)}
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 1 }}
                >
                  View Owner
                </Button>
                <Button
                  onClick={() => handleDeleteStore(store.id)}
                  variant="outlined"
                  color="error"
                >
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
