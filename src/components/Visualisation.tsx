import { Typography, Paper, Box } from "@mui/material";
import React from "react";
import {
    ScatterChart,
    Scatter,
    CartesianGrid,
    XAxis,
    YAxis,
    BarChart,
    Tooltip,
    Legend,
    Bar,
  } from "recharts";

type MlResult = {Name: string, MeanSquareError: string, RootMeanSquareError: string, R2_Score: string, Predictions: any[]}[]
export interface ScatterPoint {
  name: number;
  uv: number;
}

export interface VisualisationProps {
  results: any;
}

const Visualisation = (props: VisualisationProps) => {
   const results: MlResult = props?.results?.results?.map((result: string) => {
    return JSON.parse(result)
   });

   console.log("props", props);
   console.log("results", results);
    const barData = results?.map(result => {
      const { Name, MeanSquareError, RootMeanSquareError, R2_Score } = result;
      console.log(Name, MeanSquareError, RootMeanSquareError, R2_Score);
      return {
        name: Name,
        mse: MeanSquareError,
        rmse: RootMeanSquareError,
        R2: R2_Score,
      };
    }); 

   return <React.Fragment>
    <Typography variant="h5" gutterBottom align="center">
      Analysis Results
    </Typography>


      {!!results && results.map((result) => {
      const { Name: name, MeanSquareError: mse, RootMeanSquareError: rmse, R2_Score: R2 } = result;
      
      return (
        <>
            <Paper
      variant="outlined"
      sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 } }}
    >
        <Box sx={{ display: "flex" }}>
        <Typography variant="subtitle1" sx={{ display: "inline" }}>
          <Typography sx={{ fontWeight: "bold", display: "inline" }}>
            {" "}
            NAME:{" "}
          </Typography>{" "}
          {name}
        </Typography>
      </Box>
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
      </>
      )
    }) }
      


    <Typography variant="h5" gutterBottom align="center">
      Visualisation Results
    </Typography>

    <Paper
      variant="outlined"
      sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 } }}
    >
         {!!results && results.map(result => {
  
      const { Name: name, Predictions: predictions } = result;
      console.log("prediction",predictions)
      const predictionsArray: {}[] = []
      for (let i = 0; i < predictions.length; i++) {
        let singleObj: ScatterPoint = { name: i, uv: Number(predictions[i]) * 10 };
        predictionsArray.push(singleObj);
       }
      return (
        <>
      
      <Typography variant="subtitle1" gutterBottom align="left">
      {`${name} Predictions`}
    </Typography>
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
          name={`${name} Predictions`}
          data={predictionsArray}
          fill="#8884d8"
        />
      </ScatterChart>
      
      </>
        )}
    )}
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