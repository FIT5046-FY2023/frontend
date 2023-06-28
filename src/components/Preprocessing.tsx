import React, {useState} from 'react';
import { Box, Chip } from "@mui/material";
import { FormControlLabel, FormGroup, Checkbox, Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DataGrid, GridColDef, GridValueGetterParams, GridRowSelectionModel} from '@mui/x-data-grid';
import VisibilityIcon from "@mui/icons-material/Visibility";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'id', width:100},
  { field: 'feature', headerName: 'Feature', width: 250 },
  { field: 'correlation', headerName: 'Correlation', type: 'number', width: 160 },
  { field: 'minimum', headerName: 'Minimum', type: 'number', width: 160 },
  { field: 'maximum', headerName: 'Maximum', type: 'number', width: 160 },
  { field: 'mean', headerName: 'Mean', type: 'number', width: 160}
];

const Preprocessing = (props: {checkbox: React.SetStateAction<GridRowSelectionModel>, setCheckboxValues:React.Dispatch<React.SetStateAction<GridRowSelectionModel>>, checkboxOptions:any[], setImputationValue: React.Dispatch<React.SetStateAction<string>>, imputation: React.SetStateAction<string>, setTarget: React.Dispatch<string>, target: string, heatmapString:string}) => {
    const {checkbox, setCheckboxValues, checkboxOptions, setImputationValue, imputation, setTarget, target, heatmapString} = props; 
    const [isDataVisible, setIsDataVisible] = useState(false);
    const [csv, setCSV] = useState<any[]>([]);
    const [realCheckboxOptions, setRealCheckboxOptions] = useState<any[]>([]); 

    const handleButtonClick = () => {
      setIsDataVisible(!isDataVisible);
      setRealCheckboxOptions(checkboxOptions.filter((item) => item.feature != target));
      console.log(heatmapString)
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setImputationValue((event.target as HTMLInputElement).value);
      handleVisual();
    };

    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
      setCheckboxValues(newSelection);
    };


    const handleVisual = async () => {
      fetch("http://127.0.0.1:5000/preprocessing", {
        method: "POST",
        body: JSON.stringify({imputation: imputation}),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
      .then((response) => response.json())
      .then((data) => {
        setCSV(data)
        
      })
      .catch((err) => {
        console.log(err.message);
      })};
    
      const handleTargetChange = (event: SelectChangeEvent<any>) => {
        setTarget(event.target.value);
        setIsDataVisible(false);

      };

    return <> 
    <div> 

    <h3>1. Select CVD Target </h3>
    <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={target}
            label="Machine Learning Algorithm"
            onChange={handleTargetChange}
            size="small"
            >
          {
            checkboxOptions.map((op) => (
              <MenuItem
              key={op.feature}
              value={op.feature}
              >
                  {op.feature}
                </MenuItem>
              ))
            }
            </Select>
          </FormControl>
      <br></br>
      <div ><Button variant="outlined" onClick={handleButtonClick}>Show Data</Button></div>
    

      {isDataVisible && (
        <>
          <h3>2. Select Features</h3>
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={realCheckboxOptions}
              columns={columns}
              checkboxSelection
              onRowSelectionModelChange={handleSelectionChange}
            />
          </div>

          <br></br>
    
    <img src={"data:image/jpeg;charset=utf-8;base64, " + heatmapString}></img>

    <h3>3. Handling string data </h3>

    <h3>4. How do you want to handle missing data? </h3>

    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={imputation}
        onChange={handleChange}
      >
        <FormControlLabel value="mean" control={<Radio />} label="Mean Imputation" />
        <FormControlLabel value="mode" control={<Radio />} label="Mode Imputation" />
        <FormControlLabel value="median" control={<Radio />} label="Median Imputation" />
      </RadioGroup>
    </FormControl>

        </>
      )}

   


        <h3>Preview of the File </h3>


        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableBody>
                {csv.map((item: any) => (
                  <TableRow key={item.id}>
                    {Object.values(item).map((val: any) => (
                      <TableCell key={item.code} align="center">
                        {val}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </>
};
export default Preprocessing;
