import React from 'react';
import { FormControlLabel, FormGroup, Checkbox, Button } from '@mui/material';

const Preprocessing = (props: {checkbox: React.SetStateAction<{obesity: boolean;
  drinking: boolean;
  lack_fruit: boolean;
  lack_exercise: boolean;
  over_65: boolean;
  early_school: boolean;
  low_income: boolean;
  hcc_holder: boolean;
  unemployed: boolean;
  comm_support: boolean;
  carer: boolean;
  diabetes: boolean;
  mental_disease: boolean;
  psycho: boolean;
  hypertension: boolean}>, setCheckboxValues:React.Dispatch<React.SetStateAction<{smoking: boolean;
    obesity: boolean;
    drinking: boolean;
    lack_fruit: boolean;
    lack_exercise: boolean;
    over_65: boolean;
    early_school: boolean;
    low_income: boolean;
    hcc_holder: boolean;
    unemployed: boolean;
    comm_support: boolean;
    carer: boolean;
    diabetes: boolean;
    mental_disease: boolean;
    psycho: boolean;
    hypertension: boolean;}>>}) => {
    const {checkbox, setCheckboxValues} = props; 
    const checkboxOptions = [
        { id: 1, label: 'Smoking', value: 'smoking' },
        { id: 2, label: 'Obesity', value: 'obesity' },
        { id: 3, label: 'Drinking', value: 'drinking' },
        { id: 4, label: 'Lack Fruit', value: 'lack_fruit' },
        { id: 5, label: 'Lack Exercise', value: 'lack_exercise' },
        { id: 6, label: 'Over 65?', value: 'over_65' },
    ];



    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
     //const newdata = {...checkbox}
      //const target_id = event.target.id
     // newdata[target_id] = event.target.value

     const name = event.target.value
     const checked = event.target.checked
     setCheckboxValues((prevValues) => ({
       ...prevValues,
       [name]: checked,
     }));
     console.log(checkbox)
      
      
    }


    return <> 
    <div> 

    <FormGroup>
    <h1>Feature Selection</h1>
    <h3>Unhealthy Behaviours</h3>
    {checkboxOptions.map((option) => (
        <FormControlLabel control={<Checkbox defaultChecked  onChange={handleCheckbox}/>} label={option.label} value={option.value} />
    
      ))}
    </FormGroup>



    </div> 
 
</>
}
export default Preprocessing;