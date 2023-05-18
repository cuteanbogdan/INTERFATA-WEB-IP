import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import useAuthRoles from "../utils/useAuthRoles";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  marginRight: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: "15px",
  backgroundColor: theme.palette.grey[100],
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
        `https://server-ip2023.herokuapp.com/api/get-pacient-details/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataPacient = await responsePacient.json();

      const responseMedicale = await fetch(
        `https://server-ip2023.herokuapp.com/api/get-date-medicale-patient/${dataPacient.data.id_medical}`,
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
          <StyledCard>
            <CardHeader
              avatar={<StyledAvatar>{pacientData.nume.charAt(0)}</StyledAvatar>}
              action={
                <IconButton>
                  <EditIcon />
                </IconButton>
              }
              title={`${pacientData.nume} ${pacientData.prenume}`}
              subheader={pacientData.rol}
            />
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6}>
          <StyledCard>
            <CardHeader
              title="Personal Details"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
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
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6}>
          <StyledCard>
            <CardHeader
              title="Work & Education"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
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
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6}>
          <StyledCard>
            <CardHeader
              title="Medical Details"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Typography>
                <strong>Antecedente:</strong> {pacientData.antcedente}
              </Typography>
              <Typography>
                <strong>Istoric Consultatii:</strong>{" "}
                {pacientData.istoric_consultatii}
              </Typography>
              <Typography>
                <strong>Urmatoarea Consultatie:</strong>{" "}
                {pacientData.urmatoarea_consultatie}
              </Typography>
              <Typography>
                <strong>Alergii:</strong> {pacientData.alergii}
              </Typography>
              <Typography>
                <strong>Afectiuni Cronice:</strong>{" "}
                {pacientData.afectiuni_cronice}
              </Typography>
              <Typography>
                <strong>Diagnostic Curent:</strong>{" "}
                {pacientData.diagnostic_curent}
              </Typography>
              <Typography>
                <strong>Diagnostic Istoric:</strong>{" "}
                {pacientData.diagnostic_istoric}
              </Typography>
              <Typography>
                <strong>Medicatie Curenta:</strong>{" "}
                {pacientData.medicatie_curenta}
              </Typography>
              <Typography>
                <strong>Medicatie Istoric:</strong>{" "}
                {pacientData.medicatie_istoric}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard>
            <CardHeader
              title="Additional Information"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Typography>
                <strong>Other details:</strong> {pacientData.additional_details}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Patient;
