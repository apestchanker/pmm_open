import { Box, InputAdornment, OutlinedInput, Slider, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
// import { useTheme } from '@mui/material/styles';

const BudgedEstimator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints['down']('md'));
  // const isXs = useMediaQuery(theme.breakpoints['only']('xs'));
  // const isMd = useMediaQuery(theme.breakpoints['only']('md'));

  const marks = [
    {
      value: 0,
      label: '$0',
    },
    {
      value: 16000000,
      label: '$16M',
    },
  ];
  const [moneyValue, setMoneyValue] = useState<number | string | Array<number | string>>(0);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setMoneyValue(newValue);
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMoneyValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (moneyValue < 0) {
      setMoneyValue(0);
    } else if (moneyValue > 16000000) {
      setMoneyValue(16000000);
    }
  };

  return (
    <Box>
      <Typography mb={'80px'} fontFamily="Roboto" fontSize={'16px'} fontWeight={700} lineHeight={'18.75px'}>
        Budget estimator
      </Typography>
      <Box display={'flex'} alignItems="center" flexWrap={'wrap'}>
        <Box sx={{ width: '300px' }}>
          <Slider
            name="money-slider"
            defaultValue={0}
            value={typeof moneyValue === 'number' ? moneyValue : 0}
            onChange={handleSliderChange}
            // getAriaValueText={valuetext}
            step={1}
            valueLabelDisplay="auto"
            marks={marks}
            min={0}
            max={16000000}
            sx={{
              margin: 0,
              pb: '20px',
            }}
          />
        </Box>
        <OutlinedInput
          sx={{
            marginLeft: isMobile ? 'none' : '59px',
            marginTop: !isMobile ? 'none' : '20px',
            fontFamily: 'Roboto',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '18.75px',
          }}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          value={moneyValue}
          type="number"
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: 1,
            min: 0,
            max: 16000000,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
        ></OutlinedInput>
      </Box>
    </Box>
  );
};

export default BudgedEstimator;
