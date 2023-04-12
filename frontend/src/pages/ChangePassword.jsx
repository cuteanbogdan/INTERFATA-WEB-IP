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
          // Handle success
          console.log("Password reset link sent successfully to:", email);
        } else {
          // Handle error
          console.log("Error sending password reset link");
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
                Change Password
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
                  isSubmitted &&
                  !isValid &&
                  "Please enter a valid email address"
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
                Reset Password
              </Button>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default ChangePassword;
