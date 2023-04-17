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

const UserForm = ({ fetchUsers, toastOptions }) => {
  const [role, setRole] = useState("Administrator");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("");
  const token = localStorage.getItem("token");
  const [email, setEmail] = useState("");

  const handleUserTypeChange = (event) => {
    setRole(event.target.value);
    setName("");
    setPassword("");
    setAge("");
    setEmail("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          name,
          password,
          age,
          email,
        }),
      });

      if (response.ok) {
        // Handle success
        fetchUsers();
        toast.success(`User ${name} added successfully`, toastOptions);
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
        <FormControl fullWidth margin="normal">
          <InputLabel>User Type</InputLabel>
          <Select
            value={role}
            onChange={handleUserTypeChange}
            label="User Type"
            required
          >
            <MenuItem value="Administrator">Administrator</MenuItem>
            <MenuItem value="Medic">Medic</MenuItem>
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
          {role === "Medic" && (
            <>
              <TextField
                label="Name"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <TextField
                label="Age"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </>
          )}
          {role === "Administrator" && (
            <>
              <TextField
                label="Name"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <TextField
                label="Age"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </>
          )}
          {role === "Pacient" && (
            <>
              <TextField
                label="Name"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <TextField
                label="Age"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                label="Medical Condition"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                multiline
                rows={4}
                value={medicalCondition}
                onChange={(e) => setMedicalCondition(e.target.value)}
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
