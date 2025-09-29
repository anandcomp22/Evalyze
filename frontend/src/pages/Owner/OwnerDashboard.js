import React, { useEffect, useState, useContext } from "react";
import { getOwnerDashboard, updateOwnerPassword } from "../../api/owner";
import { login, signup, logout } from "../../api/auth";

import { AuthContext } from "../../context/AuthContext";

const OwnerDashboard = ({ onLogout }) => {
  const { user, token, logoutUser } = useContext(AuthContext); 
  const [storeData, setStoreData] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");


  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getOwnerDashboard(token);
      setStoreData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard data");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      return alert("Both fields are required");
    }

    try {
      await updateOwnerPassword({ currentPassword, newPassword }, token);
      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update password");
    }
  };

  const handleLogout = async () => {
    try {
          await logout(token);
          logoutUser();
        } catch (err) {
          console.error(err);
          alert("Failed to logout");
        }
  };

  return (
    <div className="dashboard">
      <h1>Store Owner Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      {storeData ? (
        <div>
          <h2>Store: {storeData.storeName}</h2>
          <p>Address: {storeData.address}</p>
          <p>Average Rating: {storeData.averageRating || "No ratings yet"}</p>

          <h3>Ratings Submitted by Users</h3>
          {storeData.ratings && storeData.ratings.length > 0 ? (
            <ul>
              {storeData.ratings.map((rating, idx) => (
                <li key={idx}>
                  <strong>{rating.userName}</strong> rated {rating.value}/5
                </li>
              ))}
            </ul>
          ) : (
            <p>No ratings submitted yet.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <div style={{ margin: "20px 0" }}>
        <button onClick={() => setShowPasswordForm(!showPasswordForm)}>
          {showPasswordForm ? "Cancel" : "Update Password"}
        </button>

        {showPasswordForm && (
          <div style={{ marginTop: "10px" }}>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={handlePasswordUpdate}>Update</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
