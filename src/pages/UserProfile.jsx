import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/UserAuth";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UserProfile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.patch(
        "http://localhost:8000/api/user-deactivate/",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        toast.warn("Your account has been deactivated.");
        logout();
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to deactivate account:", err);
      alert("Failed to deactivate account. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/userprofile/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mx-auto w-full flex justify-center text-4xl font-bold mb-4">
        User Profile
      </h1>
      {userData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <img
            src={userData.profile_picture}
            alt={userData.username}
            className="h-64 rounded-full object-contain shadow-md"
          />
          <div className="p-10 flex gap-3 flex-col">
            <p className="font-semibold text-lg">
              Username: {userData.username}
            </p>
            <p className="font-semibold text-lg">Email: {userData.email}</p>
            <p className="font-semibold text-lg">
              Mobile Number: {userData.mobile_number}
            </p>
            <p className="font-semibold text-lg">
              Date of Birth: {userData.dob}
            </p>
          </div>
        </div>
      )}
      <div className="mt-8 flex justify-center gap-3">
        <a href="/profile-update">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update Profile
          </button>
        </a>
        <button
          onClick={handleClickOpenDialog}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete Account
        </button>
      </div>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete the account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteAccount}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserProfile;
