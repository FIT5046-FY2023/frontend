import React, { useEffect } from "react";
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FieldArray,
  FieldArrayRenderProps,
  FormikProps,
} from "formik";
import { MLTypes, mlTypesList } from "../enums/machineLearningTasks";
import {
  ClassificationAlgorithmsApiValues,
  RegressionAlgorithmsApiValues,
  classificationMachineLearningAlgo,
  regressionMachineLearningAlgo,
} from "../enums/machineLearningAlgo";
import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { MLTypeSelector } from "./AnalysisFormComponents/MLTypeSelector";
import { MLAlgoSelector } from "./AnalysisFormComponents/MLAlgoSelector";

interface KNNOptions {
  KNNneighbours?: number;
}

interface RandomForestOptions {
  trees?: number;
}

export interface MLData {
  mlType: MLTypes | "";
  mlAlgo:
    | RegressionAlgorithmsApiValues
    | ClassificationAlgorithmsApiValues
    | "";
  mlOptions: KNNOptions & RandomForestOptions & {};
}

export interface MLDataList {
  MLData: MLData[];
}

const initialFormValues: MLDataList = {
  MLData: [{ mlType: "", mlAlgo: "", mlOptions: {} }],
};


const MLForm = ({
  formRef,
}: {
  formRef: React.MutableRefObject<FormikProps<MLDataList> | null>;
}) => {

  return (
    <div>
      <Formik
        initialValues={initialFormValues}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          alert(JSON.stringify(values, null, 2));
        }}
        innerRef={(f) => (formRef.current = f)}
      >
        {({ values, handleChange, handleBlur, handleReset }) => (
          <Form>
            <FieldArray name="MLData">
              {({ insert, remove, push, form }: FieldArrayRenderProps) => (
                <Box
                  display="flex"
                  justifyContent="left"
                  alignItems="left"
                  minWidth={"100%"}
                  flexDirection={"column"}
                >
                    {values.MLData.length > 0 &&
                      values.MLData.map((data, index) => (
                        <div className="row" key={index}>
                        <Box width={"100%"} sx={{margin: 1}}><Container sx={{padding: 4, width: "100%"}}>
                          <Typography gutterBottom variant="body1">
                            {" "}
                            ML Task #{index + 1}
                          </Typography>
                          <div className="col">
                            <MLTypeSelector name={`MLData.${index}.mlType`} value={data.mlType} onChange={handleChange} />

                          </div>

                          <div className="col">
                            {!!data.mlType && <MLAlgoSelector name={`MLData.${index}.mlAlgo`} value={data.mlAlgo} mlType={data.mlType} onChange={handleChange}/>}
                            <Field name={`MLData.${index}.mlAlgo`} as="select">
                              <option value={""}>{"Select Algorithm"}</option>
                              {!!data.mlType &&
                                data.mlType === MLTypes.Regression &&
                                regressionMachineLearningAlgo.map((algo) => (
                                  <option key={algo.value} value={algo.value}>
                                    {algo.label}
                                  </option>
                                ))}
                              {!!data.mlType &&
                                data.mlType === MLTypes.Classification &&
                                classificationMachineLearningAlgo.map(
                                  (algo) => (
                                    <option key={algo.value} value={algo.value}>
                                      {algo.label}
                                    </option>
                                  )
                                )}
                            </Field>
                            <ErrorMessage
                              name={`MLData.${index}.mlAlgo`}
                              component="div"
                              className="field-error"
                            />
                          </div>

                         
                          {!!data.mlAlgo && <ParametersSection algoName={data.mlAlgo} index={index} handleChange={handleChange} data={data} />}
                          <div className="col">
                            <Button
                              variant="outlined"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </Button>
                          </div>
                          </Container></Box>
                        </div>
                      ))
                      }
                    <Button
                      variant="outlined"
                      onClick={() =>
                        push({ mlType: "", mlAlgo: "", mlOptions: {} })
                      }
                    >
                      Add
                    </Button>
                  
                </Box>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MLForm;

export type ParameterSectionProps = {
  algoName: string; 
  index: number; 
  handleChange: any;
  data: MLData;
}
export const ParametersSection = ({algoName, index, handleChange, data}: ParameterSectionProps) => {
    if ([
      RegressionAlgorithmsApiValues.RandomForest,
      ClassificationAlgorithmsApiValues.RandomForest,
    ].includes(algoName as any)) {
      return <>
      <Typography>
        Parameters
        </Typography>
      <Stack
        spacing={2}
        maxWidth={"40vw"}
        width={"100%"}
      >
        {/* <label>
          <Typography variant="body2"># Number of Trees</Typography>
          <Field
            name={`MLData.${index}.mlOptions.trees`}
            placeholder="Enter integer"
            type="number"
          />
        </label> */}
        <TextField
          name={`MLData.${index}.mlOptions.trees`}
          id="filled-number"
          label="Number of Trees"
          type="number"
          value={data.mlOptions?.trees ? data.mlOptions?.trees : ""} 
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
        />
        {/* <label
          htmlFor={`MLData.${index}.mlOptions.maxDepth`}
        >
          Max tree depth
        </label>
        <Field
          name={`MLData.${index}.mlOptions.maxDepth`}
          placeholder="Enter integer"
          type="input"
        />
        <ErrorMessage
          name={`MLData.${index}.mlOptions.maxDepth`}
          component="div"
          className="field-error"
        /> */}
      </Stack>
    </>
    }
    else if ([
      RegressionAlgorithmsApiValues.KNearestNeighbours,
      ClassificationAlgorithmsApiValues.KNearestNeighbours,
    ].includes(algoName as any) ) { 
      return (
      <>
        <Typography variant="body1">Parameters</Typography>
        <Stack
          spacing={2}
          maxWidth={"40vw"}
          width={"100%"}
        >
            {/* <label
            htmlFor={`MLData.${index}.mlOptions.weights`}
          >
          <Typography variant="body2">
            # Number of Neighbours
          </Typography>
          <Field
            name={`MLData.${index}.mlOptions.KNNneighbours`}
            placeholder="Enter integer"
            type="input"
          /></label> */}

        <TextField
          name={`MLData.${index}.mlOptions.KNNneighbours`}
          id="filled-number"
          label="Number of Neighbours"
          type="number"
          value={data.mlOptions?.KNNneighbours ? data.mlOptions?.KNNneighbours : ""} 
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
        />

          {/* <label
            htmlFor={`MLData.${index}.mlOptions.weights`}
          >
            Weights
          </label>
          <Field
            name={`MLData.${index}.mlOptions.weights`}
            as="select"
          >
            <option key={""} value={""}>
              Select
            </option>
            {["uniform", "distance"].map(
              (weightType) => (
                <option
                  key={weightType}
                  value={weightType}
                >
                  {weightType}
                </option>
              )
            )}
          </Field>
          <ErrorMessage
            name={`MLData.${index}.mlOptions.weights`}
            component="div"
            className="field-error"
          /> */}
        </Stack>
      </>
    )}

    else {
      return <></>
    }

}