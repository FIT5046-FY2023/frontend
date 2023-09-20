import { Typography, Paper, Box } from "@mui/material";
import { omit, uniq } from "lodash";
import React from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Tooltip,
  Legend,
  Bar,
  Text,
  ResponsiveContainer,
} from "recharts";
import { DataResultInfo } from "../CompareResultsPage";

export type RegressionMlResult = {
  Name: string;
  MeanSquareError: string;
  RootMeanSquareError: string;
  R2_Score: string;
};
export type RegressionBarData = {
  name: string;
  mse: string;
  rmse: string;
  R2: string;
};

export type ClassificationBarData = {
  name: string;
  accuracy: string;
  precision: string;
  recall: string;
  f1: string;
  roc_auc: string;
  specificity: string;
};

export type ClassificationMlResult = {
  Name: string;
  AccuracyScore: string;
  PrecisionScore: string;
  RecallScore: string;
  F1Score: string;
  Roc_Auc: string;
  Specificity: string;
};

export interface ScatterPoint {
  name: number;
  uv: number;
}

export interface CompareVisualisationProps {
  results: DataResultInfo[];
  loading: boolean;
}

function combineMultipleDatasetResults<
  S,
  T extends { datasetName: string; results: S[] | undefined }
>(datasetResults: T[]) {
  console.log(datasetResults);
  const combined = datasetResults.reduce<
    (S & {
      datasetName: string;
    })[]
  >((accumulator, currentDatasetResult) => {
    const { datasetName } = currentDatasetResult;
    const results = currentDatasetResult["results"]?.map((r) => ({
      ...r,
      datasetName,
    }));
    return results ? accumulator.concat(results) : accumulator;
  }, []);
  console.log(combined);
  return combined;
}

const filterRegressionResults = (results: DataResultInfo[]) => {
  const rawResults = results.filter((result: DataResultInfo) => {
    const regressionResults = result.cvdResults.regression_results;
    return regressionResults !== undefined && regressionResults.length > 0;
  });
  const filteredResults = rawResults.map((result: DataResultInfo) => {
    const { datasetName, dateCreated } = result;
    const rawRegressionResults = result.cvdResults.regression_results;
    const regressionResults = rawRegressionResults?.map((r) => {
      const { Name, MeanSquareError, RootMeanSquareError, R2_Score } = r;
      console.log(Name, MeanSquareError, RootMeanSquareError, R2_Score);
      return {
        name: Name,
        mse: MeanSquareError,
        rmse: RootMeanSquareError,
        R2: R2_Score,
      } as RegressionBarData;
    });
    return {
      datasetName,
      dateCreated,
      results: regressionResults,
    };
  });
  return filteredResults;
};
const filterClassificationResults = (results: DataResultInfo[]) => {
  const rawResults = results.filter((result: DataResultInfo) => {
    const classificationResults = result.cvdResults.classification_results;
    return (
      classificationResults !== undefined && classificationResults.length > 0
    );
  });
  const filteredResults = rawResults.map((result: DataResultInfo) => {
    const { datasetName, dateCreated } = result;
    const rawClassificationResults = result.cvdResults.classification_results;
    const classificationResults = rawClassificationResults?.map((r) => {
      const {
        Name,
        AccuracyScore,
        PrecisionScore,
        RecallScore,
        F1Score,
        Roc_Auc,
        Specificity,
      } = r;
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
      } as ClassificationBarData;
    });
    return {
      datasetName,
      dateCreated,
      results: classificationResults,
    };
  });
  return filteredResults;
};

