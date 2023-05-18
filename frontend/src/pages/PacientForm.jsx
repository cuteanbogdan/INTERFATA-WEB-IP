import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";

const PacientForm = ({
  fetchPatients,
  toastOptions,
  supraveghetori,
  ingrijitori,
}) => {
  const token = localStorage.getItem("token");

  const [cnp, setCnp] = useState("");
  const [nume, setNume] = useState("");
  const [prenume, setPrenume] = useState("");
  const [adresa, setAdresa] = useState("");
  const [nr_tel, setNr_tel] = useState("");
  const [nr_tel_pers_contact, setNr_tel_pers_contact] = useState("");
  const [email, setEmail] = useState("");
  const [profesie, setProfesie] = useState("");
  const [loc_munca, setLoc_munca] = useState("");
  const [password, setPassword] = useState("");
  const [varsta, setVarsta] = useState("");
  const [supraveghetorId, setSupraveghetorId] = useState("");
  const [ingrijitorId, setIngrijitorId] = useState("");

  const rol = "Pacient";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://server-ip2023.herokuapp.com/api/register",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rol,
            cnp,
            nume,
            prenume,
            adresa,
            nr_tel,
            nr_tel_pers_contact,
            email,
            profesie,
            loc_munca,
            password,
            varsta,
            supraveghetorId,
            ingrijitorId,
          }),
        }
      );

      if (response.ok) {
        // Handle success
        fetchPatients();
        toast.success(`Pacient ${nume} added successfully`, toastOptions);
      } else {
        const data = await response.json();
        // Handle error
        // Check if the response contains an errors array
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((error, index) => {
            toast.error(`${error}`, toastOptions);
          });
        } else {
          // data.message in case of JWT expired
          // Handle error with single message
          toast.error(`${data.message || data.msg}`, toastOptions);
        }
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
          }}
        >
          <>
            <TextField
              label="CNP"
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ width: "200%" }}
              required
              value={cnp}
              onChange={(e) => setCnp(e.target.value)}
            />
            <TextField
              label="Nume"
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ width: "200%" }}
              required
              value={nume}
              onChange={(e) => setNume(e.target.value)}
            />
            <TextField
              label="Prenume"
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ width: "200%" }}
              value={prenume}
              onChange={(e) => setPrenume(e.target.value)}
            />
            <TextField
              label="Varsta"
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ width: "200%" }}
              multiline
              value={varsta}
              onChange={(e) => setVarsta(e.target.value)}
            />
            <TextField
              label="Adresa"
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ width: "200%" }}
              required
              value={adresa}
              onChange={(e) => setAdresa(e.target.value)}
            />
            <TextField
              label="Numar de telefon"
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ width: "200%" }}
              multiline
              value={nr_tel}
              onChange={(e) => setNr_tel(e.target.value)}
            />
            <TextField
              label="Numar telefon persoana de contact"
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ width: "200%" }}
              required
              value={nr_tel_pers_contact}
              onChange={(e) => setNr_tel_pers_contact(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ width: "200%" }}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Profesie"
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ width: "200%" }}
              required
              value={profesie}
              onChange={(e) => setProfesie(e.target.value)}
            />
            <TextField
              label="Loc de munca"
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ width: "200%" }}
              required
              value={loc_munca}
              onChange={(e) => setLoc_munca(e.target.value)}
            />
            <TextField
              label="Parola"
              variant="outlined"
              margin="normal"
              fullWidth
              sx={{ width: "200%" }}
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Select
              value={supraveghetorId}
              onChange={(e) => setSupraveghetorId(e.target.value)}
              fullWidth
              sx={{ width: "200%" }}
              margin="normal"
            >
              {supraveghetori.map((supraveghetor) => (
                <MenuItem
                  key={supraveghetor.id_supraveghetor}
                  value={supraveghetor.id_supraveghetor}
                >
                  {supraveghetor.nume}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={ingrijitorId}
              onChange={(e) => setIngrijitorId(e.target.value)}
              fullWidth
              sx={{ width: "200%" }}
              margin="normal"
            >
              {ingrijitori.map((ingrijitor) => (
                <MenuItem
                  key={ingrijitor.id_ingrijitor}
                  value={ingrijitor.id_ingrijitor}
                >
                  {ingrijitor.nume}
                </MenuItem>
              ))}
            </Select>
          </>
          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 2, width: "200%" }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default PacientForm;
