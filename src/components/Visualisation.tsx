import { Typography, Paper, Box } from "@mui/material";
import React from "react";
import {
    ScatterChart,
    Scatter,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
    BarChart,
    Tooltip,
    Legend,
    Bar,
  } from "recharts";
  
const Visualisation = (props: { mse: string, rmse: string, R2: string, prediction: any[]}) => {
   const { mse, rmse, prediction, R2 } = props;
   const barData = [
    {
      name: 'ML 1',
      mse: mse,
      rmse: rmse,
      R2: R2,
    }];

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

      <Box>
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
    <Paper
    variant="outlined"
    sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 } }}>
  
        <BarChart
          width={500}
          height={300}
          data={barData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="rmse" fill="#8884d8" />
          <Bar dataKey="mse" fill="#82ca9d" />
          <Bar dataKey="R2" fill="#b34a8d" />
        </BarChart>
        
        </Paper>
  </React.Fragment>
}

export default Visualisation;