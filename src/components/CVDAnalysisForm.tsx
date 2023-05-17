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
  analysisProps: { setMLAlgos: React.Dispatch<any[]>; MLAlgorithms: any[] };
  uploadDataProps: { curFiles: File[]; setCurFiles: React.Dispatch<any[]> };
}) {
  const { curFiles, setCurFiles } = uploadDataProps;
  const { setMLAlgos, MLAlgorithms } = analysisProps;

  switch (step) {
    case 0:
      return <UploadData setCurFiles={setCurFiles} curFiles={curFiles} />;
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
    // let encodedCsv;
    let csv;
    const csvFile = curFiles[0];
    console.log(csvFile);
    if (csvFile) {
      // const reader = new FileReader();

      // csv = reader.readAsText(csvFile.stream().pipeTo());
      // csv = await csvFile.text();
      setGetData(true);
    }
    // const requestBody = {
    //   csv: csv,
    //   mlAlgorithm: MLAlgorithms[0],
    // };

    // console.log(requestBody);
    // return requestBody;
  };
  const addPosts = async (csv: string) => {
    await fetch("http://127.0.0.1:5000/users", {
      method: "POST",
      body: JSON.stringify({ csv: csv }),
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
  };
  useEffect(() => {
    const csvFile = curFiles[0];
    async function getCSVText() {
      const csv = await csvFile.text();
      return csv;
    }
    if (curFiles.length > 0) {
      getCSVText().then((data:string) => {
        addPosts(data);
      });
      const requestBody = {
        csv: getCSVText(),
        mlAlgorithm: MLAlgorithms[0],
      };

      console.log(requestBody);
    
    // let formData = new FormData();
    // formData.append('csv', csvFile);
    // formData.append('mlAlgorithms', MLAlgorithms[0]);
    // fetch("http://127.0.0.1:5000/users", {
    //   method: "POST",
    //   body: formData,
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8",
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
    }

  }, [getData]);
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
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            CVD Analysis
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

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
                uploadDataProps: { curFiles, setCurFiles },
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
