import { Box, Chip, Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import { machineLearningTasks } from "../enums/machineLEarningTasks";
import {
  RegressionAlgorithmsKey,
  machineLearningAlgo,
  mapRegressionAlgoKeyToLabel,
} from "../enums/machineLearningAlgo";

export interface AnalysisProps {
  setMLAlgos: React.Dispatch<any[]>;
  MLAlgorithms: any[];
  setMLTasks: React.Dispatch<any[]>; 
  MLTasks: any[]; 
}

const Analysis = (props: AnalysisProps) => {
    const { setMLAlgos, MLAlgorithms, setMLTasks, MLTasks } = props;
    const handleMLTasksChange = (event: SelectChangeEvent<any>) => {
      setMLTasks(event.target.value);
      console.log(MLTasks);
    };
    const handleMLChange = (event: SelectChangeEvent<any>) => {
      setMLAlgos(event.target.value);
      console.log(MLAlgorithms);
    };

    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minWidth={"100%"}
      >
        <Stack spacing={2} maxWidth={"40vw"} width={"100%"}>
          <FormControl fullWidth>
            <InputLabel id="task-type-select">Choose a task</InputLabel>
            <Select
              labelId="task-type-select"
              id="task-type-select"
              value={MLTasks}
              label="Machine Learning Tasks"
              onChange={handleMLTasksChange}
              multiple={true}
              size="small"
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {machineLearningTasks.map((task) => (
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
                  console.log(key, label);
                  return (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  );
                }
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="spatial-analytic-select">
              Spatial Analytic Algorithms
            </InputLabel>
            <Select
              labelId="spatial-analytic-select"
              id="spatial-analytic-select"
              value={[]}
              label="Spatial Analytic Algorithms"
              onChange={() => {}}
              multiple={true}
              size="small"
            >
              {machineLearningAlgo.map((op) => (
                <MenuItem key={op.value} value={op.value}>
                  {op.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>
    );
  };
export default Analysis;
