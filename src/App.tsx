import React, { useEffect, useState } from "react";
import "./App.css";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Navigation, { sections } from "./components/Navigation";
import CVDAnalysisForm from "./components/CVDAnalysisForm";

function App() {
  const [dataResponse, setDataResponse] = useState<Object[]>([]);
  const [csvData, setCsvData] = useState();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [csv, setCsv] = useState("");
  const [cvd, setCvd] = useState("");


  const getCvd = async () => {
    // fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
    fetch("http://127.0.0.1:5000/cvddata")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCvd(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    // fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
    fetch("http://127.0.0.1:5000/cvddata")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCsvData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  
  
   const addPosts = async (title: string, csv: string) => {
    await fetch("http://127.0.0.1:5000/cvddata", {
      method: "POST",
      body: JSON.stringify({ csv: csv
   
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDataResponse((posts) => [data, ...posts]);
        setTitle("");
        setBody("");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const getCsv = async () => {
    await fetch("/cvddata", {
      method: "GET",
      body: JSON.stringify({}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCsv(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  

  const handleSubmit = (e: any) => {
    e.preventDefault();
    addPosts(title, body);
  };
  const handleCsvSubmit = (e: any) => {
    e.preventDefault();
    getCsv();
  };
  const theme = createTheme();


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation sections={sections} title={"Cardiovascular Disease Data"} />

      <CVDAnalysisForm/> 

      <div className="App">
    {/* TO DELETE */}
        {/* <div></div>
        <div className="add-post-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              name=""
              className="form-control"
              id=""
              cols={10}
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
            <button type="submit">Add Post</button>
          </form>
        </div>
        <div className="add-csv-container">
          <form onSubmit={handleCsvSubmit}>
          <p>{csv}</p>
            <button type="submit">Get Csv</button>
          </form>
        </div>
        <div className="add-cvd-container">
          <form onSubmit={getCvd}>
            <button type="submit">Get Cvd</button>
          </form>
          <p>{csv}</p>
        </div> */}
      </div>
    </ThemeProvider>
  );
}

export default App;
