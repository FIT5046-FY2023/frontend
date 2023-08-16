import {
  AppBar,
  Box,
  Button,
  Container,
} from "@mui/material";
import AllResultsTable, {
  AllResultsTableProps
} from "./AllResultsTable";

type SelectResultsForComparisonProps = {
  handleComparison: React.MouseEventHandler<HTMLButtonElement>;
} & AllResultsTableProps;

export default function SelectResultsForComparison({
  handleComparison,
  tableData,
  selectedResults,
  setSelectedResults,
}: SelectResultsForComparisonProps) {
  return (
    <>
      <Container component="main" sx={{ mb: 4, br: 32 }}>
        {/* {tableData && JSON.stringify(tableData)} */}
        <AllResultsTable
          selectedResults={selectedResults}
          setSelectedResults={setSelectedResults}
          tableData={tableData}
        />

        <AppBar
          position="absolute"
          color="default"
          elevation={0}
          sx={{
            position: "relative",
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            marginBottom: "1rem",
          }}
        ></AppBar>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleComparison}>
            {" "}
            Compare Results{" "}
          </Button>
        </Box>
      </Container>
    </>
  );
}
