import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import React from "react";


const Analysis = (props: {MLAlgorithms: any[], setMLAlgos: React.Dispatch<any[]>}) => {
  const { setMLAlgos, MLAlgorithms } = props;
  const handleMLChange = (event: SelectChangeEvent<any>) => {
    setMLAlgos(event.target.value);
    console.log(MLAlgorithms)
  };
  
  return (
    <>
      <Container
        // sx={{ borderColor: "blue", borderRadius: 2, borderStyle: "solid" }}
      >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Machine Learning Algorithm</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={MLAlgorithms}
            label="Machine Learning Algorithm"
            onChange={handleMLChange}
            multiple={true}
          >
            <MenuItem value={"random-forest"}>Random Forest</MenuItem>
            <MenuItem value={"k-nearest"}>K-Nearest Neighbours</MenuItem>
            <MenuItem value={"scaled-vector"}>Scaled Vector Machine</MenuItem>
            <MenuItem value={"decision-trees"}>Decision Trees</MenuItem>
            <MenuItem value={"naive-bayes"}>Naive Bayes</MenuItem>
            <MenuItem value={"logistic-regression"}>Logistic Regression</MenuItem>
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
          >
            <MenuItem value={20}>Random Forest</MenuItem>
            <MenuItem value={30}>K-Nearest Neighbours</MenuItem>
            <MenuItem value={40}>Scaled Vector Machine</MenuItem>
            <MenuItem value={50}>Decision Trees</MenuItem>
            <MenuItem value={60}>Naive Bayes</MenuItem>
            <MenuItem value={70}>Logistic Regression</MenuItem>
          </Select>
        </FormControl>
      </Container>
    </>
  );
};

export default Analysis;