const CompareVisualisation = (props: CompareVisualisationProps) => {
  const { loading, results } = props;

  console.log("results");
  console.log(results);
  console.log(props);

  const newRegressionResults = filterRegressionResults(results);

  const newClassificationResults = filterClassificationResults(results);
  const combinedClassResults = combineMultipleDatasetResults<
    ClassificationBarData,
    any
  >(newClassificationResults);
  const combinedClassBarData = combinedClassResults.map((r) => {
    const obj = { ...r, name: `${r.datasetName} \n${r.name}` };
    return omit(obj, ["datasetName"]) as ClassificationBarData;
  });
  const combinedRegressionResults = combineMultipleDatasetResults<
    RegressionBarData,
    any
  >(newRegressionResults);
  console.log("combined regression results", combinedRegressionResults);

  const combinedRegressionBarData = combinedRegressionResults.map((r) => {
    const obj = { ...r, name: `${r.datasetName} \n${r.name}` };
    return omit(obj, ["datasetName"]) as RegressionBarData;
  });
  // Filter by ML regression
  const regressionAlgos = uniq(combinedRegressionResults.map((r) => r.name));
  let algosToBarData: Record<string, any[]> = {};
  console.log("unique regression Algos", regressionAlgos);
  regressionAlgos.forEach((algo) => {
    const filteredBarData = combinedRegressionResults.filter(
      (r) => r.name === algo
    );
    algosToBarData[algo] = filteredBarData;
    console.log(algosToBarData);
  });
  // Filter by ML classification
  const classificationAlgos = uniq(combinedClassResults.map((r) => r.name));
  let classAlgoBarData: Record<string, any[]> = {};
  console.log("unique regression Algos", classificationAlgos);
  classificationAlgos.forEach((algo) => {
    const filteredBarData = combinedClassResults.filter((r) => r.name === algo);
    classAlgoBarData[algo] = filteredBarData;
    console.log(classAlgoBarData);
  });
  const ClassMLFilteredBarCharts = () =>
    Object.entries(classAlgoBarData).map(([key, barData]) => {
      console.log(key, barData);

      return (
        <>
          <Typography variant="h6" gutterBottom align="center">
            {key}
          </Typography>
          <Typography variant="body1" gutterBottom align="center">
            {"Datasets: " +
              barData.reduce(
                (accumulator, barData) =>
                  accumulator + barData.datasetName + ", ",
                ""
              )}
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="datasetName" tick={<CustomXAxisTick />} />
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
      );
    });

  const MLFilteredBarCharts = () =>
    Object.entries(algosToBarData).map(([key, barData]) => {
      console.log(key, barData);

      return (
        <>
          <Typography variant="h6" gutterBottom align="center">
            {key}
          </Typography>
          <Typography variant="body1" gutterBottom align="center">
            {"Datasets: " +
              barData.reduce(
                (accumulator, barData) =>
                  accumulator + barData.datasetName + ", ",
                ""
              )}
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="datasetName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rmse" fill="#8884d8" />
              <Bar dataKey="mse" fill="#82ca9d" />
              <Bar dataKey="R2" fill="#b34a8d" />
            </BarChart>
          </ResponsiveContainer>
        </>
      );
    });

  return (
    <React.Fragment>
      {!loading && (
        <>
          <Box
            sx={{
              my: { xs: 4, md: 6 },
              p: { xs: 2, md: 3 },
              height: "10000",
            }}
          >
            <Typography variant="h4" gutterBottom align="center">
              Spatial Results
            </Typography>
            <Typography variant="h5" gutterBottom align="center">
              Comparing All Dataset Results
            </Typography>
            <Typography variant="body1" gutterBottom align="center">
              {"Datasets: " +
                results.reduce(
                  (accumulator, barData) =>
                    accumulator + barData.datasetName + ", ",
                  ""
                )}
            </Typography>
            {combinedRegressionBarData?.length > 1 && (
              <RegressionBarChart barData={combinedRegressionBarData} />
            )}
            {combinedClassBarData?.length > 1 && (
              <ClassificationBarChart barData={combinedClassBarData} />
            )}

            <Typography
              variant="body1"
              gutterBottom
              align="center"
              sx={{ marginBottom: "2rem" }}
            ></Typography>
            <Typography variant="h5" gutterBottom align="center">
              Comparing By Machine Learning Algorithms
            </Typography>

            {MLFilteredBarCharts()}
            {ClassMLFilteredBarCharts()}
          </Box>
          <Box
            sx={{


            }}
          >
            {newRegressionResults?.length > 0 && (
              <>
                <Typography variant="h5" gutterBottom align="center">
                  Regression Results By Dataset
                </Typography>
                {newRegressionResults.map((r) => (
                  <>
                    <Typography variant="h6" gutterBottom align="center">
                      {r.datasetName}
                    </Typography>
                    <Typography variant="body1" gutterBottom align="center">
                      {r.dateCreated}
                    </Typography>
                    {r.results?.map((barData) =>
                      RegressionResultDetails(barData)
                    )}
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={r.results}
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
                ))}
              </>
            )}

          
            <Box sx={{ display:"flex", flexDirection: "column", flexWrap:"wrap", alignContent:"center"}}>
            {newClassificationResults?.length > 0 && (
              <>
                <Typography variant="h4" gutterBottom align="center">
                  Classification Results by Dataset
                </Typography>
                {newClassificationResults.map((r) => (
                  <>
                  <Box sx={{ my: { xs: 1, md: 1 } , p: { xs: 2, md: 2 }, mb: {md:4}, display:"flex", flexDirection: "column", flexWrap:"wrap", alignContent:"center", alignItems:"flex-start"}}>
                    <Typography variant="h6" gutterBottom align="left">
                      {r.datasetName}
                    </Typography>
                    <Typography variant="body1" gutterBottom align="left" sx={{display: "inline"}}>
                    <Typography variant="body1" gutterBottom align="left" sx={{fontWeight:"bold", display: "inline"}}>
                      {`Date Created: `}
                    </Typography>
                      {`${r.dateCreated}`}
                    </Typography>
                    {r.results?.map((barData) => (
                      <ClassificationResultDetails {...barData} />
                    ))}
                    </Box>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={r.results}
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
                ))}
              </>
            )}
            </Box>

          </Box>
        </>
      )}
    </React.Fragment>
  );
};

