import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
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
const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleChange = (event) => {
    setEmail(event.target.value);
    setIsValid(event.target.checkValidity());
  };

  const handlePasswordReset = async () => {
    setIsSubmitted(true);
    if (isValid) {
      try {
        const response = await fetch(
          "http://localhost:5000/email/change-password-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Handle success
          toast.success(`${data.msg} ${email}`, toastOptions);
        } else {
          const data = await response.json();
          // Handle error
          toast.error(`${data.msg}`, toastOptions);
        }
      } catch (error) {
        console.log("Error:", error);
      }
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
                Schimba parola
              </Typography>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                value={email}
                error={isSubmitted && !isValid}
                helperText={
                  isSubmitted && !isValid && "Introduceti o adresa valida!"
                }
                onChange={handleChange}
                sx={{
                  width: "120%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </CardContent>
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <Button variant="contained" onClick={handlePasswordReset}>
                Reseteaza parola
              </Button>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default ChangePassword;
