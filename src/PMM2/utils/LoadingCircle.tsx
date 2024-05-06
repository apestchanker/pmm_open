import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingCircleI {
  size?: number;
  height?: string;
}

const LoadingCircle = ({ size = 100, height = '75vh' }: LoadingCircleI) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
      }}
    >
      <CircularProgress sx={{ color: '#000' }} size={size} />
    </Box>
  );
};

export default LoadingCircle;
