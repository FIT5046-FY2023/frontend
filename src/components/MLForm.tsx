import React from "react";
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
import { Box, Button, Stack, Typography } from "@mui/material";
import { MLData } from "./AnalysisFormComponents/mlDatatypes";

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
        {({ values }) => (
          <Form>
            <FieldArray name="MLData">
              {({ insert, remove, push, form }: FieldArrayRenderProps) => (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minWidth={"100%"}
                  flexDirection={"column"}
                >
                    {values.MLData.length > 0 &&
                      values.MLData.map((data, index) => (
                        <div className="row" key={index}>
                          <Typography variant="body1">
                            {" "}
                            ML Task #{index + 1}
                          </Typography>
                          <div className="col">
                            <Field name={`MLData.${index}.mlType`} as="select">
                              <option value={""}>
                                {"Select Machine Learning Type"}
                              </option>
                              {mlTypesList.map((mlType) => (
                                <option key={mlType.value} value={mlType.value}>
                                  {mlType.label}
                                </option>
                              ))}
                            </Field>

                            <ErrorMessage
                              name={`MLData.${index}.name`}
                              component="div"
                              className="field-error"
                            />
                          </div>

                          <div className="col">
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

                          {!!data.mlAlgo &&
                            [
                              RegressionAlgorithmsApiValues.RandomForest,
                              ClassificationAlgorithmsApiValues.RandomForest,
                            ].includes(data.mlAlgo as any) && (
                              <div className="col">
                                <Typography>
                                  Parameters
                                  </Typography>
                                <Stack
                                  spacing={2}
                                  maxWidth={"40vw"}
                                  width={"100%"}
                                >
                                  <label
                                    htmlFor={`MLData.${index}.mlOptions.trees`}
                                  >
                                    <Typography variant="body2"># Number of Trees</Typography>
                                    <Field
                                      name={`MLData.${index}.mlOptions.trees`}
                                      placeholder="Enter integer"
                                      type="input"
                                    />
                                  </label>

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
                              </div>
                            )}
                          {!!data.mlAlgo &&
                            [
                              RegressionAlgorithmsApiValues.KNearestNeighbours,
                              ClassificationAlgorithmsApiValues.KNearestNeighbours,
                            ].includes(data.mlAlgo as any) && (
                              <Box className="col" sx={{marginTop:"1rem"}}>
                                <Typography variant="body1">Parameters</Typography>
                                <Stack
                                  spacing={2}
                                  maxWidth={"40vw"}
                                  width={"100%"}
                                >
                                    <label
                                    htmlFor={`MLData.${index}.mlOptions.weights`}
                                  >
                                  <Typography variant="body2">
                                    # Number of Neighbours
                                  </Typography>
                                  <Field
                                    name={`MLData.${index}.mlOptions.KNNneighbours`}
                                    placeholder="Enter integer"
                                    type="input"
                                  /></label>

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
                              </Box>
                            )}
                          <div className="col">
                            <Button
                              variant="outlined"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
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