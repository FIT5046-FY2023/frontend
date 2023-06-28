import { Box, Chip, Stack } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";

import { machineLearningAlgo } from "../enums/machineLearningAlgo";

const Analysis = (props: {MLAlgorithms: any[], setMLAlgos: React.Dispatch<any[]>}) => {
  const { setMLAlgos, MLAlgorithms } = props;
  const handleMLChange = (event: SelectChangeEvent<any>) => {
    setMLAlgos(event.target.value);
    console.log(MLAlgorithms)
  };
  
  return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minWidth={'100%'}
      >
        <Stack spacing={2} maxWidth={'40vw'} width={'100%'}>

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Machine Learning Algorithm</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={MLAlgorithms}
            label="Machine Learning Algorithm"
            onChange={handleMLChange}
            multiple={true}
            size="small"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            >
          {
            machineLearningAlgo.map((op) => (
              <MenuItem
              key={op.value}
              value={op.label}
              >
                  {op.label}
                </MenuItem>
              ))
            }
            </Select>
          </FormControl>


          <FormControl fullWidth>
          
          <InputLabel id="spatial-analytic-select">Spatial Analytic Algorithms</InputLabel>
          <Select
            labelId="spatial-analytic-select"
            id="spatial-analytic-select"
            value={[]}
            label="Spatial Analytic Algorithms"
            onChange={()=>{}}
            multiple={true}
            size="small"
            >
            {
              machineLearningAlgo.map((op) => (
                <MenuItem
                  key={op.value}
                  value={op.value}
                >
                  {op.label}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
            </Stack>
      </Box>
  );
};

export default Analysis;
