import React from "react";
import "./App.css";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Navigation, { sections } from "./components/Navigation";
import CVDAnalysisForm from "./components/CVDAnalysisForm";
import { Routes, Route } from "react-router-dom";
import CompareResults from "./components/CompareResultsPage";
import { Outlet, Link } from "react-router-dom";

function App() {
  const theme = createTheme();


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /><div className="App">
      <Navigation sections={sections} title={"Cardiovascular Disease Data"} />
      <Outlet/>
      {/* <Routes>
      <Route path="/" element={<CVDAnalysisForm/> } />
      <Route path="/compare-results" element={<CompareResults /> } />
    </Routes> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
