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

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: "15px",
  backgroundColor: theme.palette.grey[100],
}));

const Ingrijitor = () => {
  const [pacientData, setPacientData] = useState(null);
  const token = localStorage.getItem("token");
  const { authenticated, loading, userRole } = useAuthRoles([
    "Administrator",
    "Ingrijitor",
  ]);

  const [ingrijitorData, setIngrijitorData] = useState("");
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
  const fetchIngrijitor = useCallback(async () => {
    try {
      const responseIngrijitor = await fetch(
        `http://localhost:5000/api/get-ingrijitor`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await responseIngrijitor.json();
      setIngrijitorData(data.data);
      id.current = data.data.id_pacient;
      fetchPatient();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [token, fetchPatient]);
  useEffect(() => {
    if (userRole === "Ingrijitor") {
      fetchIngrijitor();
    }
  }, [userRole, fetchIngrijitor]);

  const [formValoriFiziologice, setFormValoriFiziologice] = useState({
    temp_corp: null,
    greutate: null,
    glicemie: null,
  });

  useEffect(() => {
    if (pacientData) {
      setFormValoriFiziologice({
        temp_corp: pacientData?.temp_corp,
        greutate: pacientData?.greutate,
        glicemie: pacientData?.glicemie,
      });
    }
  }, [pacientData]);
  if (userRole !== "Ingrijitor") {
    return <Typography> Niciun pacient asociat</Typography>;
  }
  const handleChangeValoriFiziologice = (event) => {
    const { name, value } = event.target;
    setFormValoriFiziologice({
      ...formValoriFiziologice,
      [name]: value,
    });
  };

  const handleSubmitValoriFiziologice = async (e) => {
    e.preventDefault();
    console.log(formValoriFiziologice);

    try {
      const id_colectie = pacientData.id_colectie;
      const response = await fetch(
        `http://localhost:5000/api/update-date-colectate/${id_colectie}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValoriFiziologice),
        }
      );

      if (response.ok) {
        // Handle success
        const data = await response.json();
        toast.success(`${data.msg}`, toastOptions);
      } else {
        const data = await response.json();
        // Handle error
        // data.message in case of JWT expired
        // Handle error with single message
        toast.error(`${data.message || data.msg}`, toastOptions);
      }
    } catch (error) {
      // Handle Error
      console.log("Error:", error);
    }
  };

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
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader
              title="Setare date medicale"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmitValoriFiziologice}
              >
                <TextField
                  name="temp_corp"
                  id="temp_corp"
                  label="Temperatura corporala"
                  style={{ margin: 8 }}
                  fullWidth
                  margin="normal"
                  required
                  value={formValoriFiziologice.temp_corp}
                  onChange={handleChangeValoriFiziologice}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  name="greutate"
                  id="greutate"
                  label="Greutate"
                  style={{ margin: 8 }}
                  fullWidth
                  margin="normal"
                  required
                  value={formValoriFiziologice.greutate}
                  onChange={handleChangeValoriFiziologice}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  name="glicemie"
                  id="glicemie"
                  label="Glicemie"
                  style={{ margin: 8 }}
                  fullWidth
                  margin="normal"
                  required
                  value={formValoriFiziologice.glicemie}
                  onChange={handleChangeValoriFiziologice}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginLeft: "1rem" }}
                  >
                    Trimite
                  </Button>
                </Box>
              </form>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Ingrijitor;
