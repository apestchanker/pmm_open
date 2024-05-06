import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function ReturnButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        navigate(-1);
      }}
      sx={{
        color: 'var(--primaryBlue)',
        /*           position: { md: 'absolute' },
          top: { md: '5px' },
          left: { md: '-30px' }, */
        textTransform: 'none',
      }}
      startIcon={<ArrowBackIosNewIcon />}
    >
      <Typography variant="h6">Return</Typography>
    </Button>
  );
}

export default ReturnButton;
