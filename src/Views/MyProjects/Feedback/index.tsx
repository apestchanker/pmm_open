import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Rating, Typography, useMediaQuery } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FeedbackCard from 'Components/FeedbackCard';
import FeedbackRanking from 'Components/FeedbackRanking';
import { GET_USER_ID } from 'Queries';
import { gql, useQuery } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { createTheme } from '@mui/system';

const GET_AVG_SCORE = gql`
  query getAvgScore($username: String!) {
    User(username: $username) {
      avgScore
    }
  }
`;

const GET_USER_RATINGS = gql`
  query getRatings($username: String!) {
    User(username: $username) {
      rating {
        score
        sentBy
        sentOn {
          formatted
        }
        feedback
        id
      }
    }
  }
`;
const GET_RECEIVED_RATINGS = gql`
  query getUsersRated($username: String!) {
    User(username: $username) {
      hasRatedUsers {
        score
        sentBy
        sentTo
        sentOn {
          formatted
        }
        feedback
        id
      }
    }
  }
`;

export default function Feedback(): JSX.Element {
  const { username } = useNetworkAuth();
  const { data: userData } = useQuery(GET_USER_ID, {
    variables: {
      username,
    },
  });
  const userId = userData?.User[0]?.id;
  const { data: avgScore, loading: loadingAvg } = useQuery(GET_AVG_SCORE, {
    variables: {
      username,
    },
  });
  const { data: receivedRatingData } = useQuery(GET_USER_RATINGS, {
    variables: {
      username: username,
    },
  });
  const { data: givenRatingData } = useQuery(GET_RECEIVED_RATINGS, {
    variables: {
      username: username,
    },
  });
  const [toggle, setToggle] = useState('received');

  const handleChange = (event: any) => {
    setToggle(event.target.value);
  };
  const givenFeedbackCard: JSX.Element[] = [];
  const receivedFeedbackCard: JSX.Element[] = [];
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });
  const [avgState, setAvgState] = useState(0);
  useEffect(() => {
    loadingAvg ? null : setAvgState(avgScore?.User[0]?.avgScore);
  }, [avgScore, loadingAvg]);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Grid container sx={{ width: '100%', flexDirection: 'row', margin: 'auto', ml: 2 }}>
      <Grid xs={12} md={8}>
        <Grid
          item
          xs={12}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            justifyItems: 'center',
          }}
        >
          {/* <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <MessagesSortModal />
            <Typography sx={{ fontSize: '18px' }}> Filter </Typography>
            <TuneIcon sx={{ width: '30px', height: '30px', cursor: 'pointer' }} />
          </Box> */}
          <Grid sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', margin: '20px' }}>
              <FormControl sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                <RadioGroup
                  row
                  sx={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '100px' }}
                  defaultValue="received"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel value="received" onChange={handleChange} control={<Radio />} label="Received" />
                  <FormControlLabel value="given" onChange={handleChange} control={<Radio />} label="Given" />
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        <Grid sx={{ width: '100%', pl: 8, borderRight: '1px solid black' }} container flexDirection="row">
          {toggle === 'received' &&
            receivedRatingData?.User[0]?.rating.map((v: any) => {
              return (
                <Grid item xs={12} sm={4} xl={4} key={`${v.id}pimba`}>
                  <FeedbackCard sentBy={v.sentBy} date={v.sentOn.formatted} score={v.score} feedback={v.feedback} />
                </Grid>
              );
            })}
          {toggle === 'given' &&
            givenRatingData?.User[0]?.hasRatedUsers.map((v: any) => {
              return (
                <Grid item xs={12} sm={4} xl={4} key={`${v.id}pimba`}>
                  <FeedbackCard sentBy={v.sentTo} score={v.score} feedback={v.feedback} date={v.sentOn.formatted} />
                </Grid>
              );
            })}
        </Grid>
      </Grid>
      <Grid
        item
        xs={3}
        md={3}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'center',
          mt: 2,
        }}
      >
        <Grid sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 3 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: '900', m: 1 }}>Ranking</Typography>
          <Box
            sx={{
              p: 3,
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #000',
              width: '40%',
            }}
          >
            <Typography>My average score: </Typography>
            <Rating value={avgState} readOnly />
          </Box>
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'column', width: '100%', ml: 3 }}>
          <FeedbackRanking />
        </Grid>
      </Grid>
    </Grid>
  );
}
