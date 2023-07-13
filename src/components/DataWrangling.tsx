import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from "@mui/material";
import React from "react";

export interface DataWranglingProps {
  setImputationValue: React.Dispatch<React.SetStateAction<string>>;
  imputation: React.SetStateAction<string>;
}

const DataWrangling = (props:DataWranglingProps) => {
  const {setImputationValue, imputation} = props; 

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImputationValue((event.target as HTMLInputElement).value);
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

    </>
};
export default DataWrangling;
