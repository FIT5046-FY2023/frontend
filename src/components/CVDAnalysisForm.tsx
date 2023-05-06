// import React from "react";
import React, { useEffect, useState } from "react";
import Analysis from "./Analysis";
import Preprocessing from "./Preprocessing";
import UploadData from "./UploadData";
import Visualisation from "./Visualisation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";


const steps = ["Upload Dataset", "Preprocessing", "Analysis", "Visualisation"];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <UploadData />;
    case 1:
      return <Preprocessing />;
    case 2:
      return <Analysis />;
    case 3:
      return <Visualisation />;
    default:
      throw new Error("Unknown step");
  }
}



// Tweaked from https://github.com/mui/material-ui/blob/v5.12.2/docs/data/material/getting-started/templates/checkout/Checkout.tsx
export default function CVDAnalysisForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [predictions, setPredictions] = useState("");
  const [mse, setMSE] = useState("");
  const [R2, setR2] = useState("");
  const [rmse, setRMSE] = useState("");

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    // fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
    fetch("http://127.0.0.1:5000/predict")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let predictiondata = JSON.parse(data)
        setPredictions(predictiondata.Predictions);
        //setMSE(predictiondata.MeanSquareError); 
        setRMSE(predictiondata.RootMeanSquareError);
        setR2(predictiondata.R2_Score); 

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
      >
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
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
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Analysis Results
              </Typography>
              
              <Typography variant="subtitle1">
              <Typography sx={{fontWeight: 'bold'}}> MSE: </Typography> {R2}{mse}

                
              </Typography>
              <Typography variant="subtitle1">
              
              <Typography sx={{fontWeight: 'bold'}}> RMSE:</Typography> {rmse}
        
                
              </Typography>

              <Typography variant="subtitle1">

              <Typography sx={{fontWeight: 'bold'}}> R2 Score:</Typography> {R2}
               
              </Typography>

              <div> </div>

              <Typography variant="h5" gutterBottom>
                Visualisation Results
              </Typography>
              

              <Typography variant="subtitle1">
                Predictions: {predictions}
                
              </Typography>



            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Analyse" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </React.Fragment>
  );
}
