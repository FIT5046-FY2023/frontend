import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [dataResponse, setDataResponse] = useState<Object[]>([]);
  const [csvData, setCsvData] = useState();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [csv, setCsv] = useState("");
  
  useEffect(() => {
    // fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
    fetch('http://127.0.0.1:5000/users')
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
 const addCsv = async () => {
  await fetch("http://127.0.0.1:5000/users", {
    method: "POST",
    body: JSON.stringify({
      csv: "csv-string"
    }),
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
  addCsv();
};

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <>
      {JSON.stringify(csvData)}
      </>
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
          <p>
            {JSON.stringify(csv)}
          </p>
          <button type="submit">Add Csv</button>
        </form>
      </div>
    </div>
  );
}

export default App;
