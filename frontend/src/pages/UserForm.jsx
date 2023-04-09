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

const UserForm = () => {
  const [userType, setUserType] = useState("doctor");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("");

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
    setFirstName("");
    setLastName("");
    setAge("");
    setPhone("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", {
      userType,
      firstName,
      lastName,
      age,
      phone,
    });
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
            value={userType}
            onChange={handleUserTypeChange}
            label="User Type"
            required
          >
            <MenuItem value="doctor">Doctor</MenuItem>
            <MenuItem value="nurse">Nurse</MenuItem>
            <MenuItem value="patient">Patient</MenuItem>
          </Select>
        </FormControl>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
          }}
        >
          {userType === "doctor" && (
            <>
              <TextField
                label="First Name"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
          {userType === "nurse" && (
            <>
              <TextField
                label="First Name"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                label="PhoneNumber"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}
          {userType === "patient" && (
            <>
              <TextField
                label="First Name"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                margin="normal"
                fullWidth
                sx={{ width: "200%" }}
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
