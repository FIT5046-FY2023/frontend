import {
  Button,
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

export type TableData = Pick<DataResultInfo, "datasetName"|"dateCreated"|"objectId"|"title"|"state">[];
export interface AllResultsTableProps {
  selectedResults: number[];
  setSelectedResults: React.Dispatch<React.SetStateAction<number[]>>;
  tableData: TableData;
}

type TableRowData = { id: number; name: string; dateCreated: string; objectId:string; title:string; state:string;}
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
  const [processingDelete, setProcessingDelete] = useState<boolean>(false);
  const [rows, setRows] = useState<GridRowsProp<TableRowData>>(
    []
  );

  // Set up cache system for already downloaded datasets so don't have to redownload
  //   const tableHeaders = ["Name", "Size", "Action"];
  const tableHeaders = ["Name", "Dataset", "Date Created", "Action"];

  const handlePreview = (index: number) => {
    // setLoadingDataset(true);
  };

  const removeDataset = (indexToRemove: number) => {
    console.log("remove row ");
    const updatedRows = rows.filter(
      (_dataset, idx) => idx !== indexToRemove
    );
    setRows(updatedRows);
    console.log("updatedDatasetResult:\n", updatedRows);

  };

  const handleDeleteDataset = async (e: any, index: number) => {
    console.log("handleDeleteDataset", e, index);
    setProcessingDelete(true);
    console.log(
      "Request body:\n",
      JSON.stringify({
        results: [rows[index].objectId],
      })
    );

    await fetch("http://127.0.0.1:5000/cvd_results", {
      method: "DELETE",
      body: JSON.stringify({
        results: [rows[index].objectId],
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        setProcessingDelete(false);
        console.log(response);
        removeDataset(index);
        return response.json();
      })
      .catch((err) => {
        console.log(err.message);
        setLoadingDataset(false);
        setError(err.message);
      });
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
    const [name, dataset, dateCreated, action, _] = tableHeaders;
    const columns: GridColDef[] = [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 100,
      },
      { field: "title", headerName: name, flex: 0.6 },
      { field: "state", headerName: "State", flex: 0.3  },
      { field: "name", headerName: dataset, flex: 0.5  },
      { field: "dateCreated", headerName: dateCreated, flex: 0.5  },

      {
        field: "action",
        headerName: action,
        flex: 0.5, 
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
        width: 50, flex: 0.3, 
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
          objectId: data.objectId,
          name: data.datasetName,
          dateCreated: data.dateCreated,
          title: data.title,
          state: data.state
        };
      });

    console.log("rows:", rows);

    setRows(rows);
  }, [tableData]);

  return (
    <>      
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
          sx={{ borderRadius: 4, px: 2, pt: 1 }}
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

