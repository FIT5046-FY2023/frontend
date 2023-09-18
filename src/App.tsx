import React from "react";
import "./App.css";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Navigation from "./components/Navigation";
import CVDAnalysisForm from "./components/CVDAnalysisForm";
import { Routes, Route } from "react-router-dom";
import CompareResults from "./components/CompareResultsPage";
import { Outlet, Link } from "react-router-dom";
import { OutletWrapper } from "./components/OutletWrapper";

function App() {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Navigation title={"Cardiovascular Disease Data"} />
        <OutletWrapper>
          <Outlet />
        </OutletWrapper>
        {/* <Routes>
      <Route path="/" element={<CVDAnalysisForm/> } />
      <Route path="/compare-results" element={<CompareResults /> } />
    </Routes> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
