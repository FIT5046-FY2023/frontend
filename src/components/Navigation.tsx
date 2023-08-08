import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link } from "react-router-dom";

export const sections = [
  { title: "Analyse Dataset", url: "/" },
  { title: "Compare Results", url: "compare-results" },
  { title: "About", url: "#" },
];

interface HeaderProps {
    sections: ReadonlyArray<{
      title: string;
      url: string;
    }>;
    title: string;
  }
const Navigation = (props: HeaderProps) => {
      
        const { sections, title } = props;
      
        return (
          <React.Fragment>
            <Toolbar
              component="nav"
              variant="dense"
              sx={{ justifyContent: 'space-between', overflowX: 'auto',  borderBottom: 1, borderColor: 'divider' }}
            >
                {sections.map((section) => (
                <>
                <Link to={section.url}>
                <Button size="small">{section.title}</Button></Link>
                </>
                ))}
            </Toolbar>
        
          </React.Fragment>
        );
      
};

export default Navigation;
