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
        <Box sx={{ mt: '1rem', display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={handleComparison}>
            {" "}
            Compare Results{" "}
          </Button>
        </Box>
      </Container>
    </>
  );
}
