import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

export const sections = [
  { title: "Home", url: "#" },
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
                <Button size="small">{section.title}</Button>
                </>
                ))}
            </Toolbar>
        
          </React.Fragment>
        );
      
};

export default Navigation;
