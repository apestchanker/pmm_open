import { useQuery } from '@apollo/client';
import { LinearProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import { GET_FUND_DATES } from '../../Queries/PMM2/mentoringQueries';

const FundClock = ({ fundnumber }) => {
  const { data: fundDates, loading } = useQuery(GET_FUND_DATES);
  const funds = fundDates?.Fund;
  const currentDate = new Date();
  const fund = funds?.find((fund) => fund.fundnumber === fundnumber);
  const dateEnd = fund?.dateEnd.formatted || new Date(currentDate.setDate(currentDate.getDate() + 5)).toISOString();

  const [dateValues, setDateValues] = useState({
    d: Math.floor((new Date(dateEnd) - currentDate) / 1000 / 60 / 60 / 24),
    h: Math.floor((new Date(dateEnd) - currentDate) / 1000 / 60 / 60) % 24,
    m: Math.floor((new Date(dateEnd) - currentDate) / 1000 / 60) % 24,
    s: Math.floor((new Date(dateEnd) - currentDate) / 1000) % 24,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const diff = new Date(dateEnd) - currentTime;

      if (!loading) {
        setDateValues({
          ['d']: Math.floor(diff / 1000 / 60 / 60 / 24),
          ['h']: Math.floor(diff / 1000 / 60 / 60) % 24,
          ['m']: Math.floor(diff / 1000 / 60) % 24,
          ['s']: Math.floor(diff / 1000) % 24,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dateEnd, loading]);

  // AGREGAR LA FASE ACTUAL COMO VARIABLE Y NO FIJA!!!!

  return (
    <Box width={'297px'}>
      <Typography fontFamily={'Roboto'} fontSize={'16px'} lineHeight={'18.75px'} fontWeight={400}>
        Time left in fund {fundnumber}
      </Typography>
      <Box
        mb={'16px'}
        bgcolor={'#E495424D'}
        width={'100%'}
        height={'59px'}
        display={'flex'}
        justifyContent={'space-between'}
        borderRadius={'10px'}
        padding={'8px 18px'}
      >
        <Box>
          <Typography fontFamily={'Roboto'} fontWeight={400} fontSize={'24px'} lineHeight={'28.13px'} textAlign={'center'}>
            {dateValues.d}
          </Typography>
          <Typography fontFamily={'Roboto'} fontWeight={400} fontSize={'14px'} lineHeight={'16.41px'} textAlign={'center'}>
            days
          </Typography>
        </Box>
        <Box>
          <Typography fontFamily={'Roboto'} fontWeight={400} fontSize={'24px'} lineHeight={'28.13px'} textAlign={'center'}>
            {dateValues.h}
          </Typography>
          <Typography fontFamily={'Roboto'} fontWeight={400} fontSize={'14px'} lineHeight={'16.41px'} textAlign={'center'}>
            hours
          </Typography>
        </Box>
        <Box>
          <Typography fontFamily={'Roboto'} fontWeight={400} fontSize={'24px'} lineHeight={'28.13px'} textAlign={'center'}>
            {dateValues.m}
          </Typography>
          <Typography fontFamily={'Roboto'} fontWeight={400} fontSize={'14px'} lineHeight={'16.41px'} textAlign={'center'}>
            minutes
          </Typography>
        </Box>
      </Box>
      <LinearProgress variant="determinate" value={50} sx={{ borderRadius: '5px', height: '10px' }} color={'secondary'} />
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography fontFamily={'Roboto'} fontSize={'14px'} lineHeight={'16.41px'} fontWeight={400}>
          Ideation
        </Typography>
        <Typography fontFamily={'Roboto'} fontSize={'14px'} lineHeight={'16.41px'} fontWeight={400}>
          20 D 20 H 25 M
        </Typography>
      </Box>
    </Box>
  );
};

export default FundClock;
