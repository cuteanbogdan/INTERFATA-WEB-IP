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
} from "@mui/material";

const Patient = () => {
  const [patient, setPatient] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patient/${id}`);
        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatient();
  }, [id]);

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Patient Information
        </Typography>
        <Paper>
          <Table>
            <TableBody>
              {Object.entries(patient).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Container>
  );
};

export default Patient;
