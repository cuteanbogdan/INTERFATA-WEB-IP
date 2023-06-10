import React, { useState, useEffect, useCallback, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import CenteredSpinner from "../utils/CenteredSpinner";
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
  Alert,
} from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  CategoryScale,
  LineElement,
  PointElement,
  LinearScale,
  Title,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title
);

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
  // eslint-disable-next-line
  const [ingrijitorData, setIngrijitorData] = useState("");
  const id = useRef("");
  const [chartData, setChartData] = useState({});
  const history = useNavigate();

  const fetchPatient = useCallback(async () => {
    try {
      const responsePacient = await fetch(
        `https://server-ip2023.herokuapp.com/api/get-pacient-details/${id.current}`,
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
        `https://server-ip2023.herokuapp.com/api/get-date-medicale-patient/${dataPacient.data.id_medical}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseColectate = await fetch(
        `https://server-ip2023.herokuapp.com/api/get-date-colectate-patient/${dataPacient.data.id_colectie}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseAlarme = await fetch(
        `https://server-ip2023.herokuapp.com/api/get-alarm-details/${dataPacient.data.id_alarma}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseRecomandare = await fetch(
        `https://server-ip2023.herokuapp.com/api/get-recomandari-details/${dataPacient.data.id_recomandare}`,
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
        `https://server-ip2023.herokuapp.com/api/get-ingrijitor`,
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

  useEffect(() => {
    const fetchDateIstorice = async () => {
      try {
        const response = await fetch(
          `https://server-ip2023.herokuapp.com/api/get-date-istorice`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Now that you have the data, you can set the chart.
          if (data.data && Array.isArray(data.data)) {
            setChartData({
              labels: data.data.map((item) => item.id_date),
              datasets: [
                {
                  label: "Tensiune arteriala",
                  data: data.data.map((item) => item.tensiune),
                  backgroundColor: "rgba(75,192,192,0.6)",
                  borderWidth: 4,
                },
                {
                  label: "Temperatura corporala",
                  data: data.data.map((item) => item.temperatura_corp),
                  backgroundColor: "rgba(192,192,75,0.6)",
                  borderWidth: 4,
                },
                {
                  label: "Greutate",
                  data: data.data.map((item) => item.greutate),
                  backgroundColor: "rgba(192,75,192,0.6)",
                  borderWidth: 4,
                },
                {
                  label: "Glicemie",
                  data: data.data.map((item) => item.glicemie),
                  backgroundColor: "rgba(75,75,192,0.6)",
                  borderWidth: 4,
                },
              ],
            });
          } else {
            // Handle the case when data.data is not an array or doesn't exist
            console.error("Unexpected data format:", data);
          }
        } else {
          const data = await response.json();
          console.log("Error:", data.message || data.msg);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchDateIstorice();
  }, [token]);

  const [formValoriFiziologice, setFormValoriFiziologice] = useState({
    TA: null,
    temp_corp: null,
    greutate: null,
    glicemie: null,
  });

  useEffect(() => {
    if (pacientData) {
      setFormValoriFiziologice({
        TA: pacientData?.TA,
        temp_corp: pacientData?.temp_corp,
        greutate: pacientData?.greutate,
        glicemie: pacientData?.glicemie,
      });
    }
  }, [pacientData]);
  if (userRole !== "Ingrijitor") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <Alert severity="info">Niciun pacient asociat</Alert>
      </Box>
    );
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

    try {
      const id_colectie = pacientData.id_colectie;
      const response = await fetch(
        `https://server-ip2023.herokuapp.com/api/update-date-colectate/${id_colectie}`,
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
        window.location.reload(false);
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
    return <CenteredSpinner />;
  }
  if (!authenticated) {
    history("/login");
    return null;
  }
  if (!pacientData) {
    return <CenteredSpinner />;
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
                  Deconectare
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
              title="Detalii personale"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Typography>
                <strong>CNP:</strong> {pacientData.cnp}
              </Typography>
              <Typography>
                <strong>Varsta:</strong> {pacientData.varsta}
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
              title="Detalii profesie"
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
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6}>
          <StyledCard>
            <CardHeader
              title="Detalii medicale"
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
              title="Detalii colectate"
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
                  name="TA"
                  id="TA"
                  label="Tensiune arteriala"
                  style={{ margin: 8 }}
                  fullWidth
                  margin="normal"
                  required
                  value={formValoriFiziologice.TA}
                  onChange={handleChangeValoriFiziologice}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
      <Typography
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60px",
        }}
      >
        <strong>Grafic date medicale</strong>
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Pie data={data} />
      </div>
      <Typography
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60px",
        }}
      >
        <strong>Grafic istoric date medicale</strong>
      </Typography>
      {chartData &&
      chartData.datasets &&
      chartData.datasets[0].data.length > 0 ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            title: { text: "Valori Fiziologice", display: true },
          }}
        />
      ) : (
        <Typography
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60px",
          }}
        >
          Nu exista istoric date
        </Typography>
      )}
    </Container>
  );
};

export default Ingrijitor;
