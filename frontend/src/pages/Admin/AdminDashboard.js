import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/admin";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";

const AdminDashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats(token);
      setStats(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard stats");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {stats ? (
        <Grid container spacing={3}>
          {/* Users */}
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4">{stats.totalUsers}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/admin/manage-users")}
                >
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
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/admin/manage-stores")}
                >
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
      ) : (
        <Typography>Loading stats...</Typography>
      )}
    </Container>
  );
};

export default AdminDashboard;
