import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
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

  useEffect(() => {
    // fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
    fetch("http://127.0.0.1:5000/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCsvData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  const addPosts = async (title: string, body: string) => {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title: title,
        body: body,
        userId: Math.random().toString(36).slice(2),
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
    await fetch("http://127.0.0.1:5000/cvddata", {
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
      <CVDAnalysisForm />
      <div className="App">
        <>{JSON.stringify(csvData)}</>
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
            <p>{JSON.stringify(csv)}</p>
            <button type="submit">Get Csv</button>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
