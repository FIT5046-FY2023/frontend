import { Container, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);
    return (
        <Container>
            <Typography variant="h1" >
                Page does not exist
            </Typography>

            <Typography variant="body1" >
                {error as any}
                {/* {error?.statusText || error.message} */}
            </Typography>
        </Container>

    )
}