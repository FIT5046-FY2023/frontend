import {
  Button,
  Card,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Container from "@mui/material/Container";
import React, { useState } from "react";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Upload } from "@mui/icons-material";

// from https://refine.dev/blog/how-to-import-csv/ 
const UploadData = (props: {
  curFiles: File[];
  setCurFiles: React.Dispatch<any[]>;
  handleUpload: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  const [array, setArray] = useState<any[]>([]); // for csv preview
  const { curFiles, setCurFiles, handleUpload } = props;
  const fileReader = new FileReader();

  const handleOnChangeCurFiles = (e: any) => {
    const fileList: FileList = e.target.files;
    let files: File[] = [];
    for (let index = 0; index < fileList.length; index++) {
      files.push(fileList[index]);
    }
    setCurFiles([...curFiles, ...files]);
  };

  const csvFileToArray = (string: string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((row: string) => {
      const values = row.split(",");
      const obj = csvHeader.reduce((object: any, header: any, index: any) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  const handlePreview = (index: number) => {
    const file = curFiles[index];
    if (file) {
      fileReader.onload = function (event: any) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <div style={{ textAlign: "center" }}>
      <Container component="main" sx={{ mb: 4 }}>
        <form>
          <OutlinedInput
            size="small"
            type="file"
            id="csv-file-input"
            onChange={handleOnChangeCurFiles}
            inputProps={{ accept: [".csv", "image/*"], multiple: "true" }}
          ></OutlinedInput>
          <Button
           variant="outlined"
           disabled={false}
           onClick={handleUpload}
           startIcon={<Upload />}
           sx={{ mx: 2}}
           > Upload </Button>
        </form>
        <Card elevation={0} sx={{ borderRadius: 2, my: 4 }} variant="outlined">
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {["Name", "Size", "Last Modified", 'Action'].map((key) => (
                    <TableCell
                      key={key}
                      align="center"
                      style={{ minWidth: 170 }}
                    >
                      {key}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {curFiles.length > 0 &&
                  curFiles.map((file: File, index: number) => (
                    <TableRow key={index}>
                      <TableCell key={"name"} align="center">
                        {file.name}
                      </TableCell>
                      <TableCell key={"size"} align="center">
                        {file.size}
                      </TableCell>
                      <TableCell key={"lastModified"} align="center">
                        {file.lastModified}
                      </TableCell>
                      <TableCell key={"preview"} align="center">
                        <Button
                          variant="outlined"
                          onClick={(e) => handlePreview(index)}
                          startIcon={<VisibilityIcon />}
                        >
                          Preview
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <br />
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {headerKeys.map((key) => (
                    <TableCell
                      key={key}
                      align="center"
                      style={{ minWidth: 170 }}
                    >
                      {key}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {array.map((item: any) => (
                  <TableRow key={item.id}>
                    {Object.values(item).map((val: any) => (
                      <TableCell key={item.code} align="center">
                        {val}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
};

export default UploadData;

// function CsvUploader() {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedFile(event.target.files?.[0] || null);
  // };

  // const handleUpload = () => {
  //   if (selectedFile) {
  //     const formData = new FormData();
  //     formData.append('file', selectedFile);
    
  //     axios.post('http://127.0.0.1:5000/upload', formData)
  //       .then((response) => {
  //         console.log(response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //     }
  // };
//   return (
//     <div>
//       <input type="file" onChange={handleFileSelect} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// }

// export default CsvUploader;
