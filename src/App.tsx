import React, { useEffect, useState } from "react";
import "./App.css";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Navigation, { sections } from "./components/Navigation";
import CVDAnalysisForm from "./components/CVDAnalysisForm";

function App() {
  const theme = createTheme();


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /><div className="App">
      <Navigation sections={sections} title={"Cardiovascular Disease Data"} />

      <CVDAnalysisForm/> 

    
      </div>
    </ThemeProvider>
  );
}

export default App;
