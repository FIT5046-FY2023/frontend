import { Typography, Paper, Box, CircularProgress } from "@mui/material";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import FeatureBarChart from "./FeatureBarChart"; 
import React, { useState } from "react";
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

type RegressionMlResult = {
  Name: string;
  MeanSquareError: string;
  RootMeanSquareError: string;
  R2_Score: string;
  Ranking: string; 
  Feature_Importance_Mean: Array<number>;
  Feature_Name_Ranking: Array<string>; 
};

type ClassificationMlResult = {
  Name: string;
  AccuracyScore: string;
  PrecisionScore: string;
  RecallScore: string;
  F1Score: string;
  Roc_Auc: string;
  Specificity: string;
  Feature_Importance_Mean: string;
  Feature_Name_Ranking: string; 
};

type SpatialResult = {
  Name: string;
  State: string;
  AccuracyScore: string;
  PrecisionScore: string;
  RecallScore: string;
  F1Score: string;
  Roc_Auc: string;
  Specificity: string;
};

export interface ScatterPoint {
  name: number;
  uv: number;
}

export interface VisualisationProps {
  results: any;
  loading: boolean;
}

Chart.register(CategoryScale);

const Visualisation = (props: VisualisationProps) => {
  const { loading, results } = props;

 

  const regression_results: RegressionMlResult[] = props?.results?.regression_results?.map((result: string) => {
    return JSON.parse(result);
  });
  const classification_results: ClassificationMlResult[] = props?.results?.classification_results?.map((result: string) => {
    return JSON.parse(result);
  });
  const spatial_results: SpatialResult[] = props?.results?.spatial_results?.map((result: string) => {
    return result;
  });

  console.log(results)
  console.log("props", props);
  console.log("results", regression_results);
 
  const chartDataArray = regression_results?.map((result) => {
    const { Feature_Importance_Mean, Feature_Name_Ranking } = result;
    const ranking = {
      
      labels: Feature_Name_Ranking, 
      datasets: [
        {
          label: "Feature Name Ranking ",
          data: Feature_Importance_Mean,
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0"
          ],
          borderColor: "black",
          borderWidth: 2
        } ]
      }

    return ranking
});

  const regressionBarData = regression_results?.map((result) => {
    const { Name, MeanSquareError, RootMeanSquareError, R2_Score, Feature_Importance_Mean,
    Feature_Name_Ranking } = result;
    console.log("hello", Feature_Importance_Mean,Feature_Name_Ranking);
    return {
      name: Name,
      mse: MeanSquareError,
      rmse: RootMeanSquareError,
      R2: R2_Score,
    };
  });
  const classificationBarData = classification_results?.map((result) => {
    const { Name, AccuracyScore,PrecisionScore,RecallScore,F1Score, Roc_Auc, Specificity, Feature_Importance_Mean,
      Feature_Name_Ranking} = result;
    console.log(Name, AccuracyScore,PrecisionScore,RecallScore,F1Score, Roc_Auc, Specificity,Feature_Importance_Mean,Feature_Name_Ranking);
    return {
      name: Name,
      accuracy: AccuracyScore,
      precision: PrecisionScore,
      recall: RecallScore,
      f1: F1Score,
      roc_auc: Roc_Auc,
      specificity: Specificity
    };
  });
  
  console.log(spatial_results);
  
  const spatialBarData = spatial_results?.map((result: SpatialResult) => {
    console.log(result);
    const { Name, State, AccuracyScore,PrecisionScore,RecallScore,F1Score, Roc_Auc, Specificity} = result;
    console.log(Name, State, AccuracyScore,PrecisionScore,RecallScore,F1Score, Roc_Auc, Specificity);
    return {
      name: `${Name} (${State})`,
      state: State,
      accuracy: AccuracyScore,
      precision: PrecisionScore,
      recall: RecallScore,
      f1: F1Score,
      roc_auc: Roc_Auc,
      specificity: Specificity
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
                Feature_Importance_Mean: Feature_Importance_Mean, 
                Feature_Name_Ranking: Feature_Name_Ranking
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

                     <FeatureBarChart data={ {
labels: Feature_Name_Ranking, 
      datasets: [
        {
          data: Feature_Importance_Mean,
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0"
          ],
          borderColor: "black",
          borderWidth: 2
        } ]
      }} />  
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ display: "inline" }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", display: "inline" }}
                        >
              {" "}
                          FEATURE IMPORTANCE:{" "}
                        </Typography>{" "}
                        {Feature_Importance_Mean.map((importance: number, index: number) => (
                        <Typography key={index} variant="subtitle1" sx={{ display: "block" }}>
                          {index + 1}.  {Feature_Name_Ranking[index]} : {importance} 
                        </Typography>
                      ))}
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
           { regressionBarData?.length > 0 && <><Typography variant="h5" gutterBottom align="center">
            Regression Results
          </Typography>
            <BarChart
              width={1000}
              height={700}
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
           {classificationBarData?.length > 0 && <><Typography variant="h5" gutterBottom align="center">
            Classification Results
          </Typography>
            <BarChart
              width={1000}
              height={700}
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
              <Bar dataKey="roc_auc" fill="#ff7f50" />
              <Bar dataKey="specificity" fill="#00ced1" />
            </BarChart></>}
            {spatialBarData?.length > 0 && <><Typography variant="h5" gutterBottom align="center">
            Spatial Analysis Results
          </Typography>
            <BarChart
              width={1000}
              height={700}
              data={spatialBarData}
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
              <Bar dataKey="roc_auc" fill="#ff7f50" />
              <Bar dataKey="specificity" fill="#00ced1" />
            </BarChart></>}
          </Paper>
        </>
      )}
    </React.Fragment>
  );
};

export default Visualisation;
