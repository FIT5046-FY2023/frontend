import React, { ReactNode } from 'react';
import { Container, Paper } from '@mui/material';

interface OutletWrapperProps {
  children: ReactNode;
}

export const OutletWrapper: React.FC<OutletWrapperProps> = ({ children }) => {
  return (
    <Container component="main" sx={{ pb: 4, br: 32 }}>
      <Paper elevation={0} sx={{ mt: { xs: 4, md: 6 }, p: { xs: 2, md: 3 }, borderRadius: 8 }}>
        {children}
      </Paper>
    </Container>
  );
};
