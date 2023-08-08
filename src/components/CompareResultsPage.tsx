import {
  AppBar, Box, Button, Container, Paper, Step, StepLabel, Stepper, Typography
} from "@mui/material";
import { useState } from "react";
import React from "react";
import SelectResultsForComparison from "./CompareResultsComponent/SelectResultsForComparison";
import CompareResultsSection from "./CompareResultsComponent/CompareResultsSection";

const steps = [
  "Select Results",
  "Compare Results",
];
const CompareResults = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [showCompareResults, setShowCompareResults] = useState<Boolean>(false);

    const handleComparison = (e:any) => {
        setShowCompareResults(!showCompareResults);
        setActiveStep(activeStep+1);
    };
    const handleBack = () => {
      setActiveStep(activeStep - 1);
    };
  
    const handleStartOver = () => {
      setActiveStep(0);
      setShowCompareResults(false);
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
            {/* <Paper
        variant="outlined"
        sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 }, borderRadius: 2 }}
      > */}
        <Container maxWidth={"sm"}>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Container>
      {/* </Paper> */}
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                {activeStep === 0 && (
                        <Button variant="contained" onClick={handleComparison}>
                        {" "}
                        Compare Results{" "}
                      </Button>
                )}</Box>
      
      
      {!!activeStep ? <CompareResultsSection /> : <SelectResultsForComparison handleComparison={handleComparison} />}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>

                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                {activeStep === steps.length - 1 && (
                  <Button onClick={handleStartOver} sx={{ mt: 3, ml: 1 }}>
                    Start Over
                  </Button>
                )}
              </Box>
              </Container>
</React.Fragment>)
};



export default CompareResults;
