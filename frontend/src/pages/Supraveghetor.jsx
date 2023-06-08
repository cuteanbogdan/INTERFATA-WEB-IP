import React, { useState, useEffect, useCallback, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Container,
  Typography,
  Grid,
  Avatar,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import useAuthRoles from "../utils/useAuthRoles";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import CardHeader from "@mui/material/CardHeader";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  marginRight: theme.spacing(2),
}));

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

ChartJS.register(ArcElement, Tooltip, Legend);

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: "15px",
  backgroundColor: theme.palette.grey[100],
}));

const Supraveghetor = () => {
  const [pacientData, setPacientData] = useState(null);
  const token = localStorage.getItem("token");
  const { authenticated, loading, userRole } = useAuthRoles([
    "Administrator",
    "Supraveghetor",
  ]);
  // eslint-disable-next-line
  const [supraveghetorData, setSupraveghetorData] = useState("");
  const id = useRef("");
  const history = useNavigate();

  const fetchPatient = useCallback(async () => {
    try {
      const responsePacient = await fetch(
        `http://localhost:5000/api/get-pacient-details/${id.current}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataPacient = await responsePacient.json();
      console.log(dataPacient);
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
      const responseAlarme = await fetch(
        `http://localhost:5000/api/get-alarm-details/${dataPacient.data.id_alarma}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseRecomandare = await fetch(
        `http://localhost:5000/api/get-recomandari-details/${dataPacient.data.id_recomandare}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const dataRecomandare = await responseRecomandare.json();
      const dataAlarme = await responseAlarme.json();
      const dataMedicale = await responseMedicale.json();
      const dataColectate = await responseColectate.json();
      setPacientData({
        ...dataPacient.data,
        ...dataMedicale.data,
        ...dataColectate.data,
        ...dataAlarme.data,
        ...dataRecomandare.data,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [id, token]);

  const fetchSupraveghetor = useCallback(async () => {
    try {
      const responseSupraveghetor = await fetch(
        `http://localhost:5000/api/get-supraveghetor`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await responseSupraveghetor.json();
      setSupraveghetorData(data.data);
      id.current = data.data.id_pacient;
      fetchPatient();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [token, fetchPatient]);
  useEffect(() => {
    if (userRole === "Supraveghetor") {
      fetchSupraveghetor();
    }
  }, [userRole, fetchSupraveghetor]);

  if (userRole !== "Supraveghetor") {
    return <Typography> Niciun pacient asociat</Typography>;
  }

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
  const data = {
    labels: [
      "Tensiune arteriala",
      "Temperatura corporala",
      "Greutate",
      "Glicemie",
    ],
    datasets: [
      {
        label: "Valoare: ",
        data: [
          pacientData.TA,
          pacientData.temp_corp,
          pacientData.greutate,
          pacientData.glicemie,
        ],
        backgroundColor: [
          "rgba(146, 95, 241, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(146, 95, 241, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container maxWidth="md">
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
        {console.log(pacientData)}
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader
              title="Alarma"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Typography>
                <strong>ID alarma:</strong> {pacientData.id_alarma}
              </Typography>
              <Typography>
                <strong>Data si ora:</strong> {pacientData.data_ora}
              </Typography>
              <Typography>
                <strong>Tipul parametrului: </strong>{" "}
                {pacientData.tip_parametru}
              </Typography>
              <Typography>
                <strong>Valoarea masurata:</strong>{" "}
                {pacientData.valoare_masurata}
              </Typography>
              <Typography>
                <strong>Mesaj: </strong> {pacientData.mesaj}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader
              title="Recomandari"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Typography>
                <strong>ID recomandare:</strong> {pacientData.id_recomandare}
              </Typography>
              <Typography>
                <strong>Recomandare: </strong> {pacientData.recomandare}
              </Typography>
              <Typography>
                <strong>Timp: </strong> {pacientData.timp}
              </Typography>
              <Typography>
                <strong>Detalii: </strong> {pacientData.detalii}
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
      <div style={{ maxWidth: "400px", maxHeight: "400px" }}>
        <Pie data={data} />
      </div>
    </Container>
  );
};

export default Supraveghetor;
