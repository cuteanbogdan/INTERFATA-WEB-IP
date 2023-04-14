import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Modal,
  Backdrop,
  Fade,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import PacientForm from "./PacientForm";
import useAuthRoles from "../utils/useAuthRoles";

const initialFormData = {
  name: "",
  age: "",
  gender: "",
  medicalCondition: "",
  alarmParameters: {
    heartRate: "",
    bloodPressure: "",
    temperature: "",
  },
};

const Medic = () => {
  const token = localStorage.getItem("token");
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const history = useNavigate();
  const { authenticated, loading, userRole } = useAuthRoles([
    "Administrator",
    "Medic",
  ]);

  // Fetch patients data from server and set the state
  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getallpacients", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPatients(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);
  const logoutUser = () => {
    localStorage.removeItem("token");
    history("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    logoutUser();
    return null;
  }

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  const handleDeletePacient = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/delete-pacient/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPatients();
    } catch (error) {
      console.log(error);
    }
  };
  const handleFormChange = (event) => {
    // const { name, value } = event.target;
    // setFormData({
    //   ...formData,
    //   [name]: value,
    // });
  };

  const handleAlarmChange = (event) => {
    // const { name, value } = event.target;
    // setFormData({
    //   ...formData,
    //   alarmParameters: {
    //     ...formData.alarmParameters,
    //     [name]: value,
    //   },
    // });
  };

  const handleFormSubmit = async (event) => {
    // event.preventDefault();
    // try {
    //   await fetch(`/api/patients/${selectedPatient.id}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });
    //   setPatients(
    //     patients.map((patient) => {
    //       if (patient.id === selectedPatient.id) {
    //         return {
    //           ...patient,
    //           name: formData.name,
    //           age: formData.age,
    //           gender: formData.gender,
    //           medicalCondition: formData.medicalCondition,
    //           alarmParameters: {
    //             heartRate: formData.alarmParameters.heartRate,
    //             bloodPressure: formData.alarmParameters.bloodPressure,
    //             temperature: formData.alarmParameters.temperature,
    //           },
    //         };
    //       }
    //       return patient;
    //     })
    //   );
    //   setOpen(false);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    history(`/patient/${patient.id}`);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Patients
          </Typography>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Medical Condition</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.medicalCondition}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleView(patient)}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(patient)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDeletePacient(patient.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenCreate(true)}
          >
            Create New Patient
          </Button>
        </Grid>
      </Grid>{" "}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Fade in={open}>
          <Box
            sx={{
              backgroundColor: "background.paper",
              boxShadow: 24,
              borderRadius: 1,
              p: 3,
              width: "50%",
              maxWidth: 700,
              maxHeight: "100vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h4" gutterBottom>
              Edit Patient
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <form onSubmit={handleFormSubmit}>
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="age"
                label="Age"
                variant="outlined"
                fullWidth
                value={formData.age}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  label="Gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="medicalCondition"
                label="Medical Condition"
                variant="outlined"
                fullWidth
                value={formData.medicalCondition}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Alarm Parameters
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <TextField
                name="heartRate"
                label="
                Heart Rate"
                variant="outlined"
                fullWidth
                value={formData.heartRate}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="oxygenLevel"
                label="Oxygen Level"
                variant="outlined"
                fullWidth
                value={formData.oxygenLevel}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>{" "}
              <Button
                variant="contained"
                onClick={() => {
                  setOpen(false);
                  setSelectedPatient(null);
                  setFormData(initialFormData);
                }}
              >
                Cancel
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create New Patient</DialogTitle>
        <DialogContent>
          <PacientForm
            formData={initialFormData}
            handleFormChange={handleFormChange}
            handleAlarmChange={handleAlarmChange}
            handleFormSubmit={handleFormSubmit}
            setOpen={setOpenCreate}
          />
        </DialogContent>
      </Dialog>
      <Button
        variant="outlined"
        color="error"
        onClick={logoutUser}
        sx={{ position: "absolute", right: 4, top: 4 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Medic;