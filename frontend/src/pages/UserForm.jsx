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

const UserForm = ({
  fetchUsers,
  toastOptions,
  ingrijitori,
  supraveghetori,
}) => {
  const [rol, setRol] = useState("Administrator");
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
  const handleUserTypeChange = (event) => {
    setRol(event.target.value);
  };
  const buildRequestBody = () => {
    const baseRequestBody = {
      rol,
      nume,
      prenume,
      password,
      email,
    };

    if (rol === "Pacient") {
      return {
        ...baseRequestBody,
        cnp,
        adresa,
        nr_tel,
        nr_tel_pers_contact,
        profesie,
        loc_munca,
        varsta,
        supraveghetorId,
        ingrijitorId,
      };
    }
    return baseRequestBody;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const requestBody = buildRequestBody();

      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Handle success
        fetchUsers();
        toast.success(`User ${nume} added successfully`, toastOptions);
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
        width: "50vh",
      }}
    >
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>User Type</InputLabel>
          <Select
            value={rol}
            onChange={handleUserTypeChange}
            label="User Type"
            required
          >
            <MenuItem value="Administrator">Administrator</MenuItem>
            <MenuItem value="Doctor">Doctor</MenuItem>
            <MenuItem value="Pacient">Pacient</MenuItem>
            <MenuItem value="Ingrijitor">Ingrijitor</MenuItem>
            <MenuItem value="Supraveghetor">Supraveghetor</MenuItem>
          </Select>
        </FormControl>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
          }}
        >
          {rol === "Doctor" && (
            <>
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
                required
                value={prenume}
                onChange={(e) => setPrenume(e.target.value)}
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
                label="Password"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </>
          )}
          {rol === "Administrator" && (
            <>
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
                required
                value={prenume}
                onChange={(e) => setPrenume(e.target.value)}
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
                label="Password"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
          {rol === "Pacient" && (
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
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Box sx={{ mt: 2, width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="supraveghetor-label">
                    Supraveghetor
                  </InputLabel>
                  <Select
                    labelId="supraveghetor-label"
                    value={supraveghetorId}
                    onChange={(e) => setSupraveghetorId(e.target.value)}
                    sx={{ width: "200%" }}
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
                </FormControl>
              </Box>
              <Box sx={{ mt: 2, width: "100%" }}>
                <FormControl fullWidth>
                  <InputLabel id="ingrijitor-label">Ingrijitor</InputLabel>
                  <Select
                    labelId="ingrijitor-label"
                    value={ingrijitorId}
                    onChange={(e) => setIngrijitorId(e.target.value)}
                    sx={{ width: "200%" }}
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
                </FormControl>
              </Box>
            </>
          )}
          {rol === "Ingrijitor" && (
            <>
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
                required
                value={prenume}
                onChange={(e) => setPrenume(e.target.value)}
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
                label="Password"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
          {rol === "Supraveghetor" && (
            <>
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
                required
                value={prenume}
                onChange={(e) => setPrenume(e.target.value)}
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
                label="Password"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
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

export default UserForm;
