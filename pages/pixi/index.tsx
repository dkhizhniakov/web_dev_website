import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import {useEffect} from "react";
import PixiPage from "./pixiPage";

const pixiPage = new PixiPage();

export default function Test() {
  useEffect(() => {
    // TODO: make with refs
    const container = document.getElementById('fa-main');
    pixiPage.init(container);

  }, []);

  return (
    <Grid id="fa-main" sx={{
      height: "100vh"
    }}>
      <Box

        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography  variant="h4" component="h1" gutterBottom>
          We create beautiful animated digital design for different tasks.
        </Typography>

      </Box>
    </Grid>
  );
}
