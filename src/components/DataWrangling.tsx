import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from "@mui/material";
import React from "react";

export interface DataWranglingProps {
  setImputationValue: React.Dispatch<React.SetStateAction<string>>;
  imputation: React.SetStateAction<string>;
  setOutlierValue: React.Dispatch<React.SetStateAction<string>>;
  outlier: React.SetStateAction<string>;
}

const DataWrangling = (props:DataWranglingProps) => {
  const {setImputationValue, imputation, setOutlierValue, outlier} = props; 

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImputationValue((event.target as HTMLInputElement).value);
  };

  const handleOutliers = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutlierValue((event.target as HTMLInputElement).value);
  };

    return <> 

<h2> Data Wrangling </h2>

<FormControl>
    <FormLabel>Imputation</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={imputation}
        onChange={handleChange}
      >
        <FormControlLabel value="mean" control={<Radio />} label="Mean" />
        <FormControlLabel value="mode" control={<Radio />} label="Mode" />
        <FormControlLabel value="median" control={<Radio />} label="Median" />
      </RadioGroup>
</FormControl>

<br></br>

<FormControl>
      <FormLabel>Handling Outliers</FormLabel>
      <RadioGroup
        row
        aria-labelledby="preprocessing-methods"
        name="preprocessing-methods"
        value={outlier}
        onChange={handleOutliers}

      >

        <FormControlLabel value="z-method" control={<Radio />} label="Z-method" />
        <FormControlLabel value="iqr" control={<Radio />} label="IQR" />  
      </RadioGroup>
</FormControl>

    </>
};
export default DataWrangling;
