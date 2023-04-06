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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();

  const loginUser = async () => {
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
        console.log(err);
      });
  };

  return (
    <Box
      sx={{
        backgroundSize: "cover",
        height: "100vh",
        overflow: "hidden",
      }}
    >
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
                variant="outlined"
                margin="normal"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                variant="outlined"
                margin="normal"
                fullWidth
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
              <Button variant="contained" fullWidth>
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
