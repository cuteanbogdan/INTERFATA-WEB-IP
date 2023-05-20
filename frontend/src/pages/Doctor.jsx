import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

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

const dateMedicale = {
  antcedente: "",
  istoric_consultatii: "",
  urmatoarea_consultatie: "",
  alergii: "",
  afectiuni_cronice: "",
  diagnostic_curent: "",
  diagnostic_istoric: "",
  medicatie_curenta: "",
  medicatie_istoric: "",
};

const datePacient = {
  cnp: "",
  nume: "",
  prenume: "",
  adresa: "",
  nr_tel: "",
  nr_tel_pers_contact: "",
  email: "",
  profesie: "",
  loc_munca: "",
  varsta: "",
};

const dateParametrii = {
  TA_min: "",
  TA_max: "",
  puls_min: "",
  puls_maax: "",
  temp_corp_min: "",
  temp_corp_max: "",
  greutate_min: "",
  greuatate_max: "",
  glicemie_min: "",
  glicemie_max: "",
  temp_amb_min: "",
  temp_amb_max: "",
  saturatie_gaz_min: "",
  saturatie_gaz_max: "",
  umiditate_min: "",
  umiditate_max: "",
  proximitate_max: "",
  proximitate_min: "",
};

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

const Doctor = () => {
  const token = localStorage.getItem("token");
  const [patients, setPatients] = useState([]);
  const [supraveghetori, setSupraveghetori] = useState([]);
  const [ingrijitori, setIngrijitori] = useState([]);
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formDateMedicale, setFormDateMedicale] = useState(dateMedicale);
  const [formDatePacient, setFormDatePacient] = useState(datePacient);
  const [formDateParametrii, setFormDateParametrii] = useState(dateParametrii);
  const history = useNavigate();
  const { authenticated, loading, userRole } = useAuthRoles([
    "Administrator",
    "Doctor",
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
    fetchPatients();
    fetchSupraveghetori();
    fetchIngrijitori();
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
    fetchPatientDetails(patient.id_pacient);
    fetchDateMedicalePatient(patient.id_medical);
    fetchParametri(patient.id_parametru);
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
      if (response.ok) {
        // Handle success
        fetchPatients();
        const data = await response.json();
        toast.success(`${data.msg}`, toastOptions);
      } else {
        const data = await response.json();
        // Handle error
        // data.message in case of JWT expired
        // Handle error with single message
        toast.error(`${data.message || data.msg}`, toastOptions);
      }
      fetchPatients();
    } catch (error) {
      console.log(error);
    }
  };
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormDateMedicale({
      ...formDateMedicale,
      [name]: value,
    });
  };
  const handleFormDatePacient = (event) => {
    const { name, value } = event.target;
    setFormDatePacient({
      ...formDatePacient,
      [name]: value,
    });
  };

  const handleDateColectateFormChange = (event) => {
    const { name, value } = event.target;
    setFormDateParametrii({
      ...formDateParametrii,
      [name]: value,
    });
  };

  const updatePatientDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/update-pacient-details/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDatePacient),
        }
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.msg);
      }

      console.log("Patient details updated successfully");
    } catch (error) {
      console.error(`Failed to update patient details: ${error}`);
    }
  };

  const updateDateMedicalePatient = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/update-date-medicale/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDateMedicale),
        }
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.msg);
      }

      console.log("Medical patient data updated successfully");
    } catch (error) {
      console.error(`Failed to update medical patient data: ${error}`);
    }
  };

  const updateParametri = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/update-parametri/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDateParametrii),
        }
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.msg);
      }

      console.log("Medical patient data updated successfully");
    } catch (error) {
      console.error(`Failed to update medical patient data: ${error}`);
    }
  };

  const fetchPatientDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/get-pacient-details/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      let newFormData = { ...formDatePacient }; // create a copy of the current form data
      for (const key in data.data) {
        if (newFormData.hasOwnProperty(key)) {
          newFormData[key] = data.data[key];
        }
      }

      setFormDatePacient(newFormData);
    } catch (error) {
      console.error(`Failed to fetch patient details: ${error}`);
    }
  };
  const fetchParametri = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/get-parametri/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      let newFormData = { ...formDateParametrii }; // create a copy of the current form data
      for (const key in data.data) {
        if (newFormData.hasOwnProperty(key)) {
          newFormData[key] = data.data[key];
        }
      }

      setFormDateParametrii(newFormData);
    } catch (error) {
      console.error(`Failed to fetch parametri details: ${error}`);
    }
  };
  const fetchDateMedicalePatient = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/get-date-medicale-patient/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      let newFormData = { ...formDateMedicale }; // create a copy of the current form data
      for (const key in data.data) {
        if (newFormData.hasOwnProperty(key)) {
          newFormData[key] = data.data[key];
        }
      }
      setFormDateMedicale(newFormData);
    } catch (error) {
      console.error(`Failed to fetch medical data: ${error}`);
    }
  };

  const handleSubmitPatientsDetails = (event) => {
    event.preventDefault();
    updatePatientDetails(selectedPatient.id_pacient);
  };

  const handleSubmitDateMedicalePatient = (event) => {
    event.preventDefault();
    updateDateMedicalePatient(selectedPatient.id_medical);
  };

  const handleSubmitDateColectate = (event) => {
    event.preventDefault();
    updateParametri(selectedPatient.id_parametru);
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    history(`/pacient/${patient.id_pacient}`);
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 4 }}>
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
                  <TableCell>CNP</TableCell>
                  <TableCell>Nume</TableCell>
                  <TableCell>Prenume</TableCell>
                  <TableCell>Varsta</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id_pacient}>
                    <TableCell>{patient.cnp}</TableCell>
                    <TableCell>{patient.nume}</TableCell>
                    <TableCell>{patient.prenume}</TableCell>
                    <TableCell>{patient.varsta}</TableCell>
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
                        onClick={() => handleDeletePacient(patient.id_pacient)}
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
            <form onSubmit={handleSubmitPatientsDetails}>
              <TextField
                name="cnp"
                label="CNP"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                value={formDatePacient.cnp}
                onChange={handleFormDatePacient}
              />
              <TextField
                name="nume"
                label="Nume"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                value={formDatePacient.nume}
                onChange={handleFormDatePacient}
              />
              <TextField
                name="prenume"
                label="Prenume"
                variant="outlined"
                margin="normal"
                fullWidth
                value={formDatePacient.prenume}
                onChange={handleFormDatePacient}
              />
              <TextField
                name="varsta"
                label="Varsta"
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                value={formDatePacient.varsta}
                onChange={formDatePacient.handleFormDatePacient}
              />
              <TextField
                name="adresa"
                label="Adresa"
                variant="outlined"
                margin="normal"
                fullWidth
                value={formDatePacient.adresa}
                onChange={handleFormDatePacient}
              />
              <TextField
                name="nr_tel"
                label="Numar de telefon"
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                value={formDatePacient.nr_tel}
                onChange={handleFormDatePacient}
              />
              <TextField
                name="nr_tel_pers_contact"
                label="Numar telefon persoana de contact"
                variant="outlined"
                margin="normal"
                fullWidth
                value={formDatePacient.nr_tel_pers_contact}
                onChange={handleFormDatePacient}
              />
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                value={formDatePacient.email}
                onChange={handleFormDatePacient}
              />
              <TextField
                name="profesie"
                label="Profesie"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                value={formDatePacient.profesie}
                onChange={handleFormDatePacient}
              />
              <TextField
                name="loc_munca"
                label="Loc de munca"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                value={formDatePacient.loc_munca}
                onChange={handleFormDatePacient}
              />
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </form>

            <form onSubmit={handleSubmitDateMedicalePatient}>
              <Typography variant="h5" gutterBottom>
                Date medicale
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <TextField
                name="antcedente"
                label="
                Antecedente"
                variant="outlined"
                fullWidth
                value={formDateMedicale.antcedente}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="istoric_consultatii"
                label="
                Istoric consultatii"
                variant="outlined"
                fullWidth
                value={formDateMedicale.istoric_consultatii}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="urmatoarea_consultatie"
                label="
                Urmatoarea consultatie"
                variant="outlined"
                fullWidth
                value={formDateMedicale.urmatoarea_consultatie}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="alergii"
                label="
                Alergii"
                variant="outlined"
                fullWidth
                value={formDateMedicale.alergii}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="afectiuni_cronice"
                label="
                Afectiuni cronice"
                variant="outlined"
                fullWidth
                value={formDateMedicale.afectiuni_cronice}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="diagnostic_curent"
                label="
                Diagnostic curent"
                variant="outlined"
                fullWidth
                value={formDateMedicale.diagnostic_curent}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="diagnostic_istoric"
                label="
                Diagnostic istoric"
                variant="outlined"
                fullWidth
                value={formDateMedicale.diagnostic_istoric}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="medicatie_curenta"
                label="
                Medicatie curenta"
                variant="outlined"
                fullWidth
                value={formDateMedicale.medicatie_curenta}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="medicatie_istoric"
                label="
                Medicatie istoric"
                variant="outlined"
                fullWidth
                value={formDateMedicale.medicatie_istoric}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setOpen(false);
                  setSelectedPatient(null);
                  setFormDateMedicale(formDateMedicale);
                }}
              >
                Cancel
              </Button>
            </form>

            <form onSubmit={handleSubmitDateColectate}>
              <Typography variant="h5" gutterBottom>
                Date colectate
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
              <TextField
                name="TA_min"
                label="
                Tensiune minima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.TA_min}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="TA_max"
                label="
                Tensiune maxima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.TA_max}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="puls_min"
                label="
                Puls minim"
                variant="outlined"
                fullWidth
                value={formDateParametrii.puls_min}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="puls_maax"
                label="
                Puls maxim"
                variant="outlined"
                fullWidth
                value={formDateParametrii.puls_maax}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="temp_corp_min"
                label="
                Temperatura corp minima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.temp_corp_min}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="temp_corp_max"
                label="
                Temperatura corp maxima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.temp_corp_max}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="greutate_min"
                label="
                Greutate minima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.greutate_min}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="greuatate_max"
                label="
                Greutate maxima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.greuatate_max}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="glicemie_min"
                label="
                Glicemie minima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.glicemie_min}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="glicemie_max"
                label="
                Glicemie maxima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.glicemie_max}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="temp_amb_min"
                label="
                Temperatura ambianta minima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.temp_amb_min}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="temp_amb_max"
                label="
                Temperatura ambianta maxima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.temp_amb_max}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="saturatie_gaz_min"
                label="
                Saturatie gaz minima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.saturatie_gaz_min}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="saturatie_gaz_max"
                label="
                Saturatie gaz maxima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.saturatie_gaz_max}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="umiditate_min"
                label="
                Umiditate minima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.umiditate_min}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="umiditate_max"
                label="
                Umiditate maxima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.umiditate_max}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="proximitate_min"
                label="
                Proximitate minima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.proximitate_min}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <TextField
                name="proximitate_max"
                label="
                Proximitate maxima"
                variant="outlined"
                fullWidth
                value={formDateParametrii.proximitate_max}
                onChange={handleDateColectateFormChange}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setOpen(false);
                  setSelectedPatient(null);
                  setFormDateMedicale(formDateMedicale);
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
            ingrijitori={ingrijitori}
            supraveghetori={supraveghetori}
            fetchPatients={fetchPatients}
            toastOptions={toastOptions}
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

export default Doctor;
