import {
  Box,
  Button,
  Card,
  OutlinedInput,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Upload } from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';
import ExistingDatasetTable from "./ExistingDatasetTable";


function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
// from https://refine.dev/blog/how-to-import-csv/ 
const UploadData = (props: {
  curFiles: File[];
  setCurFiles: React.Dispatch<any[]>;
  handleUpload: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loading: boolean;
}) => {
  const [array, setArray] = useState<any[]>([]); // for csv preview
  const { curFiles, setCurFiles, handleUpload, loading } = props;
  const fileReader = new FileReader();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


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
          <LoadingButton
           onClick={handleUpload}
           startIcon={<Upload />}
           sx={{ mx: 2}}
           loading={loading}
           loadingPosition="start"
           variant="outlined"
           > Upload </LoadingButton>
        </form>
        <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Files to upload" {...a11yProps(0)} />
            <Tab label="Existing datasets" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        
        <ExistingDatasetTable></ExistingDatasetTable>
      </TabPanel>
      </Box>
       
      </Container>
    </div>
  );
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
export default UploadData;