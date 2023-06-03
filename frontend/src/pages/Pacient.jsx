import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import useAuthRoles from "../utils/useAuthRoles";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import CardHeader from "@mui/material/CardHeader";
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
  const { authenticated, loading } = useAuthRoles([
    "Administrator",
    "Doctor",
    "Pacient",
  ]);
  const history = useNavigate();
  const { id } = useParams();
  const fetchPatient = useCallback(async () => {
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

      const responseColectate = await fetch(
        `http://localhost:5000/api/get-date-colectate-patient/${dataPacient.data.id_colectie}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dataMedicale = await responseMedicale.json();
      const dataColectate = await responseColectate.json();
      setPacientData({
        ...dataPacient.data,
        ...dataMedicale.data,
        ...dataColectate.data,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [id, token]);
  useEffect(() => {
    fetchPatient();
  }, [id, fetchPatient]);

  const logoutUser = () => {
    localStorage.removeItem("token");
    history("/login");
  };

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
      <Grid container spacing={3} style={{ marginTop: "10px" }}>
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader
              avatar={<StyledAvatar>{pacientData.nume.charAt(0)}</StyledAvatar>}
              action={
                <Button variant="outlined" color="error" onClick={logoutUser}>
                  Logout
                </Button>
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
        <Grid item xs={12} sm={6}>
          <StyledCard>
            <CardHeader
              title="Collected Details"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Typography>
                <strong>Tensiunea arteriala:</strong> {pacientData.TA}
              </Typography>
              <Typography>
                <strong>Glicemie:</strong> {pacientData.glicemie}
              </Typography>
              <Typography>
                <strong>Grad iluminare:</strong> {pacientData.grad_iluminare}
              </Typography>
              <Typography>
                <strong>Greutate:</strong> {pacientData.greutate}
              </Typography>
              <Typography>
                <strong>Proximitate:</strong> {pacientData.proximitate}
              </Typography>
              <Typography>
                <strong>Puls:</strong> {pacientData.puls}
              </Typography>
              <Typography>
                <strong>Saturatie gaz:</strong> {pacientData.saturatie_gaz}
              </Typography>
              <Typography>
                <strong>Temperatura ambianta:</strong> {pacientData.temp_amb}
              </Typography>
              <Typography>
                <strong>Temperatura corp:</strong> {pacientData.temp_corp}
              </Typography>
              <Typography>
                <strong>Umiditate:</strong> {pacientData.umiditate}
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
