import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import UserForm from "./UserForm";
import axios from "axios";
import { styled } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../utils/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Grid,
} from "@mui/material";

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
const CustomTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "1px solid #e0e0e0",
  color: theme.palette.text.primary,
}));

const CustomTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Administrator = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const history = useNavigate();
  const token = localStorage.getItem("token");
  const { authenticated, loading, userRole } = useAuth();
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getallusers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!authenticated) {
    history("/login");
    return null;
  }
  if (userRole !== "Administrator") {
    toast.error(
      `You are not an Administrator, please login go to ${userRole} page`,
      toastOptions
    );
    history("/login");
  }
  const logoutUser = () => {
    localStorage.removeItem("token");
    history("/login");
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/delete-user/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoleChange = async (userId, event) => {
    const role = event.target.value;
    try {
      const response = await fetch(
        `http://localhost:5000/api/update-user-role/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        }
      );
      const data = await response.json();
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        padding: "2rem",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
            User Management
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <CustomTableCell>ID</CustomTableCell>
                  <CustomTableCell>Name</CustomTableCell>
                  <CustomTableCell>Email</CustomTableCell>
                  <CustomTableCell>Role</CustomTableCell>
                  <CustomTableCell>Action</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <CustomTableRow key={user.id}>
                    <CustomTableCell>{user.id}</CustomTableCell>
                    <CustomTableCell>{user.name}</CustomTableCell>
                    <CustomTableCell>{user.email}</CustomTableCell>
                    <CustomTableCell>
                      <Select
                        value={user.role}
                        onChange={(event) => handleRoleChange(user.id, event)}
                      >
                        <MenuItem value="Medic">Medic</MenuItem>
                        <MenuItem value="Pacient">Pacient</MenuItem>
                        <MenuItem value="Administrator">Administrator</MenuItem>
                        <MenuItem value="Supraveghetor">Supraveghetor</MenuItem>
                        <MenuItem value="Ingrijitor">Ingrijitor</MenuItem>
                      </Select>
                    </CustomTableCell>
                    <CustomTableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </CustomTableCell>
                  </CustomTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            fullWidth
          >
            Create User
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => logoutUser()}
            fullWidth
          >
            Logout
          </Button>
        </Grid>
      </Grid>
      <ToastContainer {...toastOptions} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <UserForm />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Administrator;
