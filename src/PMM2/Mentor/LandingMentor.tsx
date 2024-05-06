import { Box, Grid, Paper, Typography } from '@mui/material';
import mediaCheck from 'PMM2/utils/mediaCheck';
import React from 'react';

const LandingMentor = () => {
  const activities = [
    {
      id: '1',
      title: 'VoW’s Mentoring Path',
      notification: true,
      message: 'New comments available',
      date: '20/10/2022',
      time: '20:11 hs',
    },
    {
      id: '2',
      title: 'VoW’s Mentoring Path',
      notification: false,
      message: 'New comments available',
      date: '20/10/2022',
      time: '20:11 hs',
    },
    {
      id: '3',
      title: 'VoW’s Mentoring Path',
      notification: true,
      message: 'New comments available',
      date: '20/10/2022',
      time: '20:11 hs',
    },
    {
      id: '4',
      title: 'VoW’s Mentoring Path',
      notification: true,
      message: 'New comments available',
      date: '20/10/2022',
      time: '20:11 hs',
    },
    {
      id: '6',
      title: 'VoW’s Mentoring Path',
      notification: false,
      message: 'New comments available',
      date: '20/10/2022',
      time: '20:11 hs',
    },
  ];
  const Badge = () => {
    return <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#FF5C00', ml: '3px' }} />;
  };
  return (
    <Box
      sx={{
        padding: '58px 36px',
      }}
    >
      <Box className="title" mb={'64px'}>
        <Typography
          component={'h1'}
          fontFamily="Roboto"
          fontWeight={800}
          fontSize={mediaCheck('xs', 'only') ? '22px' : '36px'}
          lineHeight={'42.19px'}
          color={'#263560'}
        >
          PROPOSAL MENTOR MARKETPLACE
        </Typography>
        <Typography
          component={'h2'}
          fontFamily="Roboto"
          fontWeight={800}
          fontSize={mediaCheck('xs', 'only') ? '22px' : '36px'}
          lineHeight={'42.19px'}
          color={'#263560'}
        >
          THE PLATFORM WHERE MENTORING CAN HAPPEN
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={4}
            sx={{
              padding: '35px 23px',
              borderRadius: '20px',
              minHeight: !mediaCheck('md', 'down') ? '468px' : 'auto',
            }}
          >
            <Typography
              component={'h3'}
              fontFamily="Roboto"
              fontWeight={700}
              fontSize={'20px'}
              lineHeight={'42.19px'}
              color={'#263560'}
              mb={'31px'}
            >
              Latest Activity
            </Typography>

            {activities.map((activity) => {
              return (
                <Grid container key={activity.id} spacing={0.7} mb={'8px'}>
                  <Grid item display={'flex'} alignItems={'center'}>
                    <Typography fontFamily={'Roboto'} fontWeight={700} fontSize={'16px'} lineHeight={'18.75px'}>
                      {activity.title}
                    </Typography>
                    {activity.notification && <Badge />}
                  </Grid>
                  <Grid item>
                    <Typography fontFamily={'Roboto'} fontWeight={400} fontSize={'16px'} lineHeight={'18.75px'}>
                      {activity.message}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography fontFamily={'Roboto'} fontWeight={400} fontSize={'16px'} lineHeight={'18.75px'}>
                      {activity.date}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography fontFamily={'Roboto'} fontWeight={400} fontSize={'16px'} lineHeight={'18.75px'}>
                      {activity.time}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              padding: '35px 23px',
              borderRadius: '20px',
              mb: '12px',
            }}
          >
            <Typography
              component={'h3'}
              fontFamily="Roboto"
              fontWeight={700}
              fontSize={'20px'}
              lineHeight={'42.19px'}
              color={'#263560'}
              mb={'15px'}
              textAlign={'center'}
            >
              Next IdeaScale deadline
            </Typography>
            <Typography
              component={'h3'}
              fontFamily="Roboto"
              fontWeight={400}
              fontSize={'20px'}
              lineHeight={'42.19px'}
              color={'#263560'}
              mb={'8px'}
              textAlign={'center'}
            >
              Phase 1: 20/12/2022
            </Typography>
            <Typography
              component={'h3'}
              fontFamily="Roboto"
              fontWeight={400}
              fontSize={'20px'}
              lineHeight={'42.19px'}
              color={'#263560'}
              mb={'8px'}
              textAlign={'center'}
            >
              Phase 1: 20/12/2022
            </Typography>
          </Paper>
          <Paper
            elevation={4}
            sx={{
              padding: '35px 23px',
              borderRadius: '20px',
            }}
          >
            <Typography
              component={'h3'}
              fontFamily="Roboto"
              fontWeight={700}
              fontSize={'20px'}
              lineHeight={'42.19px'}
              color={'#263560'}
              mb={'15px'}
              textAlign={'center'}
            >
              Cardano’s following events
            </Typography>
            <Typography
              component={'h3'}
              fontFamily="Roboto"
              fontWeight={400}
              fontSize={'20px'}
              lineHeight={'42.19px'}
              color={'#263560'}
              mb={'8px'}
              textAlign={'center'}
            >
              Phase 1: 20/12/2022
            </Typography>
            <Typography
              component={'h3'}
              fontFamily="Roboto"
              fontWeight={400}
              fontSize={'20px'}
              lineHeight={'42.19px'}
              color={'#263560'}
              mb={'8px'}
              textAlign={'center'}
            >
              Phase 1: 20/12/2022
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LandingMentor;
