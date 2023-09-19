import React, {useEffect, useState} from 'react';
import { Box, Chip, CircularProgress, TextField } from "@mui/material";
import { FormControlLabel, FormGroup, Checkbox, Button } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
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
    const {loading, checkbox, setCheckboxValues, setTarget, target, selectedData, checkboxOptions, setLoading} = props; 
    const [isDataVisible, setIsDataVisible] = useState(false);
    const [csv, setCSV] = useState<any[]>([]);
    const [heatmapString, setHeatmapString] = useState("");
    const [realCheckboxOptions, setRealCheckboxOptions] = useState<any[]>([]); 
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [precheckedRows, setPrecheckedRows] = useState<any[]>([]);
    const [featureOption, setFeatureOption] = useState("Filter");
    const [selectedAlgo, setSelectedAlgo] = useState('regression');
    const [selectedAlgoOption, setSelectedAlgoOption] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const featureSelectionOptions = ["Filter", "Wrapper", "Other"]
    const wrapperMethods = ["Forward Selection", "Backward Selection", "Stepwise Selection"]
    const filterMethods = ["Select K Features"]
    const regressionOptions = ['Linear Regression'];
    const classificationOptions = ['K-Nearest'];
    const otherOptions = ['PCA']; 


    const selectedAlgos = selectedAlgo === 'regression' ? regressionOptions : classificationOptions 
    const selectedMethods = featureOption === 'Filter' ? filterMethods: featureOption === 'Wrapper' ? wrapperMethods: otherOptions;



    const handleAlgoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedAlgo((event.target as HTMLInputElement).value);
      setSelectedAlgoOption("")
      setIsDataVisible(false);
      // handleVisual();
    };

    const handlefeatureOption = (event: SelectChangeEvent<any>) => {
      setFeatureOption(event.target.value);
      setSelectedAlgoOption("")
      setSelectedMethod("")
      setSelectedAlgo("")
      setIsDataVisible(false);
      console.log(featureOption)
      // handleVisual();
    };
    
    const handleAlgoOptionChange = (event: SelectChangeEvent<any>) => {
      setSelectedAlgoOption(event.target.value);
      setIsDataVisible(false);
    };
    
    const handleCheckboxOptions = async () => {
      setLoading(true);
      let preprocessBody = ""; 
      if (featureOption === "Filter") {
      preprocessBody = JSON.stringify({ selectedData: selectedData, target: target, featureOption: featureOption, featureMethod:selectedMethod})
      } else {
      preprocessBody = JSON.stringify({ selectedData: selectedData, target: target, featureOption: featureOption, featureMethod:selectedMethod,selectedAlgo:selectedAlgo, selectedAlgoOption:selectedAlgoOption})
      }

      console.log(preprocessBody)

      fetch("http://127.0.0.1:5000/preprocessing", {
        method: "POST",
        body: preprocessBody,
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
          setCheckboxValues(data.selectedIndices)
          setPrecheckedRows(data.selectedIndices)
          console.log(checkboxOptions)
          console.log(checkbox)
          console.log(data.selectedIndices)
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
  
    };



    const handleButtonClick = () => {
      handleCheckboxOptions(); 
      setIsDataVisible(true);
    };


    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
      setCheckboxValues(newSelection);
      setPrecheckedRows(newSelection); 
      console.log(checkbox)
    };

    const handleFeatureSelectionChange = (event: SelectChangeEvent<any>) => {
      setSelectedMethod(event.target.value);
      setIsDataVisible(false);

    };

    
      const handleTargetChange = (event: SelectChangeEvent<any>) => { 
        setTarget(event.target.value);
        setIsDataVisible(false);

      };

    return <> 
    {loading ? <CircularProgress /> :
    (
    
    <div> 

<h2> Feature Selection </h2>

<FormControl sx={{ m: 1, minWidth: 350 }}>
     <InputLabel size="small" id="demo-simple-select-label">Feature Selection Method </InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={featureOption}
      label="Feature Selection Method"
      onChange={handlefeatureOption}
      size="small"
      >
    {
        featureSelectionOptions.map((op) => (
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

<FormControl sx={{ m: 1, minWidth: 350 }}>
     <InputLabel size="small" id="demo-simple-select-label">Feature Selection Method </InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={selectedMethod}
      label="Feature Selection Method"
      onChange={handleFeatureSelectionChange}
      size="small"
      >
    {
      selectedMethods.map((op) => (
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

{featureOption=="Wrapper" && (<>





  <br></br>

  <FormControl sx={{ m: 1, minWidth: 100 }}>
  <RadioGroup
    row
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="regression"
    name="radio-buttons-group"
    value={selectedAlgo}
    onChange={handleAlgoChange}
  >
    <FormControlLabel value="regression" control={<Radio />} label="Regression" />
    <FormControlLabel value="classification" control={<Radio />} label="Classification" />
  </RadioGroup>
</FormControl>




    <br></br>

    <FormControl sx={{ m: 1, minWidth: 350 }}>
     <InputLabel size="small" id="demo-simple-select-label"> Machine Learning Algorithm </InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={selectedAlgoOption}
      label="Machine Learning Algorithm"
      onChange={handleAlgoOptionChange}
      size="small"
      >
    {
        selectedAlgos.map((op) => (
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

  </>


    )

}
<br></br>
    
<h3> Target </h3>
    <FormControl sx={{ m: 1, minWidth: 500 }}>
           <InputLabel size="small" id="demo-simple-select-label">CVD Target</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={target}
            label="CVD Target"
            onChange={handleTargetChange}
            size = "small"

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

      


      <div ><Button variant="outlined" onClick={handleButtonClick}>Show Selected Features</Button></div>

    

      {isDataVisible && (
        <>
          <h3> Select Features</h3>
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
          sx={{ borderRadius: 4, px: 2, pt: 1 }}
          rows={realCheckboxOptions}
              columns={columns}
              checkboxSelection
              onRowSelectionModelChange={handleSelectionChange}
              rowSelectionModel={precheckedRows}
            />
          </div>

          <br></br>
    
    <img src={"data:image/jpeg;charset=utf-8;base64, " + heatmapString}></img>

        </>
      )}

   





       
      </div>)}
    </>
};
export default Preprocessing;
