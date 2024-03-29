import React, { useState } from "react";
import Analysis, { AnalysisProps, initialFormValues } from "./Analysis";
import Preprocessing, { PreprocessProps } from "./Preprocessing";
import DataWrangling, { DataWranglingProps} from "./DataWrangling";
import UploadData, { UploadDataProps } from "./UploadData";
import Visualisation, { VisualisationProps } from "./Visualisation";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { MLData } from "./AnalysisFormComponents/mlDatatypes";

const steps = [
  "Upload Dataset",
  "Data Wrangling",
  "Feature Selection",
  "Algorithm Selection",
  "Visualisation",
];

function getStepContent({
  step,
  uploadDataProps,
  dataWranglingProps, 
  analysisProps,
  preprocessProps,
  visualisationProps
}: {
  step: number;
  analysisProps: AnalysisProps;
  uploadDataProps: UploadDataProps;
  dataWranglingProps: DataWranglingProps; 
  preprocessProps: PreprocessProps;
  visualisationProps: Omit<VisualisationProps, 'saveEnabled'>;
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
    setTarget,
    target,
    loading: loadingPreprocess,
    setLoading,
    checkboxOptions

  } = preprocessProps;

  const {results: predictions, loading: loadingVisual, handleSaveResults} = visualisationProps;
  const {setMLData, mlData, setStateList, stateList } = analysisProps;
  const {setImputationValue, imputation, setOutlierValue, outlier, dataWranglingOptions, setDataWranglingCheckbox, dataWranglingCheckbox, setDataWranglingOptions} = dataWranglingProps; 
  

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
      return <><DataWrangling 
      setImputationValue={setImputationValue}
      imputation={imputation}
      setOutlierValue={setOutlierValue}
      outlier= {outlier}
      dataWranglingOptions={dataWranglingOptions}
      setDataWranglingOptions = {setDataWranglingOptions}
      setDataWranglingCheckbox={setDataWranglingCheckbox}
      dataWranglingCheckbox={dataWranglingCheckbox}
      loading={loading}
      ></DataWrangling>
      </>
    case 2:
      return (
        <Preprocessing
          checkbox={checkbox}
          setCheckboxValues={setCheckboxValues}
          checkboxOptions={checkboxOptions}
          setTarget={setTarget}
          target={target}
          loading={loadingPreprocess}
          selectedData={selectedData}
          setLoading={setLoading}

        />
      );

    case 3:
      return <Analysis setMLData={setMLData} mlData={mlData} setStateList={setStateList} stateList ={stateList} />;
    case 4:
      return <>
      {loading && <CircularProgress />}
      {!!predictions && !loading && (
        <Visualisation results={predictions} loading={loadingVisual} handleSaveResults={handleSaveResults} saveEnabled={true}></Visualisation>
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
  const [mlData, setMlData] = useState<MLData[]>(initialFormValues);
  const [stateList, setStateList] = useState<any[]>([]);
  const [curFiles, setCurFiles] = useState<File[]>([]);
  // const [getData, setGetData] = useState(false);
  const [checkbox, setCheckboxValues] = React.useState<any[]>([]);
  const [checkboxOptions, setCheckboxOptions] = useState<any[]>([]);
  const [dataWranglingCheckbox, setDataWranglingCheckbox] = useState<any[]>([]);
  const [dataWranglingOptions, setDataWranglingOptions] = useState<any[]>([]);
  const [imputation, setImputationValue] = useState("");
  const [outlier, setOutlierValue] = useState("");
  const [target, setTarget] = useState("");
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
    const selectedDatasetName = selectedData;
    console.log(
      JSON.stringify({
        mlData: mlData,
        checkbox: checkbox,
        imputation: imputation,
        selectedData: selectedDatasetName,
        target: target,
        stateList: stateList 
      
      })
    );
    setPredictions(undefined)
    setLoading(true);
    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: JSON.stringify({
        mlData: mlData,
        checkbox: checkbox,
        imputation: imputation,
        selectedData: selectedDatasetName,
        target: target,
        stateList:stateList
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit

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
    let selectedDatasetName = selectedData;
    console.log(selectedDatasetName)
    setLoading(true);
    fetch("http://127.0.0.1:5000/dropdown", {
      method: "POST",
      body: JSON.stringify({ selectedData: selectedDatasetName}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => { 
        setLoading(false);
        return response.json();})
      .then((data) => {
        setCheckboxOptions(data.headerLabels)
        console.log(data)
        console.log(data.minList)
        console.log(data.maxList)
        console.log(data.meanList)

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
        
        setDataWranglingOptions(rows)

        
        
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    handleNext();
  };

  const handleSaveResults = async (results:any, setResultsSaved:React.Dispatch<React.SetStateAction<boolean>>) => {
    console.log("save results POST");
    console.log(JSON.stringify({ results: results, datasetName: selectedData}));
    setLoading(true);
    fetch("http://127.0.0.1:5000/save_results", {
      method: "POST",
      body: JSON.stringify({ results: results, datasetName: selectedData}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((response) => { 
      setLoading(false);
      setResultsSaved(true);
      return response.json();})
    .catch((err) => {
      setLoading(false);
      console.log(err.message);
    });
  }

  return (
    <Box>
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
                analysisProps: {setMLData: setMlData, mlData: mlData, setStateList, stateList },
                uploadDataProps: {
                  curFiles,
                  setCurFiles,
                  handleUpload,
                  loading,
                  selectedData,
                  setSelectedData,
                },
                dataWranglingProps: {setImputationValue, imputation, setOutlierValue, outlier, dataWranglingOptions, setDataWranglingCheckbox, dataWranglingCheckbox, setDataWranglingOptions, loading}, 
                preprocessProps: {
                  checkbox,
                  setCheckboxValues,
                  checkboxOptions,
                  setTarget,
                  target,
                  loading,
                  selectedData,
                  setLoading
                },
                visualisationProps: {
                  results: predictions,
                  loading,
                  handleSaveResults: handleSaveResults
                }
              })}
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

                {activeStep < steps.length - 1 && (
                  <Button
                  variant="contained"
                  onClick={
                    activeStep === steps.length - 3
                    ? handlePreprocess
                    : activeStep === steps.length - 2
                    ? handleAnalysis
                    : activeStep === steps.length - 5
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
          </Box>
  );
}
