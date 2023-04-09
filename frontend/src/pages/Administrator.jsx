import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import UserForm from "./UserForm";
import axios from "axios";
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
      console.log(data);
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
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          flex: 1,
          padding: "1rem",
        }}
      >
        <TableContainer component={Paper} style={{ marginTop: "4rem" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
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
      <Box
        sx={{
          width: "20%",
          position: "fixed",
          top: 0,
          right: 0,
          padding: "1rem",
        }}
      >
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create User
        </Button>
        <Button variant="contained" onClick={() => logoutUser()}>
          Logout
        </Button>
      </Box>

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
