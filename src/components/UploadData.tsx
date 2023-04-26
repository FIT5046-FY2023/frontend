import Container from "@mui/material/Container";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import Paginate from "react-paginate";

// from https://refine.dev/blog/how-to-import-csv/ - TODO: convert any types to proper types
const UploadData = () => {
    const [file, setFile] = useState();
  const [array, setArray] = useState([]);

  const fileReader = new FileReader();

  const handleOnChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  
  const csvFileToArray = (string: any) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array = csvRows.map((i: any) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object: any, header: any, index: any) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();

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
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <h1>REACTJS CSV IMPORT EXAMPLE </h1>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>

      <br />

      <table>
        <thead>
          <tr key={"header"}>
            {headerKeys.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {array.map((item: any) => (
            <tr key={item.id}>
              {Object.values(item).map((val: any) => (
                <td>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </Container>
    </div>
  );
};

const UploadData2 = (props: any) => {
    const [files, setFiles] = useState<File[]>([]);
  
    // Use this ref to access files in a callback. Otherewise files may not be up to date.
    const filesRef = useRef<File[]>();
    filesRef.current = files;
    const { fileLimit, formId, btnLabel, handleJob, maxFileSize } = props;
  
   // Pagination variables
   const [pageNumber, setPageNumber] = useState(0);
   const FILES_PER_PAGE = 24;
   const pageCount = Math.ceil(files.length / FILES_PER_PAGE); //determines how many pages from each pagination.

   const displayFilePreviews = files
    .map((file, i) => (
          <div className="preview-column" key={file.name}>
            <p className="file-name">{file.name}</p>
            <button className="cross-button"  >
              X
            </button>
          </div>
        ));

    const changePage = ({ selected }: { selected: number}) => {
        setPageNumber(selected);
      };
   
    return (
      <div>
        <UploadBox
            setFiles={setFiles}
            fileLimit={fileLimit}
            currFiles={files}
            maxFileSize={maxFileSize}
          />
          <input
            className="upload-btn"
            type="submit"
            value={btnLabel}
          />
        <div style={containerStyle}>
          <div className="pagination-section">
            {files.length > 20 && (
              <div className="pagination-margin">
                <Paginate
                  previousLabel={"<"}
                  nextLabel={">"}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName={"pagination-bttns"}
                  activeClassName={"pagination-active"}
                />
              </div>
            )}
            <div className="margin-space">{displayFilePreviews}</div>
          </div>
        </div>
      </div>
    );
  };
  
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    background: "white",
  };
  
  const formStyle = {
    margin: "1rem 1rem",
    width: "clamp(5rem, 30rem, 50rem)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };
  
  UploadData.defaultProps = {
    formId: "upload",
    btnLabel: "Submit Files",
  };

export default UploadData;




export const UploadBox = (props: any) => {
  const onDrop: DropzoneOptions["onDrop"] = (files) => {
    if (files.length) {
      // Restricts files displayed to fileLimit only
      if (files.length + currFiles.length > fileLimit) {
        const updatedFiles = files.slice(0, fileLimit - currFiles.length);
        setAlert(MAX_FILE_ALERT); //bug: shows up but I don't know why it disappears later
        props.setFiles((existingFiles: File[]) => [...existingFiles, ...updatedFiles]);
      } else {
        props.setFiles((existingFiles: File[]) => [...existingFiles, ...files]);
      }
    }
  };

  const { setAlert, fileLimit, currFiles, maxFileSize } = props;
  const MAX_FILE_ALERT = `Please upload only up to ${props.fileLimit} valid files.`;
  const INVALID_FILETYPE = `The following file(s) are not of acceptable formats (jpeg, png, mp4):`;


  const acceptedFileTypes = {"image/*": ["image/jpeg", "image/png"],
"text/*": [".csv", "text/plain"]};
  const maxFiles = fileLimit ? fileLimit : 0; // 0 unlimited files
  const maxSize = maxFileSize ? maxFileSize * 1000 * 1000 : Infinity; // 0 is unlimited file size, in bin bytes
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles,
    maxSize
  });

  return (
    <div className="box" {...getRootProps()}>
      <h3>Upload Files</h3>
      <input {...getInputProps()} />

      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <>
          <p>
            Drag 'n' drop images &amp; videos here, or <b>click</b> to select files
            <br></br>
            {maxFiles != 0 ? <em> (Maximum number of files: {maxFiles}) </em> : null}
          </p>
          <sub className="accepted-file-formats-text">
            {maxFileSize && `Max file size: ${maxFileSize} MB |`} Accepted file formats:{" "}
          </sub>
        </>
      )}
    </div>
  );
};