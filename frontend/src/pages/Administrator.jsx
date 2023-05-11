import React, { useState, useEffect } from "react";
import UserForm from "./UserForm";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
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
  const [supraveghetori, setSupraveghetori] = useState([]);
  const [ingrijitori, setIngrijitori] = useState([]);
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
  const fetchSupraveghetori = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/getallsupraveghetori",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setSupraveghetori(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchIngrijitori = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/getallingrijitori",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setIngrijitori(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchSupraveghetori();
    fetchIngrijitori();
  }, [users]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!authenticated) {
    history("/login");
    return null;
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
      if (response.ok) {
        // Handle success
        fetchUsers();
        const data = await response.json();
        toast.success(`${data.msg}`, toastOptions);
      } else {
        const data = await response.json();
        // Handle error
        // data.message in case of JWT expired
        // Handle error with single message
        toast.error(`${data.message || data.msg}`, toastOptions);
      }
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
  function getNonNullId(user) {
    for (const key in user) {
      if (key.startsWith("id_") && user[key] !== null) {
        return {
          userId: user[key],
          name: user["nume"],
          email: user["email"],
          role: user["rol"],
        };
      }
    }
    return "Not found"; // Or any default value you'd like to use
  }

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
                  <CustomTableRow key={getNonNullId(user).email}>
                    {console.log(getNonNullId(user).role)}
                    <CustomTableCell>
                      {getNonNullId(user).userId}
                    </CustomTableCell>
                    <CustomTableCell>{getNonNullId(user).name}</CustomTableCell>
                    <CustomTableCell>
                      {getNonNullId(user).email}
                    </CustomTableCell>
                    <CustomTableCell>
                      <Select
                        value={getNonNullId(user).role}
                        onChange={(event) =>
                          handleRoleChange(getNonNullId(user).userId, event)
                        }
                      >
                        <MenuItem value="Doctor">Doctor</MenuItem>
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
                        onClick={() =>
                          handleDeleteUser(getNonNullId(user).email)
                        }
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <UserForm
            ingrijitori={ingrijitori}
            supraveghetori={supraveghetori}
            fetchUsers={fetchUsers}
            toastOptions={toastOptions}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Administrator;
