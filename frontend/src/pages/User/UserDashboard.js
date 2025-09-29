import React, { useEffect, useState, useContext } from "react";
import { getStores, submitRating, modifyRating, updatePassword } from "../../api/user";
import { logout } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";

const UserDashboard = () => {
  const { user, token, logoutUser } = useContext(AuthContext); 
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [ratings, setRatings] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (token) fetchStores();
  }, [token]);

  const fetchStores = async () => {
    try {
      const res = await getStores(token);
      setStores(res.data.stores || []);
      const initialRatings = {};
      res.data.stores.forEach(store => {
        initialRatings[store.id] = store.userRating || "";
      });
      setRatings(initialRatings);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stores");
    }
  };

  const handleRatingChange = (storeId, value) => {
    setRatings(prev => ({ ...prev, [storeId]: value }));
  };

  const handleSubmitRating = async (storeId) => {
    const ratingValue = parseInt(ratings[storeId]);
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return alert("Rating must be between 1 and 5");
    }

    try {
      const store = stores.find(s => s.id === storeId);
      if (store.userRating) {
        await modifyRating({ storeId, rating: ratingValue }, token);
        alert("Rating updated successfully");
      } else {
        await submitRating({ storeId, rating: ratingValue }, token);
        alert("Rating submitted successfully");
      }
      fetchStores();
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      return alert("Both fields are required");
    }

    try {
      await updatePassword({ currentPassword, newPassword }, token);
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

  if (!user) return <p>Loading...</p>;

  const filteredStores = stores.filter(
    store =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}</h1>
      <button onClick={handleLogout}>Logout</button>

      <input
        type="text"
        placeholder="Search by store name or address..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ margin: "10px 0", padding: "5px", width: "300px" }}
      />

      <div className="store-list">
        {filteredStores.map(store => (
          <div key={store.id} className="store-card" style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{store.name}</h3>
            <p>Address: {store.address}</p>
            <p>Average Rating: {store.averageRating || "Not rated yet"}</p>
            <p>Your Rating: {store.userRating || "Not rated yet"}</p>

            <input
              type="number"
              min="1"
              max="5"
              value={ratings[store.id] || ""}
              onChange={e => handleRatingChange(store.id, e.target.value)}
              placeholder="Rate 1-5"
            />
            <button onClick={() => handleSubmitRating(store.id)}>
              {store.userRating ? "Update Rating" : "Submit Rating"}
            </button>
          </div>
        ))}
      </div>

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
              onChange={e => setCurrentPassword(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ marginRight: "10px", padding: "5px" }}
            />
            <button onClick={handlePasswordUpdate}>Update</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
