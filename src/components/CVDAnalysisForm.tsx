import React, { useState } from "react";
import Analysis, { AnalysisProps } from "./Analysis";
import Preprocessing, { PreprocessProps } from "./Preprocessing";
import UploadData, { UploadDataProps } from "./UploadData";
import Visualisation, { VisualisationProps } from "./Visualisation";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { convertMLsToApiValues } from "../enums/machineLearningAlgo";
import { CircularProgress } from "@mui/material";

const steps = [
  "Upload Dataset",
  "Preprocessing",
  "Algorithm Selection",
  "Visualisation",
];

function getStepContent({
  step,
  uploadDataProps,
  analysisProps,
  preprocessProps,
  visualisationProps
}: {
  step: number;
  analysisProps: AnalysisProps;
  uploadDataProps: UploadDataProps;
  preprocessProps: PreprocessProps;
  visualisationProps: VisualisationProps;
}) {
  const {
    curFiles,
    setCurFiles,
    handleUpload,
    loading,
    selectedData,
    setSelectedData,
  } = uploadDataProps;
  const {
    checkbox,
    setCheckboxValues,
    checkboxOptions,
    setImputationValue,
    imputation,
    setTarget,
    target,
    heatmapString,
    loading: loadingPreprocess 
  } = preprocessProps;

  const {results: predictions, loading: loadingVisual} = visualisationProps;
  
  const {setMLAlgos, MLAlgorithms, setMLTasks, MLTasks } = analysisProps;
  

  switch (step) {
    case 0:
      return (
        <UploadData
          setCurFiles={setCurFiles}
          curFiles={curFiles}
          handleUpload={handleUpload}
          loading={loading}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
      );
    case 1:
      return (
        <Preprocessing
          checkbox={checkbox}
          setCheckboxValues={setCheckboxValues}
          checkboxOptions={checkboxOptions}
          setImputationValue={setImputationValue}
          imputation={imputation}
          setTarget={setTarget}
          target={target}
          heatmapString={heatmapString}
          loading={loadingPreprocess}
        />
      );

    case 2:
      return <Analysis setMLAlgos={setMLAlgos} MLAlgorithms={MLAlgorithms} setMLTasks={setMLTasks} MLTasks={MLTasks}/>;
    case 3:
      return <>
      {loading && <CircularProgress />}
      {!!predictions && (
        <Visualisation results={predictions} loading={loadingVisual}></Visualisation>
      )}

    </>

    default:
      throw new Error("Unknown step");
  }
}

// Tweaked from https://github.com/mui/material-ui/blob/v5.12.2/docs/data/material/getting-started/templates/checkout/Checkout.tsx
export default function CVDAnalysisForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [predictions, setPredictions] = useState();
  const [MLAlgorithms, setMLAlgos] = useState<any[]>([]);
  const [MLTasks, setMLTasks] = useState<any[]>([]);
  const [curFiles, setCurFiles] = useState<File[]>([]);
  const [getData, setGetData] = useState(false);
  const [checkbox, setCheckboxValues] = React.useState<GridRowSelectionModel>(
    []
  );
  const [checkboxOptions, setCheckboxOptions] = useState<any[]>([]);
  const [imputation, setImputationValue] = useState("");
  const [target, setTarget] = useState("");
  const [heatmapString, setHeatmapString] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = React.useState("");

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleStartOver = () => {
    setActiveStep(0);
  };

  const handleVisual = async () => {
    const mlAlgorithms = convertMLsToApiValues(MLAlgorithms);
    const selectedDatasetName = selectedData;
    console.log(
      JSON.stringify({
        mlAlgorithms: mlAlgorithms,
        mlTasks: MLTasks,
        checkbox: checkbox,
        imputation: imputation,
        selectedData: selectedDatasetName,
        target: target,
      })
    );
    setLoading(true);
    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: JSON.stringify({
        mlAlgorithms: mlAlgorithms,
        mlTasks: MLTasks,
        checkbox: checkbox,
        imputation: imputation,
        selectedData: selectedDatasetName,
        target: target
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        setLoading(false)
        return response.json()})
      .then((data) => {

        console.log("data: \n", data);
        console.log(checkbox);
        console.log(imputation);
        setPredictions(data);
      })
      .catch((err) => {
        setLoading(false)
        console.log(err.message);
      });
  };

  const handlePreprocess = async () => {
    handleNext();
  };

  const handleAnalysis = async () => {
    handleVisual();
    handleNext();
  };

  const handleUpload = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Currently uploads only one file
    if (curFiles.length > 0) {
      const selectedFile = curFiles[0];
      const formData = new FormData();
      formData.append("file", selectedFile);

      console.log("Calling /upload endpoint...");
      console.log("uploading file...");
      setLoading(true);
      const config = {
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      };

      axios
        .post("http://127.0.0.1:5000/upload", formData, config)
        .then((response) => {
          console.log(response);
          setLoading(false);
          setCurFiles([]);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };

  const handleCheckboxOptions = async () => {
    const selectedDatasetName = selectedData;
    setLoading(true);
    fetch("http://127.0.0.1:5000/preprocessing", {
      method: "POST",
      body: JSON.stringify({ selectedData: selectedDatasetName }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => { 
        setLoading(false);
        return response.json();})
      .then((data) => {
        var rows = [];

        for (var i = 0; i < data.headerLabels.length; i++) {
          var featureObject = {
            id: i,
            feature: data.headerLabels[i],
            //correlation: data.corrList[i],
            minimum: data.minList[i],
            maximum: data.maxList[i],
            mean: data.meanList[i],
          };

          rows.push(featureObject);
        }
        setHeatmapString(data.encodedString);
        setCheckboxOptions(rows);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    handleNext();
  };

  return (
    <React.Fragment>
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      ></AppBar>
      <Container component="main" sx={{ mb: 4, br: 32 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 }, borderRadius: 2 }}
        >
          <Typography component="h1" variant="h4" align="center">
            CVD Analysis
          </Typography>
          <Container maxWidth={"sm"}>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Container>

          {( 
            <React.Fragment>
              {getStepContent({
                step: activeStep,
                analysisProps: { setMLAlgos, MLAlgorithms, setMLTasks, MLTasks },
                uploadDataProps: {
                  curFiles,
                  setCurFiles,
                  handleUpload,
                  loading,
                  selectedData,
                  setSelectedData,
                },
                preprocessProps: {
                  checkbox,
                  setCheckboxValues,
                  checkboxOptions,
                  setImputationValue,
                  imputation,
                  setTarget,
                  target,
                  heatmapString,
                  loading
                },
                visualisationProps: {
                  results: predictions,
                  loading
                }
              })}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                {activeStep == steps.length - 1 && (
                  <Button onClick={handleStartOver} sx={{ mt: 3, ml: 1 }}>
                    Start Over
                  </Button>
                )}

                {activeStep < steps.length - 1 && (
                  <Button
                    variant="contained"
                    onClick={
                        activeStep === steps.length - 3
                        ? handlePreprocess
                        : activeStep === steps.length - 2
                        ? handleAnalysis
                        : activeStep === steps.length - 4
                        ? handleCheckboxOptions
                        : handleNext
                    }
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === steps.length - 2 ? "Analyse" : "Next"}
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </React.Fragment>
  );
}
