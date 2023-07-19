import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useState } from "react";
import { MLTypes, mlTypesList } from "../enums/machineLearningTasks";
import {
  spatialAnalysisStates,
  SpatialStates,
  spatialStatesList,
} from "../enums/spatialAnalysisStates";
import {
  classificationMachineLearningAlgo,
  regressionMachineLearningAlgo,
} from "../enums/machineLearningAlgo";
import MLForm, { MLData, MLDataList, ParametersSection } from "./MLForm";
import { FormikProps } from "formik";

export interface AnalysisProps {
  setMLData: React.Dispatch<any[]>;
  mlData: any[];
  formRef: React.MutableRefObject<FormikProps<MLDataList> | null>;
  setStateList: React.Dispatch<any[]>;
  stateList: any[];
}

const emptyForm: MLData = { mlType: "", mlAlgo: "", mlOptions: {} };
export const initialFormValues: MLData[] = [{ ...emptyForm }];

const Analysis = (props: AnalysisProps) => {
  const {
    setMLData: setFormValues,
    mlData: formValues,
    formRef,
    stateList,
    setStateList,
  } = props;
  // const [ formValues, setFormValues ] = useState<MLData[]>(initialFormValues);
  const handleMLTasksChange = (
    event: SelectChangeEvent<any>,
    index: number
  ) => {
    // setMLType(event.target.value);
    // setMLTasks([event.target.value]);
    let formValuesCopy = formValues.map((object) => object);
    formValuesCopy[index].mlType = event.target.value;
    formValuesCopy[index].mlAlgo = "";
    setFormValues(formValuesCopy);
    console.log(formValuesCopy);
  };

  const handleMLChange = (event: SelectChangeEvent<any>, index: number) => {
    // setMLAlgos(event.target.value);
    // console.log(MLAlgorithms);
    let formValuesCopy = formValues.map((object) => object);
    formValuesCopy[index].mlAlgo = event.target.value;
    setFormValues(formValuesCopy);
    console.log(formValuesCopy);
  };

  const handleSpatialChange = (event: SelectChangeEvent<any>) => {
    setStateList(event.target.value);
    console.log(stateList);
  };

  const handleAddTask = (event: any, index?: number) => {
    // setMLAlgos(event.target.value);
    // console.log(MLAlgorithms);
    let formValuesCopy = formValues.map((object) => object);
    console.log({ ...emptyForm });
    console.log(formValuesCopy);
    formValuesCopy = [
      ...formValuesCopy,
      { mlType: "", mlAlgo: "", mlOptions: {} },
    ];
    console.log(formValuesCopy);
    setFormValues(formValuesCopy);
    console.log("in handleAddTask");
  };
  const handleRemoveTask = (event: any, indexToRemove: number) => {
    let formValuesCopy = formValues.filter(
      (_object, index) => index !== indexToRemove
    );
    console.log(formValuesCopy);
    setFormValues([...formValuesCopy]);
    console.log("in handleRemoveTask");
  };

  const handleParamChange = (event: any, indexToRemove: number) => {
    let name = event.target.name;
    const value = event.target.value;
    console.log(name);
    console.log(value);
    const [_name, index, mlOptions, parameter] = name.split(".");
    let formValuesCopy = formValues.map((object, i) => {
      console.log(name);
      if (i == index) {
        (object as any).mlOptions[parameter] = value;
      }
      console.log(object);
      return object;
    });
    console.log(formValuesCopy);
    // (formValuesCopy as any)[parseInt(index as string)].mlOptions[parameter] = value;
    // (formValuesCopy as any)[parseInt(index as string)][mlOptions as string][parameter as string]
    console.log(formValuesCopy);
    setFormValues([...formValuesCopy]);
    console.log("in handleRemoveTask");
  };
  const [hideOldForm, setHideOldForm] = useState<boolean>();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minWidth={"100%"}
      flexDirection={"column"}
    >
      <Stack spacing={2} maxWidth={"40vw"} width={"100%"}>
        <Typography variant="h6" gutterBottom marginTop={1} sx={{fontWeight: "bold"}}>
          {" "}
          Spatial Analysis
        </Typography>
        <FormControl fullWidth>
          <InputLabel id="spatial-analytic-select">Choose States</InputLabel>
          <Select
            labelId="task-type-select"
            id="task-type-select"
            value={stateList}
            label="Spatial Analysis"
            onChange={handleSpatialChange}
            multiple={true}
            size="small"
            renderValue={(selected) => {
              console.log(selected);
              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((task) => (
                    <Chip key={task} label={task} />
                  ))}
                </Box>
              );
            }}
          >
            {spatialStatesList.map((task) => (
              <MenuItem key={task.value} value={task.label}>
                {task.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box paddingTop={1} ></Box>
        <Typography variant="h6" gutterBottom  sx={{fontWeight: "bold"}} >
          {" "}
          ML Analysis
        </Typography>

        {formValues.map((mlData, index) => {
          return (
            <Stack spacing={2} maxWidth={"40vw"} width={"100%"}>
              <Box>
                {" "}
                <IconButton
                  size="small"
                  onClick={(e) => handleRemoveTask(e, index)}
                >
                  <DeleteIcon />
                </IconButton>
                <Typography> ML Task #{index + 1}</Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel id="task-type-select">
                  Machine Learning Task
                </InputLabel>
                <Select
                  labelId="task-type-select"
                  id="task-type-select"
                  value={mlData.mlType ? formValues[index].mlType : ""}
                  label="Machine Learning Task"
                  onChange={(e) => handleMLTasksChange(e, index)}
                  multiple={false}
                  size="small"
                >
                  {mlTypesList.map((task) => (
                    <MenuItem key={task.value} value={task.label}>
                      {task.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Machine Learning Algorithm
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={mlData.mlAlgo}
                  label="Machine Learning Algorithm"
                  onChange={(e) => handleMLChange(e, index)}
                  multiple={false}
                  size="small"
                >
                  {mlData.mlType === MLTypes.Regression &&
                    regressionMachineLearningAlgo.map((op) => {
                      // console.log(key, label);
                      return (
                        <MenuItem key={op.value} value={op.value}>
                          {op.label}
                        </MenuItem>
                      );
                    })}
                  {mlData.mlType === MLTypes.Classification &&
                    classificationMachineLearningAlgo.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {!!mlData.mlAlgo && (
                <ParametersSection
                  algoName={mlData.mlAlgo}
                  index={index}
                  handleChange={handleParamChange}
                  data={mlData}
                />
              )}
            </Stack>
          );
        })}
        <Button variant="contained" onClick={(e) => handleAddTask(e)}>
          Add
        </Button>

        {hideOldForm && <MLForm formRef={formRef} />}
      </Stack>
      <Box sx={{ marginTop: "3rem" }}>
        <Button variant="outlined" onClick={() => setHideOldForm(!hideOldForm)}>
          show/hide old form
        </Button>
      </Box>
    </Box>
  );
};
export default Analysis;
