import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Link,
  Container,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const history = useNavigate();
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
  const loginUser = async () => {
    setIsSubmitted(true);
    return axios
      .post(`http://localhost:5000/api/login`, {
        email,
        password,
      })
      .then(async (response) => {
        await console.log(response.data);
        localStorage.setItem("token", response.data.token);
        history("/administrator");
      })
      .catch((err) => {
        toast.error(`${err.response.data.msg}`, toastOptions);
      });
  };
  const [isValid, setIsValid] = useState(false);

  const handleChange = (event) => {
    setEmail(event.target.value);
    setIsValid(event.target.checkValidity());
  };
  return (
    <Box
      sx={{
        backgroundSize: "cover",
        height: "100vh",
        overflow: "hidden",
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
      <Container maxWidth="sm" sx={{ height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Card sx={{ minWidth: 275, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "center" }}></Box>
              <Typography variant="h5" align="center" gutterBottom>
                SmartCare Login
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
              />
              <TextField
                label="Password"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </CardContent>
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <Button variant="contained" onClick={loginUser}>
                Login
              </Button>
            </Box>
            <Typography variant="subtitle2" align="center" sx={{ pb: 2 }}>
              Don't have an account?{" "}
              <Link href="#">Contact the administrator to create one.</Link>
            </Typography>
          </Card>
          <Grid
            sx={{ display: "flex", justifyContent: "center", p: 2 }}
            container
            spacing={2}
          >
            <Grid item xs={6}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => history("/change-password")}
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
