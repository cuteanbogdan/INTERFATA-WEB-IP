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
  CssBaseline,
  Avatar,
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
      .post(`https://server-ip2023.herokuapp.com/api/login`, {
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
      <ToastContainer {...toastOptions} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            marginTop: "4rem",
          }}
        >
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
                <Typography component="h1" variant="h5">
                  SmartCare Login
                </Typography>
              </Box>
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
                margin="normal"
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
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, mb: 2 }}
                onClick={loginUser}
              >
                Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <Typography variant="body2" align="center" sx={{ pb: 2 }}>
                    Don't have an account?{" "}
                    <Link href="#">
                      Contact the administrator to create one.
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 2,
              marginTop: "1rem",
            }}
          >
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
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
