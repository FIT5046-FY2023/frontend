import React, {useEffect, useState} from 'react';
import { Box, Chip, CircularProgress } from "@mui/material";
import { FormControlLabel, FormGroup, Checkbox, Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DataGrid, GridColDef, GridValueGetterParams, GridRowSelectionModel, GridInputRowSelectionModel} from '@mui/x-data-grid';
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

export interface PreprocessProps {
  checkbox: React.SetStateAction<GridInputRowSelectionModel>;
  setCheckboxValues: React.Dispatch<
    React.SetStateAction<GridRowSelectionModel>
  >;
  checkboxOptions: any[];
  setImputationValue: React.Dispatch<React.SetStateAction<string>>;
  imputation: React.SetStateAction<string>;
  setTarget: React.Dispatch<string>;
  target: string;
  loading: boolean; 
  selectedData: React.SetStateAction<string>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}


const columns: GridColDef[] = [
  { field: 'id', headerName: 'id', width:100},
  { field: 'feature', headerName: 'Feature', width: 250 },
  //{ field: 'correlation', headerName: 'Correlation', type: 'number', width: 160 },
  { field: 'minimum', headerName: 'Minimum', type: 'number', width: 160 },
  { field: 'maximum', headerName: 'Maximum', type: 'number', width: 160 },
  { field: 'mean', headerName: 'Mean', type: 'number', width: 160}
];

const Preprocessing = (props: PreprocessProps) => {
    const {loading, checkbox, setCheckboxValues, setImputationValue, imputation, setTarget, target, selectedData, checkboxOptions, setLoading} = props; 
    const [isDataVisible, setIsDataVisible] = useState(false);
    const [csv, setCSV] = useState<any[]>([]);
    const [heatmapString, setHeatmapString] = useState("");
    const [realCheckboxOptions, setRealCheckboxOptions] = useState<any[]>([]); 
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [precheckedRows, setPrecheckedRows] = useState<any[]>([]);


    
    const handleCheckboxOptions = async () => {
      setLoading(true);
      fetch("http://127.0.0.1:5000/preprocessing", {
        method: "POST",
        body: JSON.stringify({ selectedData: selectedData, target: target}),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => { 
          setLoading(false);
          return response.json();})
        .then((data) => {
          var rows = [];
  
          for (var i = 0; i < data.headerLabels.length; i++) {
            var featureObject = {
              id: i,
              feature: data.headerLabels[i],
              //correlation: data.corrList[i],
              minimum: data.minList[i],
              maximum: data.maxList[i],
              mean: data.meanList[i],
            };
  
            rows.push(featureObject);
          }
          setHeatmapString(data.encodedString);
          setRealCheckboxOptions(rows.filter((item) => item.feature != target));
          setPrecheckedRows(data.selectedIndices)
          console.log(data.selectedIndices)
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
  
    };



    const handleButtonClick = () => {
      handleCheckboxOptions(); 
      setIsDataVisible(!isDataVisible);
      
      console.log(heatmapString)
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setImputationValue((event.target as HTMLInputElement).value);
      // handleVisual();
    };

    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
      setCheckboxValues(newSelection);
      console.log(checkbox)
    };


    
    
      const handleTargetChange = (event: SelectChangeEvent<any>) => {
        setTarget(event.target.value);
        setIsDataVisible(false);

      };
    
      console.log(loading);

    return <> 
    {loading ? <CircularProgress /> :
    (<div> 

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
              key={op}
              value={op}
              >
                  {op}
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
              rowSelectionModel={precheckedRows}
            />
          </div>

          <br></br>
    
    <img src={"data:image/jpeg;charset=utf-8;base64, " + heatmapString}></img>

    <h3>3. How do you want to handle missing data? </h3>

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

   





       
      </div>)}
    </>
};
export default Preprocessing;
