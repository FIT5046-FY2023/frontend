import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import { MLTypes, mlTypesList } from "../enums/machineLearningTasks";
import {
  classificationMachineLearningAlgo,
  regressionMachineLearningAlgo,
} from "../enums/machineLearningAlgo";
import { ParametersSection } from "./AnalysisFormComponents/ParametersSection";
import { MLData } from "./AnalysisFormComponents/mlDatatypes";

export interface AnalysisProps {
  setMLData: React.Dispatch<MLData[]>;
  mlData: MLData[];
  setStateList: React.Dispatch<any[]>;
  stateList: any[];
}

const emptyForm: MLData = { mlType: "", mlAlgo: "", mlOptions: {} };
export const initialFormValues: MLData[] = [{ ...emptyForm }];

const Analysis = (props: AnalysisProps) => {
  const {
    setMLData: setFormValues,
    mlData: formValues,
    stateList,
    setStateList,
  } = props;
  // const [ formValues, setFormValues ] = useState<MLData[]>(initialFormValues);
  const handleMLTasksChange = (
    event: SelectChangeEvent<any>,
    index: number
  ) => {
    let formValuesCopy = formValues.map((object) => object);
    formValuesCopy[index].mlType = event.target.value;
    formValuesCopy[index].mlAlgo = "";
    formValuesCopy[index].mlOptions = {};
    setFormValues(formValuesCopy);
    console.log(formValuesCopy);
  };

  const handleMLChange = (event: SelectChangeEvent<any>, index: number) => {
    let formValuesCopy = formValues.map((object) => object);
    formValuesCopy[index].mlAlgo = event.target.value;
    formValuesCopy[index].mlOptions = {};
    setFormValues(formValuesCopy);
    console.log(formValuesCopy);
  };


  const handleAddTask = (event: any) => {
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

  const handleParamChange = (
    event: React.ChangeEvent<any>,
    indexToRemove: number,
    option: string
  ) => {
    let name = event.target.name;
    const value = event.target.value;
    console.log(name);
    console.log(value);
    let formValuesCopy = formValues.map((object, i) => {
      console.log(name);
      if (i == indexToRemove) {
        (object as any).mlOptions[option] = value;
      }
      console.log(object);
      return object;
    });
    console.log(formValuesCopy);
    setFormValues([...formValuesCopy]);
    console.log("in handleParamChange");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minWidth={"100%"}
      flexDirection={"column"}
    >
      <Stack spacing={2} maxWidth={"40vw"} width={"100%"}>

        {formValues.map((mlData, index) => {
          return (
            <Stack spacing={2} maxWidth={"40vw"} width={"100%"}>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                minWidth={"100%"}
                flexDirection={"row"}
              >
                {" "}
                <IconButton
                  size="small"
                  onClick={(e) => handleRemoveTask(e, index)}
                >
                  <DeleteIcon />
                </IconButton>
                <Typography align="left" variant="subtitle2">
                  {" "}
                  ML Algorithm #{index + 1}
                </Typography>
              </Box>
              <FormControl fullWidth>
                 <InputLabel size="small" id="task-type-select">
                  Machine Learning Type
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
                 <InputLabel size="small" id="demo-simple-select-label">
                  Machine Learning Algorithm
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={mlData.mlAlgo}
                  label="Machine Learning Algorithm"
                  onChange={(e) => handleMLChange(e, index)}
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
      </Stack>
    </Box>
  );
};
export default Analysis;
