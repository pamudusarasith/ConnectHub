import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ userID }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    oldPassword: "",
    password: "", // Password field for updates
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch the user details when the component mounts using the userID
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/user`);
        if (response.data.success) {
          setUser({
            firstName: response.data.data.firstName,
            lastName: response.data.data.lastName,
            username: response.data.data.username,
            email: response.data.data.email,
            oldPassword: "",
            password: "",
          });
        } else if (response.data.code === 401) {
          navigate("/login"); // Navigate to login if not authorized
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };

    fetchUserDetails();
  }, [userID]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      // Save updated first name, last name, username, and password to the backend
      const response = await axios.put(`/api/user`, {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        oldPassword: user.oldPassword,
        password: user.password,
      });
      if (response.data.success) {
        console.log("User data saved", response.data.data);
        // Optionally re-fetch the updated user details
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving user data", error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirmDelete) {
      try {
        // Delete user from the backend
        const response = await axios.delete(`/api/user`);
        if (response.data.success) {
          console.log("User deleted");
          // Optionally, navigate away after deletion, e.g., to the login page
          localStorage.removeItem("token");
          navigate("/login");
          window.location.reload();
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "20px" }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            User Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="First Name"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Last Name"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Username"
                name="username"
                value={user.username}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={user.email}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              {isEditing && (
                <TextField
                  label="Old Password"
                  name="oldPassword"
                  type="password"
                  value={user.oldPassword}
                  onChange={handleChange}
                  fullWidth
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {isEditing && (
                <TextField
                  label="New Password"
                  name="password"
                  type="password"
                  value={user.password}
                  onChange={handleChange}
                  fullWidth
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {isEditing ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  fullWidth
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  fullWidth
                >
                  Edit
                </Button>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDelete}
                fullWidth
              >
                Delete Account
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile;
