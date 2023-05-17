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

interface MyObject {
  name: number;
  uv: number;
}

const steps = ["Upload Dataset", "Preprocessing", "Analysis", "Visualisation"];

function getStepContent({
  step,
  uploadDataProps,
  analysisProps,
}: {
  step: number;
  analysisProps: { setMLAlgos: React.Dispatch<any[]>; MLAlgorithms: any[]; };
  uploadDataProps: { curFiles: File[]; setCurFiles: React.Dispatch<any[]>; handleUpload: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void};
}) {
  const { curFiles, setCurFiles, handleUpload } = uploadDataProps;
  const { setMLAlgos, MLAlgorithms } = analysisProps;

  switch (step) {
    case 0:
      return <UploadData setCurFiles={setCurFiles} curFiles={curFiles} handleUpload={handleUpload}/>;
    case 1:
      return <Preprocessing />;
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
  const [mse, setMSE] = useState("");
  const [R2, setR2] = useState("");
  const [rmse, setRMSE] = useState("");
  const [MLAlgorithms, setMLAlgos] = useState<any[]>([]);
  const [curFiles, setCurFiles] = useState<File[]>([]);
  const predictionsArray: {}[] = [];
  const [getData, setGetData] = useState(false);
  const data1 = [
    { name: "0", uv: 8.248466622900004 },
    { name: "1", uv: 7.5823660776 },
    { name: "2", uv: 8.692531544699996 },
    { name: "3", uv: 8.502016348800002 },
    { name: "4", uv: 8.1789648864 },
  ];
  const [prediction, setPred] = useState<any[]>([]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleVisualise = (e: any) => {
    handleNext();
    console.log("entered handleVisualise");

    const csvFile = curFiles[0];
    console.log(csvFile);
    if (csvFile) {
      // const reader = new FileReader();

      // csv = reader.readAsText(csvFile.stream().pipeTo());
      // csv = await csvFile.text();
      setGetData(true);
    }
    // const requestBody = {
    //   mlAlgorithm: MLAlgorithms[0],
    // };
  };

  const handleUpload = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Currently uploads only one file 
    if (curFiles.length > 0) {
      const selectedFile = curFiles[0];
      const formData = new FormData();
      formData.append("file", selectedFile);

      axios
        .post("http://127.0.0.1:5000/upload", formData)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5000/predict")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let predictiondata = JSON.parse(data);

        let preddata = predictiondata.Predictions;

        setPredictions(preddata);
        setMSE(predictiondata.MeanSquareError);
        setRMSE(predictiondata.RootMeanSquareError);
        setR2(predictiondata.R2_Score);

        const data1 = [{ name: "Page A", uv: 400, pv: 2400, amt: 2400 }];

        for (let i = 0; i < preddata.length; i++) {
          let singleObj: MyObject = { name: i, uv: Number(preddata[i]) * 10 };
          predictionsArray.push(singleObj);
        }

        setPred(predictionsArray);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

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
          <Container maxWidth={'sm'}>
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
              <Visualisation
                mse={mse}
                rmse={rmse}
                R2={R2}
                prediction={prediction}
              ></Visualisation>
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
                uploadDataProps: { curFiles, setCurFiles, handleUpload },
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
                      activeStep === steps.length - 2
                        ? handleVisualise
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
