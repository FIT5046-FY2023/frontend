// import React from "react";
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
import { ScatterChart, Scatter, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

interface MyObject {
  name: number;
  uv: number; 
}

const steps = ["Upload Dataset", "Preprocessing", "Analysis", "Visualisation"];

function getStepContent({step, setMLAlgos, MLAlgorithms}:{step: number, setMLAlgos: React.Dispatch<any[]>, MLAlgorithms: any[]}) {
  switch (step) {
    case 0:
      return <UploadData />;
    case 1:
      return <Preprocessing />;
    case 2:
      return <Analysis setMLAlgos={setMLAlgos} MLAlgorithms={MLAlgorithms} />;
    case 3:
      return <Visualisation />;
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
  const predictionsArray: {}[] = [];
  const data1 = [{name: '0', uv: 8.248466622900004},{name: '1', uv: 7.5823660776}, {name: '2', uv: 8.692531544699996}, {name: '3', uv: 8.502016348800002},
    {name: '4', uv: 8.1789648864}];
  const [prediction, setPred] = useState<any[]>([]); 

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
        
        let preddata = predictiondata.Predictions;
  

        setPredictions(preddata);
        setMSE(predictiondata.MeanSquareError); 
        setRMSE(predictiondata.RootMeanSquareError);
        setR2(predictiondata.R2_Score); 

       const data1 = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];

       for (let i = 0; i < preddata.length; i++) {
        let singleObj: MyObject = {name:i,uv:Number(preddata[i])*10};
        predictionsArray.push(singleObj);
        
      };

      setPred(predictionsArray)

        
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
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }} >
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
        
          {activeStep === steps.length ? (
            <React.Fragment >

<Typography variant="h5" gutterBottom align="center">
                Analysis Results
              </Typography>


<Paper
          variant="outlined"
          sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 } }}
        >

              <Box sx={{ display: 'flex' }}>
              
              <Typography variant="subtitle1" sx={{display:"inline"}}>
              <Typography sx={{fontWeight: 'bold', display: "inline"}} > MSE: </Typography> {mse}
              </Typography>
              </Box> 

              <Box sx={{ display: 'flex' }}>

              <Typography variant="subtitle1" sx={{ display: "inline" }}>
              <Typography sx={{fontWeight: 'bold', display: "inline" }}> RMSE: </Typography>  {rmse}
              </Typography>
              </Box>

              <Box>

              <Typography variant="subtitle1" sx={{display: "inline" }}>
              <Typography sx={{fontWeight: 'bold', display: "inline" }} > R2 Score: </Typography> {R2}
              </Typography>

              </Box>

              </Paper>

        
              <Typography variant="h5" gutterBottom align="center">
                Visualisation Results

              </Typography>
            
              <Paper
          variant="outlined"
          sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 } }}
        >
      
              <ScatterChart
                width={450}
                height={300}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 10,
                  left: 10,
                }}
              >
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="name" type="number" name=""  />
                <YAxis dataKey="uv" type="number" name="Predictions"  />
                <Scatter name="Predictions" data={prediction} fill="#8884d8" />
         
              </ScatterChart>

              </Paper>



            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent({step:activeStep, setMLAlgos, MLAlgorithms})}
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
