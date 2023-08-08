import { Stack, TextField } from "@mui/material";
import { RegressionAlgorithmsApiValues, ClassificationAlgorithmsApiValues } from "../../enums/machineLearningAlgo";
import { mlOptionFields } from "../../enums/machineLearningOptions";
import { KNNOptions, MLData } from "./mlDatatypes";

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
        <Stack
          spacing={2}
          maxWidth={"40vw"}
          width={"100%"}
        >
          <TextField
            name={`MLData.${index}.mlOptions.trees`}
            id="filled-number"
            label="Number of Trees"
            type="number"
            value={data.mlOptions? mlOptionFields.RFTrees in data.mlOptions ?  data.mlOptions[mlOptionFields.RFTrees] : "" : ""} 
            onChange={(e) => handleChange(e, index, mlOptionFields.RFTrees)}
            // onChange={(e) => handleChange(e, index, 'trees')}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            size="small"
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
          <Stack
            spacing={2}
            maxWidth={"40vw"}
            width={"100%"}
          >
  
          <TextField
            name={`MLData.${index}.mlOptions.KNNneighbours`}
            id="filled-number"
            label="Number of Neighbours"
            type="number"
            value={data.mlOptions ? (data.mlOptions as KNNOptions)[mlOptionFields.KNNneighbours] ? (data.mlOptions as KNNOptions)[mlOptionFields.KNNneighbours] : "" :""}
            onChange={(e) => handleChange(e, index, mlOptionFields.KNNneighbours)}
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