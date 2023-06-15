import React from 'react';
import { FormControlLabel, FormGroup, Checkbox, Button } from '@mui/material';



const Preprocessing = (props: {checkbox: React.SetStateAction<any[]>, setCheckboxValues:React.Dispatch<React.SetStateAction<any[]>>, checkboxOptions:any[], corrList:any[]}) => {
    const {checkbox, setCheckboxValues, checkboxOptions, corrList} = props; 


    const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    //const newdata = {...checkbox}
    //const target_id = event.target.id
    // newdata[target_id] = event.target.value

     const name = event.target.value
     const checked = event.target.checked

     if (checked) {
      // Add the item to the list
      setCheckboxValues((prevValues: any[]) => prevValues.filter((item) => item !== name));
      
    } else {
      // Remove the item from the list
      setCheckboxValues((prevValues: any[]) => [...prevValues, name]);
    }
     
  
    }


    return <> 
    <div> 
    <FormGroup>
    <h1>Feature Selection</h1>
    <h3>Unhealthy Behaviours</h3>
     {checkboxOptions.map((option: string, index: number) => (
        <FormControlLabel control={<Checkbox defaultChecked onChange={handleCheckbox}/>} label={option+ "- " + corrList[index]} value={option} />
    
      ))}  
    </FormGroup>



    </div> 
 
</>
}
export default Preprocessing;