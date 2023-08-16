import { LoadingButton } from "@mui/lab";
import { Typography, Paper, Box } from "@mui/material";
import React, { useState } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { DataResultInfo } from "../CompareResultsPage";

export type RegressionMlResult = {
  Name: string;
  MeanSquareError: string;
  RootMeanSquareError: string;
  R2_Score: string;
};

export type ClassificationMlResult = {
  Name: string;
  AccuracyScore: string;
  PrecisionScore: string;
  RecallScore: string;
  F1Score: string;
  Roc_Auc: string;
  Specificity: string;
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

export interface CompareVisualisationProps {
  results: DataResultInfo[];
  loading: boolean;
}

const CompareVisualisation = (props: CompareVisualisationProps) => {
  const { loading, results } = props;

  console.log("results");
  console.log(results);
  console.log(props);

  // const regression_results: RegressionMlResult[] = () => {
  //   const a = results.map(datasetResult =>
  //     {
  //       const r_results = datasetResult.cvdResults?.regression_results;
  //       if (r_results) {
  //         return r_results
  //       }

  //     });

  //   return a ? a.filter() : [];

  //   }
  const regression_results: RegressionMlResult[][] = results?.map((result) => {
    const r = result.cvdResults?.regression_results;
    if (r !== undefined) {
      return r.filter(result => result !== undefined);
      // r.filter()
    }

    return [];
  });
  console.log("regression_results");
  console.log(typeof regression_results);
  console.log(regression_results);

  const classification_results: ClassificationMlResult[][] = results?.map(
    (result) => {
      const r = result.cvdResults?.classification_results;
      if (r !== undefined && r.length > 0) {
        return r;
      }
      return [];
    }
  );

  console.log("props", props);
  console.log("results", regression_results);
  const regressionBarData = regression_results?.map((result) => {
    return result.map((r) => {
      const { Name, MeanSquareError, RootMeanSquareError, R2_Score } = r;
      console.log(Name, MeanSquareError, RootMeanSquareError, R2_Score);
      return {
        name: Name,
        mse: MeanSquareError,
        rmse: RootMeanSquareError,
        R2: R2_Score,
      };
    });
  });
  const classificationBarData = classification_results?.map((result) => {
    return result.map((r) => {
      const {
        Name,
        AccuracyScore,
        PrecisionScore,
        RecallScore,
        F1Score,
        Roc_Auc,
        Specificity,
      } = r;
      console.log(
        Name,
        AccuracyScore,
        PrecisionScore,
        RecallScore,
        F1Score,
        Roc_Auc,
        Specificity
      );
      return {
        name: Name,
        accuracy: AccuracyScore,
        precision: PrecisionScore,
        recall: RecallScore,
        f1: F1Score,
        roc_auc: Roc_Auc,
        specificity: Specificity,
      };
    });
  });

  return (
    <React.Fragment>
      {!loading && (
        <>
          <Typography variant="h5" gutterBottom align="center">
            Analysis Results
          </Typography>
          {JSON.stringify(results, null, '\t')}
          {!!regression_results &&
            regression_results.map((result) => {
              result.map((r) => {
                const {
                  Name: name,
                  MeanSquareError: mse,
                  RootMeanSquareError: rmse,
                  R2_Score: R2,
                } = r;

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
              });
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
            {regressionBarData?.length > 0 && (
              <>
                <Typography variant="h5" gutterBottom align="center">
                  Regression Results
                </Typography>
                {regressionBarData.map((barData) => (
                  barData.length > 0 ? 
                  <>
                    <BarChart
                      width={1000}
                      height={700}
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
                  </> : <></>
                ))}
              </>
            )}
            {classificationBarData?.length > 0 && (
              <>
                <Typography variant="h5" gutterBottom align="center">
                  Classification Results
                </Typography>
                {classificationBarData.map((barData) => (
                  barData.length > 0 ? 
                  <>
                    <BarChart
                      width={1000}
                      height={700}
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
                      <Bar dataKey="accuracy" fill="#8884d8" />
                      <Bar dataKey="precision" fill="#82ca9d" />
                      <Bar dataKey="recall" fill="#b34a8d" />
                      <Bar dataKey="f1" fill="#c99a8d" />
                      <Bar dataKey="roc_auc" fill="#ff7f50" />
                      <Bar dataKey="specificity" fill="#00ced1" />
                    </BarChart>
                  </> : <></>
                ))}
              </>
            )}
          </Paper>
        </>
      )}
    </React.Fragment>
  );
};

export default CompareVisualisation;
