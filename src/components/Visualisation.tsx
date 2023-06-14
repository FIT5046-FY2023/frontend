import { Typography, Paper, Box } from "@mui/material";
import React from "react";
import {
    ScatterChart,
    Scatter,
    CartesianGrid,
    XAxis,
    YAxis,
  } from "recharts";
  
const Visualisation = (props: { mse: string, rmse: string, R2: string, prediction: any[]}) => {
   const { mse, rmse, prediction,R2 } = props;
   return <React.Fragment>
    <Typography variant="h5" gutterBottom align="center">
      Analysis Results
    </Typography>

    <Paper
      variant="outlined"
      sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 } }}
    >
      <Box sx={{ display: "flex" }}>
        <Typography variant="subtitle1" sx={{ display: "inline" }}>
          <Typography sx={{ fontWeight: "bold", display: "inline" }}>
            {" "}
            MSE:{" "}
          </Typography>{" "}
          {mse}
        </Typography>
      </Box>

      <Box sx={{ display: "flex" }}>
        <Typography variant="subtitle1" sx={{ display: "inline" }}>
          <Typography sx={{ fontWeight: "bold", display: "inline" }}>
            {" "}
            RMSE:{" "}
          </Typography>{" "}
          {rmse}
        </Typography>
      </Box>

      <Box sx={{ display: "flex" }}>
        <Typography variant="subtitle1" sx={{ display: "inline" }}>
          <Typography sx={{ fontWeight: "bold", display: "inline" }}>
            {" "}
            R2 Score:{" "}
          </Typography>{" "}
          {R2}
        </Typography>
      </Box>
    </Paper>

    <Typography variant="h5" gutterBottom align="center">
      Visualisation Results
    </Typography>

   

    <Paper
      variant="outlined"
      sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 } }}
    >
      <ScatterChart
        width={450}
        height={300}
        margin={{
          top: 20,
          right: 20,
          bottom: 10,
          left: 10,
        }}
      >
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="name" type="number" name="" />
        <YAxis dataKey="uv" type="number" name="Predictions" />
        <Scatter
          name="Predictions"
          data={prediction}
          fill="#8884d8"
        />
      </ScatterChart>
    </Paper>
    <Typography>
      {JSON.stringify(prediction)}
    </Typography>
  </React.Fragment>
}

export default Visualisation;