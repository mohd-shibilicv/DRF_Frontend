// UserProfileUpdate.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../context/UserAuth";
import { Avatar, Button, Grid } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UserProfileUpdate() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({
    username: currentUser.username || "",
    email: currentUser.email || "",
    mobile_number: currentUser.mobile_number || "",
    dob: currentUser.dob || "",
    newProfilePicture: null,
    isActive: currentUser.is_active || true,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState(currentUser.profile_picture);

  useEffect(() => {
    if (currentUser) {
      setUserData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        mobile_number: currentUser.mobile_number || "",
        dob: currentUser.dob || "",
        profile_picture: currentUser.profile_picture || "",
        is_active: currentUser.is_active || true,
      });
      setLoading(false);
    }
  }, [currentUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new FormData();

      // Append all user data fields except profile_picture to formData
      Object.keys(userData)
        .filter((key) => key !== "profile_picture")
        .forEach((key) => {
          formData.append(key, userData[key]);
        });

      if (userData.newProfilePicture instanceof File) {
        formData.append("profile_picture", userData.newProfilePicture);
      }

      const response = await axios.put(
        "http://localhost:8000/api/user-update/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        navigate("/profile");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUserData({ ...userData, newProfilePicture: file });
    setPreviewUrl(URL.createObjectURL(file));
  };
  

  if (!currentUser || loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4">Error: {error}</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h2 className="mx-auto flex justify-center text-2xl font-bold mb-4">
        Update User Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="block w-full border border-gray-300 rounded-md p-2"
          onChange={(e) =>
            setUserData({ ...userData, username: e.target.value })
          }
          value={userData.username}
          required
        />
        <input
          type="text"
          placeholder="Email"
          className="block w-full border border-gray-300 rounded-md p-2"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          value={userData.email}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full border border-gray-300 rounded-md p-2"
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          defaultValue="********"
          required
        />
        <input
          type="tel"
          placeholder="Mobile Number"
          className="block w-full border border-gray-300 rounded-md p-2"
          onChange={(e) =>
            setUserData({ ...userData, mobile_number: e.target.value })
          }
          value={userData.mobile_number}
          required
        />
        <input
          type="date"
          placeholder="Date of Birth"
          className="block w-full border border-gray-300 rounded-md p-2"
          onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
          value={userData.dob}
          required
        />
        <Grid item xs={12}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handleFileUpload}
          />
          <label htmlFor="raised-button-file">
            <Button
              className="w-full border"
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Profile Picture
            </Button>
          </label>
        </Grid>
        {previewUrl && (
          <Grid item xs={12} className="flex justify-center mx-auto">
            <Avatar
              alt="Profile Preview"
              src={previewUrl}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
        )}
        <button
          type="submit"
          className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default UserProfileUpdate;
