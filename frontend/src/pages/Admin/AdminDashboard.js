import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/admin";
import { useNavigate } from "react-router-dom";
import ManageUsers from "./ManageUsers";
import ManageStores from "./ManageStores";
import { Container, Grid, Card, CardContent, Typography, Button, Box } from "@mui/material";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [view, setView] = useState("dashboard");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats(token);
      setStats(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Toggle Buttons */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <Button variant={view === "dashboard" ? "contained" : "outlined"} onClick={() => setView("dashboard")}>
          Dashboard Stats
        </Button>
        <Button variant={view === "users" ? "contained" : "outlined"} onClick={() => setView("users")}>
          Manage Users
        </Button>
        <Button variant={view === "stores" ? "contained" : "outlined"} onClick={() => setView("stores")}>
          Manage Stores
        </Button>
      </Box>

      {/* Conditional Rendering */}
      {view === "dashboard" && stats && (
        <Grid container spacing={3}>
          {/* Users */}
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4">{stats.totalUsers}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setView("users")}>
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Stores */}
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6">Total Stores</Typography>
                <Typography variant="h4">{stats.totalStores}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setView("stores")}>
                  Manage Stores
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Ratings */}
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6">Total Ratings</Typography>
                <Typography variant="h4">{stats.totalRatings}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {view === "users" && <ManageUsers token={token} />}
      {view === "stores" && <ManageStores token={token} />}
    </Container>
  );
};

export default AdminDashboard;