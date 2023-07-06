import { Typography, Paper, Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState} from "react";
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
import { geocode } from "@esri/arcgis-rest-geocoding";
import MapVisualization from "./MapVisualization";

type RegressionMlResult = {
  Name: string;
  MeanSquareError: string;
  RootMeanSquareError: string;
  R2_Score: string;
}[];

type ClassificationMlResult = {
  Name: string;
  AccuracyScore: string;
  PrecisionScore: string;
  RecallScore: string;
  F1Score: string;
}[];
export interface ScatterPoint {
  name: number;
  uv: number;
}

export interface VisualisationProps {
  results: any;
  loading: boolean;
}

const Visualisation = (props: VisualisationProps) => {
  const { loading } = props;
  const regression_results: RegressionMlResult = props?.results?.regression_results?.map((result: string) => {
    return JSON.parse(result);
  });
  const classification_results: ClassificationMlResult = props?.results?.classification_results?.map((result: string) => {
    return JSON.parse(result);
  });

  

  console.log("props", props);
  console.log("results", regression_results);

  const [data, setData] = useState<{lat: number; lng: number; name: string;}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const areaNames = ['Adamstown - Kotara ',
        'Albion Park - Macquarie Pass ',
        'Albion Park Rail/ Shellharbour - Oak Flats ',
        'Albury - East',
        'Albury - North/ Lavington',
        'Albury - South/ Albury Region',
        'Anna Bay/ Nelson Bay Peninsula ',
        'Armidale '
        ];
        const geocodeResults = await Promise.all(
          areaNames.map(async (areaName) => {
            const response = await geocode(areaName);

            const result = response.candidates[0];
            const { y: lat, x: lng } = result.location;
            const name = result.address;

            return { lat, lng, name};
          })
        );

        setData(geocodeResults as { lat: number; lng: number; name: string; }[]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [regression_results]);

  const regressionBarData = regression_results?.map((result) => {
    const { Name, MeanSquareError, RootMeanSquareError, R2_Score } = result;
    console.log(Name, MeanSquareError, RootMeanSquareError, R2_Score);
    return {
      name: Name,
      mse: MeanSquareError,
      rmse: RootMeanSquareError,
      R2: R2_Score,
    };
  });
  const classificationBarData = classification_results?.map((result) => {
    const { Name, AccuracyScore,PrecisionScore,RecallScore,F1Score} = result;
    console.log(Name, AccuracyScore,PrecisionScore,RecallScore,F1Score);
    return {
      name: Name,
      accuracy: AccuracyScore,
      precision: PrecisionScore,
      recall: RecallScore,
      f1: F1Score
    };
  });

  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom align="center">
        Analysis Results
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {!!regression_results &&
            regression_results.map((result) => {
              const {
                Name: name,
                MeanSquareError: mse,
                RootMeanSquareError: rmse,
                R2_Score: R2,
              } = result;

              return (
                <>
                  <Paper
                    variant="outlined"
                    sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 } }}
                  >
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ display: "inline" }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", display: "inline" }}
                        >
                          {" "}
                          NAME:{" "}
                        </Typography>{" "}
                        {name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ display: "inline" }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", display: "inline" }}
                        >
                          {" "}
                          MSE:{" "}
                        </Typography>{" "}
                        {mse}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ display: "inline" }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", display: "inline" }}
                        >
                          {" "}
                          RMSE:{" "}
                        </Typography>{" "}
                        {rmse}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ display: "inline" }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", display: "inline" }}
                        >
                          {" "}
                          R2 Score:{" "}
                        </Typography>{" "}
                        {R2}
                      </Typography>
                    </Box>
                  </Paper>
                </>
              );
            })}

          <Typography variant="h5" gutterBottom align="center">
            Visualisation Results
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              my: { xs: 4, md: 6 },
              p: { xs: 2, md: 3 },
            }}
            
          >
           { regressionBarData.length > 0 && <><Typography variant="h5" gutterBottom align="center">
            Regression Results
          </Typography>
            <BarChart
              width={1100}
              height={300}
              data={regressionBarData}
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
            </BarChart></>}
           {classificationBarData.length > 0 && <><Typography variant="h5" gutterBottom align="center">
            Classification Results
          </Typography>
            <BarChart
              width={500}
              height={300}
              data={classificationBarData}
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
              <Bar dataKey="accuracy" fill="#8884d8" />
              <Bar dataKey="precision" fill="#82ca9d" />
              <Bar dataKey="recall" fill="#b34a8d" />
              <Bar dataKey="f1" fill="#c99a8d" />
            </BarChart></>}
          </Paper>

          <MapVisualization data={data} apiKey="Enter API KEY" />
        </>
      )}
    </React.Fragment>
  );
};

export default Visualisation;
