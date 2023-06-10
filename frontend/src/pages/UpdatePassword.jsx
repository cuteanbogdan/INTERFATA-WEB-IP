import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};
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
        "https://server-ip2023.herokuapp.com/email/update-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle success
        toast.success(`${data.msg}`, toastOptions);
        history("/login");
      } else {
        const data = await response.json();
        // Handle error
        toast.error(`${data.msg}`, toastOptions);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
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
      <Container maxWidth="md" sx={{ height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Card
            sx={{
              width: "100%",
              minHeight: "50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>
                Actualizare parola
              </Typography>
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="token" value={token} />
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  fullWidth
                  id="password"
                  placeholder="Introduceti parola noua.."
                  value={password}
                  required
                  inputProps={{ minLength: 6 }}
                  error={password.length > 0 && password.length < 6}
                  helperText={
                    password.length > 0 &&
                    password.length < 6 &&
                    "Parola trebuie sa aiba minim 6 caractere"
                  }
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    width: "120%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <Button type="submit" variant="contained">
                    Actualizeaza parola
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default UpdatePassword;
