import axios from "axios";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dob, setDob] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrors((prevErrors) => ({
      ...prevErrors,
      profilePicture: validateInput("profilePicture", file),
    }));
  };

  // Function to validate the form fields
  const validateInput = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "username":
        if (!value || value.trim() === "") {
          errorMessage = "Username is required";
        }
        break;
      case "email":
        if (!value || !/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value || value.length < 8) {
          errorMessage = "Password must be at least 8 characters long";
        }
        break;
      case "mobileNumber":
        if (value && !/^\d{10}$/.test(value)) {
          errorMessage = "Please enter a valid 10 digit mobile number";
        }
        break;
      case "dob":
        if (value) {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(value)) {
            errorMessage = "Please enter a valid date in the format YYYY-MM-DD";
          } else {
            const parts = value.split("-");
            const year = parseInt(parts[0], 10);
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();
            const currentDay = new Date().getDate();
            const month = parseInt(parts[1], 10) - 1; // Months are zero-based
            const day = parseInt(parts[2], 10);

            if (year > currentYear) {
              errorMessage =
                "Birth Year cannot be grater than the current year";
            } else if (year === currentYear && month > currentMonth) {
              errorMessage =
                "Birth Month of the current year cannot be grater than the current month";
            } else if (
              year === currentYear &&
              month === currentMonth &&
              day > currentDay
            ) {
              errorMessage =
                "Birth Date of the month of the current year cannot be grater than the date of the month of the current year";
            } else {
              const date = new Date(year, month, day);
              if (
                date.getFullYear() !== year ||
                date.getMonth() !== month ||
                date.getDate() !== day
              ) {
                errorMessage = "Please enter a valid date";
              }
            }
          }
        }
        break;
      case "profilePicture":
        if (value && value.size > 5000000) {
          errorMessage = "Profile picture must be less than 5MB";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const errorMessage = validateInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    // Update the individual state variables for each input field
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "mobileNumber":
        setMobileNumber(value);
        break;
      case "dob":
        setDob(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = Object.values(errors).every((error) => !error);
    if (!isValid) {
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("mobile_number", mobileNumber);
    formData.append("dob", dob);
    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/register/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Display success message to the user
      toast.success("Registration successful!");
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data) {
        // Assuming the backend sends errors in a dictionary format
        const backendErrors = error.response.data;
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...backendErrors,
        }));
      } else {
        console.error(error); // Handle unexpected errors
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer />
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={handleInputChange}
                error={!!errors.username}
                helperText={errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="mobileNumber"
                label="Mobile Number"
                name="mobileNumber"
                value={mobileNumber}
                onChange={handleInputChange}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="dob"
                label="Date of Birth"
                name="dob"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={dob}
                onChange={handleInputChange}
                error={!!errors.dob}
                helperText={errors.dob}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
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
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegistrationForm;
