import * as React from "react";
import { Box, CircularProgress } from "@mui/material";

function CenteredSpinner() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default CenteredSpinner;
