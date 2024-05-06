import { Button } from '@mui/material';
import React from 'react';

export const CustomBtn = ({ children, cb }: any) => {
  return (
    <Button
      onClick={cb}
      variant="contained"
      sx={{
        backgroundColor: 'var(--primaryBlue)',
        textTransform: 'none',
        color: 'white',
        fontSize: '1rem',
        minWidth: '100px',
        margin: '0 10px',
        '&:hover': {
          backgroundColor: 'var(--primaryBlueHover)',
        },
      }}
    >
      {children}
    </Button>
  );
};
