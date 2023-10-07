import { LoadingButton } from "@mui/lab";
import {
  Typography,
  Paper,
  Box,
  TextField,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import FeatureBarChart from "./FeatureBarChart";
import React, { useState } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  spatialStatesList
} from "../enums/spatialAnalysisStates";

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
  Feature_Importance_Mean: Array<number>;
  Feature_Name_Ranking: Array<string>;
};

export interface ScatterPoint {
  name: number;
  uv: number;
}

export interface VisualisationProps {
  results: any;
  loading: boolean;
  handleSaveResults?: (
    title: string,
    description: string,
    state: string,
    results: any,
    setResultsSaved: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  saveEnabled: boolean;
}

Chart.register(CategoryScale);

const Visualisation = (props: VisualisationProps) => {
  const {
    loading,
    results,
    handleSaveResults: saveResults,
    saveEnabled,
  } = props;
  const [resultsSaved, setResultsSaved] = useState<boolean>(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState<string>("");

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

  console.log(results);
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
            "#2a71d0",
          ],
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    };

    return ranking;
  });

  const regressionBarData = regression_results?.map((result) => {
    const { Name, MeanSquareError, RootMeanSquareError, R2_Score } = result;
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

  const handleSaveResults = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (saveResults !== undefined) {
      saveResults(state, title, description, results, setResultsSaved);
      setResultsSaved(true);
    }
  };

  const saveResultsText = resultsSaved ? "Results saved" : "Save Results";

  return (
    <React.Fragment>
      
      {!loading && (
        <>
          <Typography variant="h5" gutterBottom align="center">
            Analysis Results
          </Typography>

          {saveEnabled && (
            <Box sx={{ display:"flex", justifyContent: 'center', width: "100%" }}>
            <Stack direction={"row"} spacing={2}>
            <TextField
                size="small"
                fullWidth
                name="analysisTitle"
                label="Analysis Title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
                
              <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-label">
                    {"Select State"}
                  </InputLabel>
                  <Select
                    id="demo-simple-select"
                    labelId="demo-simple-select-label"
                    value={state}
                    name={"state"}
                    label="Select State"
                    onChange={(e) => setState(e.target.value)}
                    size="small"
                    fullWidth
                    displayEmpty={false}
                  >
                    {spatialStatesList.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              
              <TextField
                size="small"
                fullWidth
                multiline
                name="analysisDesc"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Box sx={{ minWidth: "200px" }}>
                <LoadingButton
                  variant="contained"
                  onClick={(e) => handleSaveResults(e)}
                  loading={loading}
                  loadingPosition="start"
                  disabled={resultsSaved}
                  fullWidth
                  
                >
                  {saveResultsText}
                </LoadingButton>
                </Box>
            </Stack>
          </Box>
          )}

          {!!classification_results &&
            classification_results.map((result) => {
              const {
                Name: name,
                AccuracyScore: accuracy,
                PrecisionScore: precision,
                RecallScore: recall,
                F1Score: f1,
                Roc_Auc: roc_auc,
                Specificity: specificity,
                Feature_Importance_Mean: Feature_Importance_Mean,
                Feature_Name_Ranking: Feature_Name_Ranking,
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
                          Accuracy Score:{" "}
                        </Typography>{" "}
                        {accuracy}
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
                          Precision Score:{" "}
                        </Typography>{" "}
                        {precision}
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
                          Recall Score:{" "}
                        </Typography>{" "}
                        {recall}
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
                          F1 Score:{" "}
                        </Typography>{" "}
                        {f1}
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
                          Roc Auc:{" "}
                        </Typography>{" "}
                        {roc_auc}
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
                          Specificity:{" "}
                        </Typography>{" "}
                        {specificity}
                      </Typography>
                    </Box>

                    <FeatureBarChart
                      data={{
                        labels: Feature_Name_Ranking,
                        datasets: [
                          {
                            data: Feature_Importance_Mean,
                            backgroundColor: [
                              "rgba(75,192,192,1)",
                              "#50AF95",
                              "#f3ba2f",
                              "#2a71d0",
                            ],
                            borderColor: "black",
                            borderWidth: 2,
                          },
                        ],
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
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
                        {Feature_Importance_Mean.map(
                          (importance: number, index: number) => (
                            <Typography
                              key={index}
                              variant="subtitle1"
                              sx={{ display: "block" }}
                            >
                              {index + 1}. {Feature_Name_Ranking[index]} :{" "}
                              {importance}
                            </Typography>
                          )
                        )}
                      </Typography>
                    </Box>
                  </Paper>
                </>
              );
            })}
          {!!regression_results &&
            regression_results.map((result) => {
              const {
                Name: name,
                MeanSquareError: mse,
                RootMeanSquareError: rmse,
                R2_Score: R2,
                Feature_Importance_Mean: Feature_Importance_Mean,
                Feature_Name_Ranking: Feature_Name_Ranking,
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

                    <FeatureBarChart
                      data={{
                        labels: Feature_Name_Ranking,
                        datasets: [
                          {
                            data: Feature_Importance_Mean,
                            backgroundColor: [
                              "rgba(75,192,192,1)",
                              "#50AF95",
                              "#f3ba2f",
                              "#2a71d0",
                            ],
                            borderColor: "black",
                            borderWidth: 2,
                          },
                        ],
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
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
                        {Feature_Importance_Mean.map(
                          (importance: number, index: number) => (
                            <Typography
                              key={index}
                              variant="subtitle1"
                              sx={{ display: "block" }}
                            >
                              {index + 1}. {Feature_Name_Ranking[index]} :{" "}
                              {importance}
                            </Typography>
                          )
                        )}
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
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
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
                </ResponsiveContainer>
              </>
            )}
            {classificationBarData?.length > 0 && (
              <>
                <Typography variant="h5" gutterBottom align="center">
                  Classification Results
                </Typography>

                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
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
                </ResponsiveContainer>
              </>
            )}
          </Paper>
        </>
      )}
    </React.Fragment>
  );
};

export default Visualisation;
