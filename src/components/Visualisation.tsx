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

type RegressionMlResult = {
  Name: string;
  MeanSquareError: string;
  RootMeanSquareError: string;
  R2_Score: string;
};

type ClassificationMlResult = {
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

export interface VisualisationProps {
  results: any;
  loading: boolean;
  handleSaveResults?: (
    results: any,
    setResultsSaved: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  saveEnabled: boolean;
}

const Visualisation = (props: VisualisationProps) => {
  const {
    loading,
    results,
    handleSaveResults: saveResults,
    saveEnabled,
  } = props;
  const [resultsSaved, setResultsSaved] = useState<boolean>(false);

  console.log("results");
  console.log(results);
  console.log(props);

  const regression_results: RegressionMlResult[] =
    props?.results?.regression_results?.map((result: string) => {
      return JSON.parse(result);
    });
  const classification_results: ClassificationMlResult[] =
    props?.results?.classification_results?.map((result: string) => {
      return JSON.parse(result);
    });
  const spatial_results: SpatialResult[] = props?.results?.spatial_results?.map(
    (result: string) => {
      return result;
    }
  );

  console.log("props", props);
  console.log("results", regression_results);
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
    const {
      Name,
      AccuracyScore,
      PrecisionScore,
      RecallScore,
      F1Score,
      Roc_Auc,
      Specificity,
    } = result;
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

  console.log(spatial_results);

  const spatialBarData = spatial_results?.map((result: SpatialResult) => {
    console.log(result);
    const {
      Name,
      State,
      AccuracyScore,
      PrecisionScore,
      RecallScore,
      F1Score,
      Roc_Auc,
      Specificity,
    } = result;
    console.log(
      Name,
      State,
      AccuracyScore,
      PrecisionScore,
      RecallScore,
      F1Score,
      Roc_Auc,
      Specificity
    );
    return {
      name: `${Name} (${State})`,
      state: State,
      accuracy: AccuracyScore,
      precision: PrecisionScore,
      recall: RecallScore,
      f1: F1Score,
      roc_auc: Roc_Auc,
      specificity: Specificity,
    };
  });

  const handleSaveResults = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // TODO: Post to backend
    e.preventDefault();
    if (saveResults !== undefined) {
      saveResults(results, setResultsSaved);
      setResultsSaved(true);
    }
  };

  const saveResultsText = resultsSaved ? "Results saved" : "Save Results";

  return (
    <React.Fragment>
      {!loading && (
        <>
          {saveEnabled && (
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <LoadingButton
                variant="contained"
                onClick={(e) => handleSaveResults(e)}
                loading={loading}
                loadingPosition="start"
                disabled={resultsSaved}
              >
                {saveResultsText}
              </LoadingButton>
            </Box>
          )}
          <Typography variant="h5" gutterBottom align="center">
            Analysis Results
          </Typography>
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
            {regressionBarData?.length > 0 && (
              <>
                <Typography variant="h5" gutterBottom align="center">
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
                </BarChart>
              </>
            )}
            {classificationBarData?.length > 0 && (
              <>
                <Typography variant="h5" gutterBottom align="center">
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
                </BarChart>
              </>
            )}
            {spatialBarData?.length > 0 && (
              <>
                <Typography variant="h5" gutterBottom align="center">
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
                </BarChart>
              </>
            )}
          </Paper>
        </>
      )}
    </React.Fragment>
  );
};

export default Visualisation;