const RegressionResultDetails = ({
  name,
  rmse,
  mse,
  R2,
}: RegressionBarData) => {
  const data = [
    { label: "ML Algorithm", value: name },
    { label: "RMSE", value: rmse },
    { label: "MSE", value: mse },
    { label: "R2", value: R2 },
  ];
  return (
    <>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 4, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        {data.map(({ label, value }) => (
          <Box sx={{ display: "flex" }}>
            <Typography variant="subtitle1" sx={{ display: "inline" }}>
              <Typography sx={{ fontWeight: "bold", display: "inline" }}>
                {label}{" "}
              </Typography>
              {value}
            </Typography>
          </Box>
        ))}
      </Paper>
    </>
  );
};
const ClassificationResultDetails = ({
  name,
  accuracy,
  precision,
  recall,
  f1,
  roc_auc,
  specificity,
}: ClassificationBarData) => {
  const data = [
    { label: "ML Algorithm", value: name },
    { label: "Accuracy", value: accuracy },
    { label: "Precision", value: precision },
    { label: "Recall", value: recall },
    { label: "F1 score", value: f1 },
    { label: "ROC AUC", value: roc_auc },
    { label: "Specificity", value: specificity },
  ];
  return (
    <>
      
        {data.map(({ label, value }) => (
          <Box sx={{ display: "flex" }}>
            <Typography variant="subtitle1" sx={{ display: "inline" }}>
              <Typography sx={{ fontWeight: "bold", display: "inline" }}>
                {label}{" "}
              </Typography>
              {value}
            </Typography>
          </Box>
        ))}
     
    </>
  );
};

const CustomXAxisTick = ({ x, y, payload }: any) => {
  if (payload && payload.value) {
    return (
      <Text x={x} y={y} width={115} textAnchor="middle" verticalAnchor="start">
        {payload.value}
      </Text>
    );
  } else {
    return <></>;
  }
};

const RegressionBarChart = ({
  barData,
}: {
  barData: RegressionBarData[] | any;
}) => {
  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={barData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={<CustomXAxisTick />} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="rmse" fill="#8884d8" />
          <Bar dataKey="mse" fill="#82ca9d" />
          <Bar dataKey="R2" fill="#b34a8d" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

const ClassificationBarChart = ({
  barData,
}: {
  barData: ClassificationBarData[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={barData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={<CustomXAxisTick />} />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" />
        <Bar dataKey="accuracy" fill="#8884d8" />
        <Bar dataKey="precision" fill="#82ca9d" />
        <Bar dataKey="recall" fill="#b34a8d" />
        <Bar dataKey="f1" fill="#c99a8d" />
        <Bar dataKey="roc_auc" fill="#ff7f50" />
        <Bar dataKey="specificity" fill="#00ced1" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CompareVisualisation;
