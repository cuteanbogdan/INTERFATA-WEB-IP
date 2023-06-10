import React, { useState, useEffect, useCallback } from "react";
import UserForm from "./UserForm";
import { ToastContainer, toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import useAuth from "../utils/useAuth";
import CenteredSpinner from "../utils/CenteredSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  const { authenticated, loading } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(
        "https://server-ip2023.herokuapp.com/api/getallusers",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  const fetchSupraveghetori = useCallback(async () => {
    try {
      const response = await fetch(
        "https://server-ip2023.herokuapp.com/api/getallsupraveghetori",
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
  }, [token]);

  const fetchIngrijitori = useCallback(async () => {
    try {
      const response = await fetch(
        "https://server-ip2023.herokuapp.com/api/getallingrijitori",
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
  }, [token]);

  useEffect(() => {
    fetchUsers();
    fetchSupraveghetori();
    fetchIngrijitori();
  }, [fetchUsers, fetchSupraveghetori, fetchIngrijitori]);

  if (loading) {
    return <CenteredSpinner />;
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
        `https://server-ip2023.herokuapp.com/api/delete-user/${userId}`,
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

  function getNonNullId(user) {
    for (const key in user) {
      if (key.startsWith("id_") && user[key] !== null) {
        return {
          userId: user[key],
          name: user["nume"],
          prenume: user["prenume"],
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
            Administrare utilizatori
          </Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <Button
            component={Link}
            to="/doctor"
            variant="contained"
            color="primary"
            sx={{ marginRight: "1rem", minWidth: "150px", padding: "0 15px" }}
          >
            Doctor
          </Button>
          <Button
            component={Link}
            to="/ingrijitor"
            variant="contained"
            color="primary"
            sx={{ marginRight: "1rem", minWidth: "150px", padding: "0 15px" }}
          >
            Ingrijitor
          </Button>
          <Button
            component={Link}
            to="/supraveghetor"
            variant="contained"
            color="primary"
            sx={{ minWidth: "150px", padding: "0 15px" }}
          >
            Supraveghetor
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <CustomTableCell>Nume</CustomTableCell>
                  <CustomTableCell>Prenume</CustomTableCell>
                  <CustomTableCell>Email</CustomTableCell>
                  <CustomTableCell>Rol</CustomTableCell>
                  <CustomTableCell>Actiune</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <CustomTableRow key={getNonNullId(user).email}>
                    <CustomTableCell>{getNonNullId(user).name}</CustomTableCell>
                    <CustomTableCell>
                      {getNonNullId(user).prenume}
                    </CustomTableCell>
                    <CustomTableCell>
                      {getNonNullId(user).email}
                    </CustomTableCell>
                    <CustomTableCell>{getNonNullId(user).role}</CustomTableCell>
                    <CustomTableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          handleDeleteUser(getNonNullId(user).email)
                        }
                      >
                        Sterge
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
            onClick={() => {
              setOpen(true);
              fetchIngrijitori();
              fetchSupraveghetori();
            }}
            fullWidth
          >
            Creeaza utilizator
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => logoutUser()}
            fullWidth
          >
            Deconectare
          </Button>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Detalii utilizator</DialogTitle>
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
