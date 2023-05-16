import {
  Button,
  Input,
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
import VisibilityIcon from '@mui/icons-material/Visibility';

// from https://refine.dev/blog/how-to-import-csv/ - TODO: convert any types to proper types
const UploadData = (props: {curFiles: File[], setCurFiles: React.Dispatch<any[]>}) => {
  const [array, setArray] = useState<any[]>([]);
  const {curFiles, setCurFiles} = props;
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
        // setCurFiles([...curFiles, file]);
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  }

  const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <div style={{ textAlign: "center" }}>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <form>
          <Input
            type="file"
            id="csv-file-input"
            onChange={handleOnChangeCurFiles}
            inputProps={{ accept: ".csv", multiple: "true" }}
            
          ></Input>
        </form>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {["Name", "Size", "Last Modified"].map((key) => (
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
                    <TableRow key={index} >
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
                       
                        <Button variant="outlined" onClick={(e) => handlePreview(index)} startIcon={<VisibilityIcon />}
                        defaultValue={index}>
  Preview
</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

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
