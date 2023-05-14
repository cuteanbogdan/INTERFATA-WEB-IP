import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
import useAuthRoles from "../utils/useAuthRoles";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "15px",
}));
const Patient = () => {
  const [pacientData, setPacientData] = useState(null);
  const token = localStorage.getItem("token");
  const { authenticated, loading, userRole } = useAuthRoles([
    "Administrator",
    "Doctor",
    "Pacient",
  ]);
  const history = useNavigate();
  const { id } = useParams();
  const fetchPatient = async () => {
    try {
      const responsePacient = await fetch(
        `http://localhost:5000/api/get-pacient-details/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataPacient = await responsePacient.json();

      const responseMedicale = await fetch(
        `http://localhost:5000/api/get-date-medicale-patient/${dataPacient.data.id_medical}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataMedicale = await responseMedicale.json();

      setPacientData({ ...dataPacient.data, ...dataMedicale.data });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchPatient();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!authenticated) {
    history("/login");
    return null;
  }
  if (!pacientData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <Box display="flex" alignItems="center">
              <Avatar>{pacientData.nume.charAt(0)}</Avatar>
              <Box ml={2}>
                <Typography variant="h5" gutterBottom>
                  {pacientData.nume} {pacientData.prenume}
                </Typography>
                <Typography variant="subtitle1">{pacientData.rol}</Typography>
              </Box>
            </Box>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Personal Details
            </Typography>
            <Typography>
              <strong>CNP:</strong> {pacientData.cnp}
            </Typography>
            <Typography>
              <strong>Adresa:</strong> {pacientData.adresa}
            </Typography>
            <Typography>
              <strong>Nr. Tel:</strong> {pacientData.nr_tel}
            </Typography>
            <Typography>
              <strong>Nr. Tel Pers. Contact:</strong>{" "}
              {pacientData.nr_tel_pers_contact}
            </Typography>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} sm={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Work & Education
            </Typography>
            <Typography>
              <strong>Email:</strong> {pacientData.email}
            </Typography>
            <Typography>
              <strong>Profesie:</strong> {pacientData.profesie}
            </Typography>
            <Typography>
              <strong>Loc Munca:</strong> {pacientData.loc_munca}
            </Typography>
            <Typography>
              <strong>Varsta:</strong> {pacientData.varsta}
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Medical Details
            </Typography>
            <Typography>
              <strong>Antecedente:</strong> {pacientData.antcedente}
            </Typography>
            <Typography>
              <strong>Istoric Consultatii:</strong>
              {pacientData.istoric_consultatii}
            </Typography>
            <Typography>
              <strong>Urmatoarea Consultatie:</strong>
              {pacientData.urmatoarea_consultatie}
            </Typography>
            <Typography>
              <strong>Alergii:</strong> {pacientData.alergii}
            </Typography>
            <Typography>
              <strong>Afectiuni Cronice:</strong>
              {pacientData.afectiuni_cronice}
            </Typography>
            <Typography>
              <strong>Diagnostic Curent:</strong>
              {pacientData.diagnostic_curent}
            </Typography>
            <Typography>
              <strong>Diagnostic Istoric:</strong>
              {pacientData.diagnostic_istoric}
            </Typography>
            <Typography>
              <strong>Medicatie Curenta:</strong>
              {pacientData.medicatie_curenta}
            </Typography>
            <Typography>
              <strong>Medicatie Istoric:</strong>
              {pacientData.medicatie_istoric}
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Patient;
