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
} from "@mui/material";
import useAuthRoles from "../utils/useAuthRoles";
import { useNavigate } from "react-router-dom";

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
    <Container maxWidth="sm">
      {!pacientData ? (
        <Typography>Loading...</Typography>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h4" component="div" gutterBottom>
              {pacientData.nume} {pacientData.prenume}
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(pacientData).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography>
                    <strong>{key.replace(/_/g, " ")}:</strong> {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Patient;
