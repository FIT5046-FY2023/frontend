import { AppBar, Button, CircularProgress, Container, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { GridRowsProp, GridColDef, GRID_CHECKBOX_SELECTION_COL_DEF, DataGrid, GridNoRowsOverlay } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SelectResultsForComparison({handleComparison}:{handleComparison: React.MouseEventHandler<HTMLButtonElement>}) {
  return (
    <Container component="main" sx={{ mb: 4, br: 32 }}>
      <ExistingDatasetTable
        selectedData={""}
        setSelectedData={function (value: React.SetStateAction<string>): void {
          throw new Error("Function not implemented.");
        }}
      />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      ></AppBar>

    </Container>
  );
}

interface ExistingDatasetTableProps {
  selectedData: React.SetStateAction<string>;
  setSelectedData: React.Dispatch<React.SetStateAction<string>>;
}

const ExistingDatasetTable = ({
  selectedData,
  setSelectedData,
}: ExistingDatasetTableProps) => {
  const [loadingDataset, setLoadingDataset] = useState<boolean>(false);
  const [loadingDatasets, setLoadingDatasets] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [selectedDataset, setSelectedDataset] = useState();
  const [datasetsResult, setDatasetsResult] = useState<string[]>([]);
  const [processingDelete, setProcessingDelete] = useState<boolean>(false);
  const [rows, setRows] = useState<GridRowsProp<{ id: number; name: string }>>(
    []
  );

  // Set up cache system for already downloaded datasets so don't have to redownload
  //   const tableHeaders = ["Name", "Size", "Action"];
  const tableHeaders = ["Name", "Action", ""];

  const handlePreview = (index: number) => {
    setLoadingDataset(true);
    handleFetchDataset(index);
  };

  const removeDataset = (indexToRemove: number) => {
    console.log("remove row ");
    const updatedDatasetResult = datasetsResult.filter(
      (_dataset, idx) => idx !== indexToRemove
    );
    setDatasetsResult(updatedDatasetResult);
    console.log("updatedDatasetResult:\n", updatedDatasetResult);
    // const updatedRows = [
    //   ...rows.slice(0, indexToRemove),
    //   ...rows.slice(indexToRemove + 1),
    // ];
    // setRows(updatedRows);

    // console.log("idx and updateRows", indexToRemove, updatedRows);
  };

  const handleDeleteDataset = async (e: any, index: number) => {
    console.log("handleDeleteDataset", e, index);
    setProcessingDelete(true);
    console.log(
      "Request body:\n",
      JSON.stringify({
        datasetNames: [datasetsResult[index]],
      })
    );

    await fetch("http://127.0.0.1:5000/db_datasets", {
      method: "DELETE",
      body: JSON.stringify({
        datasetNames: [datasetsResult[index]],
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

  const handleFetchDataset = async (index: number) => {
    fetch("http://127.0.0.1:5000/db_datasets", {
      method: "POST",
      body: JSON.stringify({
        datasetName: datasetsResult[index],
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.status !== 200) setLoadingDataset(false);
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log("data", data.document);
        setSelectedDataset(data.document);
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
    console.log("datasets", datasetsResult);
  }, [datasetsResult, error]);

  useEffect(() => {
    setLoadingDatasets(true);
    fetchDatasets({
      setDatasetResult: setDatasetsResult,
      setError,
      processingDeleteDataset: processingDelete,
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedData(event.target.value);
    //console.log("selected value: " + selectedValue)
  };

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedData(event.target.value);
    //console.log("selected value: " + selectedValue)
  };

  const headerKeys = () =>
    selectedDataset ? Object.keys(selectedDataset) : [];
  console.log(headerKeys);

  const newTableHeaderKeys = () => {
    const [name, action, _] = tableHeaders;
    const columns: GridColDef[] = [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 100,
      },
      { field: "name", headerName: name, width: 350 },

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
    const rows: GridRowsProp<{ id: number; name: string }> =
      datasetsResult?.map((datasetName: string, index: number) => {
        console.log(datasetName);
        return {
          id: index,
          name: datasetName,
        };
      });

    console.log("rows:", rows);

    setRows(rows);
  }, [datasetsResult]);

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
          loading={loadingDatasets}
          disableRowSelectionOnClick
          onRowSelectionModelChange={(rowSelectionModel) => {
            console.log("rowSelectionModel");
            console.log(rowSelectionModel);
            let index = rowSelectionModel[0];
            if (index !== undefined) {
              index =
                typeof index === "string" ? parseInt(index) : (index as number);
              console.log(rows[index].name);
              setSelectedData(rows[index].name);
            }
          }}
        />
      </div>

      <br />
      {loadingDataset && <CircularProgress />}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {!!selectedDataset &&
                  headerKeys().map((header) => (
                    <TableCell
                      key={header}
                      align="center"
                      style={{ minWidth: 170 }}
                    >
                      {header}
                    </TableCell>
                  ))}
                {!selectedDataset && (
                  <TableCell key={"key"} align="center">
                    <Typography> No data to preview </Typography>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {!!selectedDataset && (
                <TableRow key={".id"}>
                  {Object.entries(selectedDataset).map(([key, val]) => {
                    console.log(key, val);
                    return (
                      <TableCell key={key} align="center">
                        {`${val}`}
                      </TableCell>
                    );
                  })}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

interface FetchDatasetsProps {
  setDatasetResult: React.Dispatch<React.SetStateAction<string[]>>;
  setError: React.Dispatch<React.SetStateAction<any>>;
  processingDeleteDataset: boolean;
}
const fetchDatasets = async ({
  setDatasetResult,
  setError,
  processingDeleteDataset,
}: FetchDatasetsProps) => {
  console.log("fetching datasets");
  if (!processingDeleteDataset) {
    fetch("http://127.0.0.1:5000/db_datasets")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setDatasetResult(data.datasets);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      });
  }
};