import {
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  LinearProgress,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useState } from "react";
import React from "react";
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridNoRowsOverlay,
  GridRowsProp,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataResultInfo } from "../CompareResultsPage";

export type TableData = Pick<DataResultInfo, "datasetName"|"dateCreated">[];
export interface AllResultsTableProps {
  selectedResults: number[];
  setSelectedResults: React.Dispatch<React.SetStateAction<number[]>>;
  tableData: TableData;
}

type TableRowData = { id: number; name: string; dateCreated: string; }
const AllResultsTable = ({
  selectedResults: selectedData,
  setSelectedResults: setSelectedData,
  tableData
}: AllResultsTableProps) => {
  const [loadingDataset, setLoadingDataset] = useState<boolean>(false);
  const [loadingDatasets, setLoadingDatasets] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [selectedDataset, setSelectedDataset] = useState();
  // const [tableRowData, setTableData] = useState<DataResultInfo[]>(tableData);
  // const [processingDelete, setProcessingDelete] = useState<boolean>(false);
  const [rows, setRows] = useState<GridRowsProp<TableRowData>>(
    []
  );

  // Set up cache system for already downloaded datasets so don't have to redownload
  //   const tableHeaders = ["Name", "Size", "Action"];
  const tableHeaders = ["Name", "Date Created", "Action"];

  const handlePreview = (index: number) => {
    // setLoadingDataset(true);
  };

  const removeDataset = (indexToRemove: number) => {
    // console.log("remove row ");
    // const updatedDatasetResult = datasetsResult.filter(
    //   (_dataset, idx) => idx !== indexToRemove
    // );
    // setDatasetsResult(updatedDatasetResult);
    // console.log("updatedDatasetResult:\n", updatedDatasetResult);

  };

  const handleDeleteDataset = async (e: any, index: number) => {
    // console.log("handleDeleteDataset", e, index);
    // setProcessingDelete(true);
    // console.log(
    //   "Request body:\n",
    //   JSON.stringify({
    //     datasetNames: [datasetsResult[index]],
    //   })
    // );

    // await fetch("http://127.0.0.1:5000/db_datasets", {
    //   method: "DELETE",
    //   body: JSON.stringify({
    //     datasetNames: [datasetsResult[index]],
    //   }),
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8",
    //   },
    // })
    //   .then((response) => {
    //     setProcessingDelete(false);
    //     console.log(response);
    //     removeDataset(index);
    //     return response.json();
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //     setLoadingDataset(false);
    //     setError(err.message);
    //   });
  };

  useEffect(() => {
    setLoadingDataset(false);
  }, [selectedDataset, error]);

  useEffect(() => {
    setLoadingDatasets(false);
    console.log("datasets", tableData);
  }, [tableData, error]);

  useEffect(() => {
    setLoadingDatasets(true);
  }, []);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedData(event.target.value);
  //   //console.log("selected value: " + selectedValue)
  // };

  // const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedData(event.target.value);
  //   //console.log("selected value: " + selectedValue)
  // }; 

  const newTableHeaderKeys = () => {
    const [name, dateCreated, action, _] = tableHeaders;
    const columns: GridColDef[] = [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 100,
      },
      { field: "name", headerName: name, width: 350 },
      { field: "dateCreated", headerName: dateCreated, width: 350 },

      {
        field: "action",
        headerName: action,
        width: 150,
        renderCell: (params) => {
          const idx =
            typeof params.id === "string"
              ? parseInt(params.id)
              : (params.id as number);
          return <PreviewBtn index={idx} />;
        },
      },

      {
        field: "delete",
        headerName: "Delete",
        width: 150,
        renderCell: (params) => {
          const idx =
            typeof params.id === "string"
              ? parseInt(params.id)
              : (params.id as number);
          const name = params.row.name;
          console.log("render call name:", name);
          return <DeleteBtn index={idx} />;
        },
      },
    ];
    return columns;
  };

  const PreviewBtn = ({ index }: { index: number }) => {
    return (
      <Button
        variant="outlined"
        onClick={(e) => handlePreview(index)}
        startIcon={<VisibilityIcon />}
      >
        Preview
      </Button>
    );
  };
  const DeleteBtn = ({ index }: { index: number }) => {
    return (
      <IconButton size="small" onClick={(e) => handleDeleteDataset(e, index)}>
        <DeleteIcon />
      </IconButton>
    );
  };

  useEffect(() => {
    console.log("useEffect datasetsResult has changed, updating rows");
    const rows: GridRowsProp<TableRowData> =
      tableData?.map((data, index: number) => {
        console.log(data);
        return {
          id: index,
          name: data.datasetName,
          dateCreated: data.dateCreated
        };
      });

    console.log("rows:", rows);

    setRows(rows);
  }, [tableData]);

  return (
    <>      
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            checkboxSelection
            columns={newTableHeaderKeys()}
            slots={{
              loadingOverlay: LinearProgress,
              noRowsOverlay: GridNoRowsOverlay,
            }}
            loading={false}
            disableRowSelectionOnClick
            rowSelectionModel={selectedData}
            onRowSelectionModelChange={(rowSelectionModel) =>
              {
                console.log("rowSelectionModel");
                console.log(rowSelectionModel);
                console.log(typeof rowSelectionModel);
                let index = rowSelectionModel[0];
                if (index !== undefined){
                  index = typeof index === "string" ? parseInt(index)
                  : (index as number);
                  console.log(rows[index].name);
                  setSelectedData(rowSelectionModel as number[]);
                }
              }
            }
          />
        </div>
    </>
  );
};


export default AllResultsTable;

