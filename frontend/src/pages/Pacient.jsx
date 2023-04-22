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
      console.log(data.data);
      setPacientData(data.data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
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
      </Grid>
    </Container>
  );
};

export default Patient;
