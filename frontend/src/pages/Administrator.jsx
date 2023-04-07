import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", email: "alice@example.com", role: "pacient" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "pacient" },
    { id: 3, name: "Charlie", email: "charlie@example.com", role: "admin" },
  ]);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const [open, setOpen] = useState(false);
  const history = useNavigate();

  const { authenticated, loading, userRole } = useAuth();

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

  const handleUserDetailsChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails,
      [name]: value,
    }));
  };

  const handleCreateUserClick = () => {
    // TODO: create a new user with the userDetails data
    setUserDetails({
      name: "",
      email: "",
      role: "user",
    });
  };

  const handleRoleChange = (userId, event) => {
    const { value } = event.target;
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      const userIndex = updatedUsers.findIndex((user) => user.id === userId);
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        role: value,
      };
      return updatedUsers;
    });
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
                      <MenuItem value="pacient">Pacient</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
          <TextField
            label="Name"
            name="name"
            value={userDetails.name}
            onChange={handleUserDetailsChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={userDetails.email}
            onChange={handleUserDetailsChange}
            fullWidth
            margin="normal"
          />
          <Select
            label="Role"
            name="role"
            value={userDetails.role}
            onChange={handleUserDetailsChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleCreateUserClick();
              setOpen(false);
            }}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Administrator;
