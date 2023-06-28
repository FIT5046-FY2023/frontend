import React, { useEffect, useState } from "react";
import Analysis from "./Analysis";
import Preprocessing from "./Preprocessing";
import UploadData from "./UploadData";
import Visualisation from "./Visualisation";
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
import { CropLandscapeOutlined } from "@mui/icons-material";
import {GridRowSelectionModel} from '@mui/x-data-grid';


const steps = ["Upload Dataset", "Preprocessing", "Algorithm Selection", "Visualisation"];

function getStepContent({
  step,
  uploadDataProps,
  analysisProps,
  preprocessProps,
}: {
  step: number;
  analysisProps: { setMLAlgos: React.Dispatch<any[]>; MLAlgorithms: any[] };
  uploadDataProps: {
    curFiles: File[];
    setCurFiles: React.Dispatch<any[]>;
    handleUpload: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    loading: boolean;
  };
  preprocessProps: {checkbox: React.SetStateAction<GridRowSelectionModel>, setCheckboxValues:React.Dispatch<React.SetStateAction<GridRowSelectionModel>>, checkboxOptions:any[], setImputationValue:React.Dispatch<React.SetStateAction<string>>, imputation: React.SetStateAction<string>, setTarget: React.Dispatch<string>; target: string, heatmapString:string }; 

}) {
  
  const { curFiles, setCurFiles, handleUpload, loading } = uploadDataProps;
  const {setMLAlgos, MLAlgorithms } = analysisProps;
  const {checkbox, setCheckboxValues, checkboxOptions, setImputationValue, imputation, setTarget, target, heatmapString} = preprocessProps;  

  switch (step) {
    case 0:
      return (
        <UploadData
          setCurFiles={setCurFiles}
          curFiles={curFiles}
          handleUpload={handleUpload}
          loading={loading}
        />
      );
    case 1:
      return <Preprocessing checkbox={checkbox} setCheckboxValues={setCheckboxValues} checkboxOptions={checkboxOptions} setImputationValue={setImputationValue} imputation={imputation} setTarget={setTarget} target={target} heatmapString={heatmapString} />; 

    case 2:
      return <Analysis setMLAlgos={setMLAlgos} MLAlgorithms={MLAlgorithms} />;
    case 3:
      return <></>;

    default:
      throw new Error("Unknown step");
  }
}

// Tweaked from https://github.com/mui/material-ui/blob/v5.12.2/docs/data/material/getting-started/templates/checkout/Checkout.tsx
export default function CVDAnalysisForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [predictions, setPredictions] = useState();
  const [MLAlgorithms, setMLAlgos] = useState<any[]>([]);
  const [curFiles, setCurFiles] = useState<File[]>([]);
  const [getData, setGetData] = useState(false);
  const [checkbox, setCheckboxValues] = React.useState<GridRowSelectionModel>([]);
  const [checkboxOptions, setCheckboxOptions] = useState<any[]>([]); 
  const [imputation, setImputationValue] = useState(""); 
  const [target, setTarget] = useState(""); 
  const [heatmapString, setHeatmapString] = useState(""); 
  const [ loading, setLoading ] = useState(false);
  
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleVisual = async () => {
    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: JSON.stringify({mlAlgorithms: MLAlgorithms, checkbox: checkbox, imputation: imputation, target: target}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data: \n", data);
        console.log(checkbox);
        console.log(imputation);
        setPredictions(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleVisualise = (e: any) => {
    handleNext();
    console.log("entered handleVisualise");

    const csvFile = curFiles[0];
    console.log(csvFile);
    if (csvFile) {
      setGetData(true);
    }
  };

  const handlePreprocess = async () => {
    handleNext();
  };

  const handleAnalysis = async () => {
    await fetch("http://127.0.0.1:5000/MLAlgorithm", {
      method: "POST",
      body: JSON.stringify(MLAlgorithms),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    handleVisual();

    handleNext();
  };

  useEffect(() => {
    const csvFile = curFiles[0];
    async function getCSVText() {
      const csv = await csvFile.text();
      return csv;
    }
  });

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

          'Content-Type': 'application/x-www-form-urlencoded',
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
    fetch("http://127.0.0.1:5000/preprocessing")
    .then((response) => response.json())
    .then((data) => {

    var rows = [] 

    for (var i = 0; i < data.corrList.length; i++) {
      
      var featureObject = {
        id: i, 
        feature: data.headerLabels[i],
        correlation: data.corrList[i],
        minimum: data.minList[i],
        maximum: data.maxList[i],
        mean: data.meanList[i]
      }; 

 
      rows.push(featureObject);
    }
      setHeatmapString(data.encodedString); 
      setCheckboxOptions(rows) 

    })
    .catch((err) => {
      console.log(err.message);
    }); 

    handleNext(); 

  }


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

          {activeStep === steps.length - 1 ? (
            <>
              {!!predictions && (
                <Visualisation results={predictions}></Visualisation>
              )}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
              </Box>
            </>
          ) : (
            <React.Fragment>
              {getStepContent({
                step: activeStep,
                analysisProps: { setMLAlgos, MLAlgorithms },
                uploadDataProps: {curFiles, setCurFiles,  handleUpload, loading },
                preprocessProps: {checkbox, setCheckboxValues, checkboxOptions, setImputationValue, imputation, setTarget, target, heatmapString}
              })}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                {activeStep < steps.length - 1 && (
                  <Button
                    variant="contained"
                    onClick={
                      activeStep === steps.length - 1
                        ? handleVisualise
                        : activeStep === steps.length - 3
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
