import {
  AppBar,
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";
import SelectResultsForComparison from "./CompareResultsComponent/SelectResultsForComparison";
import CompareResultsSection from "./CompareResultsComponent/CompareResultsSection";
import { ClassificationMlResult, RegressionMlResult } from "./CompareResultsComponent/CompareVisualisation";

type ClassificationResult = {
  Name: string;
  AccuracyScore: number;
  PrecisionScore: number;
  RecallScore: number;
  F1Score: number;
  Roc_Auc: number;
  Specificity: number;
  Predictions: any[];
}

type RegressionResult = RegressionMlResult;

type CvdResults = {
  classification_results?: ClassificationMlResult[];
  regression_results?: RegressionResult[];
  results?: any[]; // TO BE Defined
  spatial_results?: any[];
}
export type DataResultInfo = {
  datasetName: string;
  dateCreated: string;
  cvdResults: CvdResults;
  objectId: string;
  title: string;
  description: string;
  state: string;
 }

const steps = ["Select Results", "Compare Results"];

const CompareResults = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [showCompareResults, setShowCompareResults] = useState<Boolean>(false);
  const [allResults, setAllResults] = useState<DataResultInfo[]>([]);
  const [selectedResults, setSelectedResults] = useState<number[]>([]);

  const handleComparison = (e: any) => {

    setShowCompareResults(!showCompareResults);
    setActiveStep(activeStep + 1);
  };
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleStartOver = () => {
    setSelectedResults([]);
    setActiveStep(0);
    setShowCompareResults(false);
  };

  useEffect(() => {
    handleFetchAllResults();
  }, []);

  const mapResultsToTableData = (data: DataResultInfo[]) => {
    const mappedTableData = allResults.map(result => ({description: result.description, title: result.title, datasetName: result.datasetName, dateCreated: result.dateCreated, objectId: result.objectId, state: result.state}));
    console.log(mappedTableData);
    return mappedTableData
  }

  const mapResultsForVisualisation = (data: DataResultInfo[]) => {
    const filteredResults = selectedResults.map(index => allResults[index]);
    console.log('filtered results:', filteredResults);
    return filteredResults.map(result => result);
  };

  const parseRawData = (rawData: any[]): DataResultInfo[] => {
    console.log('rawData',rawData);
    console.log('rawData',typeof rawData);
    const mappedResults = rawData.map((result: any) => {
      //  Parse json for results
      Object.entries(result.results).forEach(([key, value ])=> {
        console.log(`${key}: ${value}`);
        result.results[key] = (value as any[]).map((cvdResult:any) => JSON.parse(cvdResult));
      })
      const cvdResults = result.results;
      // const cvdResults = result.results.results.map((cvdResult:any) => JSON.parse(cvdResult));
      const data = {
        datasetName: result.dataset_name,
        dateCreated: result.date_created,
        cvdResults: cvdResults,
        objectId: result._id,
        title: result.title,
        description: result.description,
        state: result.state
      };
      console.log("cvd results: \n", cvdResults);


      //  console.log(typeof result.results.results[0]);

      console.log(data);
      return data;
    })
    console.log("mapped results", mappedResults);
    return mappedResults;

  }

  const handleFetchAllResults = async () => {
    console.log("cvd results get");
    // setLoading(true);
    fetch("http://127.0.0.1:5000/cvd_results", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        // setLoading(false);
        // setResultsSaved(true);
        console.log("line 52");
        return response.json();
      })
      .then((data) => {
        console.log("line 57");
        console.log(data);
        console.log(data.results);
        const parsedData = JSON.parse(data.results);
        setAllResults(parseRawData(parsedData));
      })
      .catch((err) => {
        // setLoading(false);
        console.log(err.message);
      });
  };

  return (
    <>
        <Container maxWidth={"sm"}>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Container>
        
       
        {!!activeStep ? (
          <CompareResultsSection results={mapResultsForVisualisation(allResults)} loading={false} />
        ) : ( 
          <SelectResultsForComparison
              handleComparison={handleComparison}
              tableData={mapResultsToTableData(allResults)} 
              setSelectedResults={setSelectedResults} 
              selectedResults={selectedResults}
          />
        )}
        
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
    </>
  );
};

export default CompareResults;
