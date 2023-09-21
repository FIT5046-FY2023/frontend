import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Button,
  Stack,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { CircularProgress } from "@mui/material";
import React from "react";

export interface DataWranglingProps {
  setImputationValue: React.Dispatch<React.SetStateAction<string>>;
  imputation: React.SetStateAction<string>;
  setOutlierValue: React.Dispatch<React.SetStateAction<string>>;
  outlier: React.SetStateAction<string>;
  dataWranglingOptions: any[];
  setDataWranglingCheckbox: React.Dispatch<
    React.SetStateAction<GridRowSelectionModel>
  >;
  setDataWranglingOptions: React.Dispatch<React.SetStateAction<any[]>>;
  dataWranglingCheckbox: any[];
  loading: boolean;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "id", width: 100 },
  { field: "feature", headerName: "Feature", width: 250 },
  //{ field: 'correlation', headerName: 'Correlation', type: 'number', width: 160 },
  { field: "minimum", headerName: "Minimum", type: "number", width: 160 },
  { field: "maximum", headerName: "Maximum", type: "number", width: 160 },
  { field: "mean", headerName: "Mean", type: "number", width: 160 },
];

const DataWrangling = (props: DataWranglingProps) => {
  const {
    setImputationValue,
    imputation,
    setOutlierValue,
    outlier,
    dataWranglingOptions,
    setDataWranglingCheckbox,
    dataWranglingCheckbox,
    setDataWranglingOptions,
    loading,
  } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImputationValue((event.target as HTMLInputElement).value);
  };

  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setDataWranglingCheckbox(newSelection);
  };

  const handleOutliers = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutlierValue((event.target as HTMLInputElement).value);
  };

  const handleApplyButton = async () => {
    let dataWranglingBody = JSON.stringify({
      imputation: imputation,
      outliermethod: outlier,
      checkboxes: dataWranglingCheckbox,
    });

    console.log(dataWranglingBody);

    fetch("http://127.0.0.1:5000/applydatawrangling", {
      method: "POST",
      body: dataWranglingBody,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        //setLoading(false);
        return response.json();
      })
      .then((data) => {
        var rows = [];

        for (var i = 0; i < data.headerLabels.length; i++) {
          var featureObject = {
            id: i,
            feature: data.headerLabels[i],
            //correlation: data.corrList[i],
            minimum: data.minList[i],
            maximum: data.maxList[i],
            mean: data.meanList[i],
          };

          rows.push(featureObject);
        }

        setDataWranglingOptions(rows);
      })
      .catch((err) => {
        //setLoading(false);
        console.log(err.message);
      });
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <h2> Data Wrangling </h2>

          <div style={{ height: 500, width: "100%", padding: 4 }}>
            <DataGrid
              sx={{ borderRadius: 4, m: 4, px: 2, pt: 1 }}
              rows={dataWranglingOptions}
              columns={columns}
              checkboxSelection
              onRowSelectionModelChange={handleSelectionChange}
            />
          </div>

          <Stack
            sx={{ mt: 6 }}
            display={"flex"}
            alignItems={"center"}
            spacing={2}
          >
            <FormControl>
              <FormLabel>Imputation</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={imputation}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="mean"
                  control={<Radio />}
                  label="Mean"
                />
                <FormControlLabel
                  value="mode"
                  control={<Radio />}
                  label="Mode"
                />
                <FormControlLabel
                  value="median"
                  control={<Radio />}
                  label="Median"
                />

              <FormControlLabel value="none" control={<Radio />} label="None" />
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Handling Outliers</FormLabel>
              <RadioGroup
                row
                aria-labelledby="preprocessing-methods"
                name="preprocessing-methods"
                value={outlier}
                onChange={handleOutliers}
              >
                <FormControlLabel
                  value="z-method"
                  control={<Radio />}
                  label="Z-method"
                />
                <FormControlLabel value="iqr" control={<Radio />} label="IQR" />
                <FormControlLabel value="none" control={<Radio />} label="None" />
              </RadioGroup>
            </FormControl>

            <Button variant="outlined" onClick={handleApplyButton}>
              Apply
            </Button>
          </Stack>
        </div>
      )}
    </>
  );
};
export default DataWrangling;
