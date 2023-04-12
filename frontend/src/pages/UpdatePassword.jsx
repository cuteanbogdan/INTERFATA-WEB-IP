import React, { useState } from "react";
import { Box, TextField, Typography, Button, Container } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const history = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/email/update-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        }
      );

      if (response.ok) {
        // Handle success
        toast.success("Password updated successfully", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Handle error
        toast.error(`Error updating the password`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <Container maxWidth="sm" className="mt-3">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Box>
        <Typography variant="h5" className="mb-3">
          Update Password
        </Typography>
        <form onSubmit={handleSubmit} name="form1">
          <input type="hidden" name="token" value={token} />
          <Box className="form-group">
            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              id="password"
              placeholder="Please Enter New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Update Password
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default UpdatePassword;
