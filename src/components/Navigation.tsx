import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link } from "react-router-dom";

export const leftGroup = [
  { title: "Analyse Dataset", url: "/" },
  { title: "Compare Results", url: "compare-results" },
];

export const rightGroup = [{ title: "About", url: "#" },]

interface HeaderProps {
    title: string;
  }
const Navigation = (props: HeaderProps) => {
      
        const { title } = props;
      
        return (
            <Toolbar
              component="nav"
              variant="dense"
              sx={{ justifyContent: 'space-between', overflowX: 'auto', border: 0, elevation: 0, backgroundColor: '#ffffff'}}
            >
              <Stack direction={'row'} spacing={2}>
                {leftGroup.map((section) => (
                  <>
                <Link to={section.url}>
                <Button size="small">{section.title}</Button></Link>
                </>
                ))}
                </Stack>
                <Stack direction={'row'} spacing={2}>
                {rightGroup.map((section) => (
                  <>
                <Link to={section.url}>
                <Button size="small">{section.title}</Button></Link>
                </>
                ))}
                  </Stack>
            </Toolbar>
        );
      
};

export default Navigation;
