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
} from "@mui/material";
import { Link } from "react-router-dom";
import PacientForm from "./PacientForm";

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
  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setOpen(true);
    // setFormData({
    //   name: patient.name,
    //   age: patient.age,
    //   gender: patient.gender,
    //   medicalCondition: patient.medicalCondition,
    //   alarmParameters: {
    //     heartRate: patient.alarmParameters.heartRate,
    //     bloodPressure: patient.alarmParameters.bloodPressure,
    //     temperature: patient.alarmParameters.temperature,
    //   },
    // });
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
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAlarmChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      alarmParameters: {
        ...formData.alarmParameters,
        [name]: value,
      },
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetch(`/api/patients/${selectedPatient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      setPatients(
        patients.map((patient) => {
          if (patient.id === selectedPatient.id) {
            return {
              ...patient,
              name: formData.name,
              age: formData.age,
              gender: formData.gender,
              medicalCondition: formData.medicalCondition,
              alarmParameters: {
                heartRate: formData.alarmParameters.heartRate,
                bloodPressure: formData.alarmParameters.bloodPressure,
                temperature: formData.alarmParameters.temperature,
              },
            };
          } else {
            return patient;
          }
        })
      );
      setSelectedPatient(null);
      setOpen(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Typography variant="h3" style={{ marginTop: "20px" }}>
        Patients List
      </Typography>
      <Box
        sx={{
          width: "20%",
          position: "fixed",
          top: 0,
          right: 0,
          padding: "1rem",
        }}
      >
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create Pacient
        </Button>
        <Button variant="contained" onClick={() => logoutUser()}>
          Logout
        </Button>
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
          <DialogTitle>Create Pacient</DialogTitle>
          <DialogContent>
            <PacientForm />
          </DialogContent>
        </Dialog>
      </Box>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
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
                    component={Link}
                    to={`/patient/${patient.id}`}
                    variant="outlined"
                  >
                    View
                  </Button>{" "}
                  <Button
                    variant="outlined"
                    onClick={() => handleEdit(patient)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="outlined"
                    color="error"
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
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedPatient(null);
          setFormData(initialFormData);
        }}
        aria-labelledby="edit-patient-modal"
        aria-describedby="modal for editing patient"
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
    </div>
  );
};
export default Medic;
