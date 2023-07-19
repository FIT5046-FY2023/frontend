import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import { MLTypes, machineLearningTasks, mlTypesList } from "../enums/machineLearningTasks";
import{ spatialAnalysisStates, SpatialStates, spatialStatesList } from "../enums/spatialAnalysisStates"
import {
  RegressionAlgorithmsKey,
  classificationMachineLearningAlgo,
  mapRegressionAlgoKeyToLabel,
} from "../enums/machineLearningAlgo";
import MLForm, { MLData, MLDataList } from "./MLForm";
import { FormikProps } from "formik";

export interface AnalysisProps {
  setMLAlgos: React.Dispatch<any[]>;
  MLAlgorithms: any[];
  setMLTasks: React.Dispatch<any[]>; 
  MLTasks: any[]; 
  formRef: React.MutableRefObject<FormikProps<MLDataList> | null>;
  setStateList:React.Dispatch<any[]>;
  stateList: any[];
}

const emptyForm: MLData = { mlType: "", mlAlgo: "", mlOptions: {} };
const initialFormValues: MLData[] = [emptyForm];

const Analysis = (props: AnalysisProps) => {
    const { setMLAlgos, MLAlgorithms, setMLTasks, MLTasks, formRef, stateList, setStateList } = props;
    const [ MLType, setMLType ] = useState<string>();
    const [ formValues, setFormValues ] = useState<MLData[]>(initialFormValues);
    const handleMLTasksChange = (event: SelectChangeEvent<any>) => {
      setMLType(event.target.value);
      setMLTasks([event.target.value]);
      console.log(MLType);
      console.log(MLTasks);
    };

    const handleSpatialChange = (event: SelectChangeEvent<any>) => {
      setStateList(event.target.value); 
      console.log(stateList)
    };
    const handleMLChange = (event: SelectChangeEvent<any>) => {
      setMLAlgos(event.target.value);
      // console.log(MLAlgorithms);
    };

    const [ hideOldForm, setHideOldForm ] = useState<boolean>();

    // const handleMLTaskChange2 = (event: SelectChangeEvent<any>, index: number) => {
    //   console.log("Handle ML Task");
    //   console.log("index:", index);
    //   let newMLData: MLData[] = [];
    //   console.log(formValues);
    //   Object.assign(newMLData, formValues);
    //   console.log(newMLData);
    //   let updatedMLDataObj = {...formValues[index],
    //   mlTask: event.target.value as MLTypes}
    //   console.log('updatedOBJ', updatedMLDataObj);
    //   console.log('event val:', event.target.value );
    //   newMLData[index] = updatedMLDataObj;
      
    //   console.log(newMLData);
    //   setFormValues(newMLData);
    //   // setFormValues((prev) => {
    //   //   let newMLData = [...prev];
    //   //   newMLData[index].mlType = event.target.value as 
    //   //   MLTypes
    //   //   console.log(newMLData)
    //   // return newMLData})

    // }

    // useEffect(()=> {
    //   console.log('Rerender')
    // }, [formValues])

    return (
     <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minWidth={"100%"}
        flexDirection={"column"}
      >
        
        <Stack spacing={2} maxWidth={"40vw"} width={"100%"}>
        
        { hideOldForm && formValues.map((mlData, index) => (
        <Stack spacing={2} maxWidth={"40vw"} width={"100%"}>
        <Typography> ML Task #{index+1}</Typography>
          <FormControl fullWidth>
            <InputLabel id="task-type-select">Choose a task</InputLabel>
            <Select
              labelId="task-type-select"
              id="task-type-select"
              value={MLTasks}
              label="Machine Learning Tasks"
              onChange={handleMLTasksChange}
              multiple={false}
              size="small"
              renderValue={(selected) => {
                console.log('render value');
                console.log(selected);
                return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    <Chip label={selected} />
                </Box>
              )}}
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
              value={MLAlgorithms}
              label="Machine Learning Algorithm"
              onChange={handleMLChange}
              multiple={true}
              size="small"
              renderValue={(selected) => {
                console.log(selected);
                return (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value: RegressionAlgorithmsKey) => (
                      <Chip
                        key={value}
                        label={
                          mapRegressionAlgoKeyToLabel[
                            value as RegressionAlgorithmsKey
                          ]
                        }
                      />
                    ))}
                  </Box>
                );
              }}
            >
              {Object.entries(mapRegressionAlgoKeyToLabel).map(
                ([key, label]) => {
                  // console.log(key, label);
                  return (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>


          
        </Stack>
        ))}
       {hideOldForm && <Button variant="contained" onClick={() => {setFormValues((prevValues) => [...prevValues, emptyForm]
        )}}>Add</Button>}

{ hideOldForm && <FormControl fullWidth>
            <InputLabel id="spatial-analytic-select">
              Choose States
            </InputLabel>
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
                      <Chip
                        key={task}
                        label={task
                        }
                      />
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
          </FormControl>}
        
        <MLForm formRef={formRef} />
        </Stack>
        <Box sx={{marginTop:"3rem"}}>
        <Button variant="outlined" onClick={() => setHideOldForm(!hideOldForm)}>show/hide old form</Button>
        </Box>
      </Box>
    );
  };
export default Analysis;
