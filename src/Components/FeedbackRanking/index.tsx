import { Box, Grid, Typography } from '@mui/material';
import List from '@mui/material/List';
import { useQuery } from '@apollo/client';
import { TOP_MENTORS, TOP_PROPOSERS } from 'Queries/rankingQueries';
import StarIcon from '@mui/icons-material/Star';

const FeedbackRanking = () => {
  const { data: dataMentors, loading: mentorsLoading } = useQuery(TOP_MENTORS);
  const { data: dataProposers, loading: proposersLoading } = useQuery(TOP_PROPOSERS);

  return (
    <Grid container xs={12} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '16px', fontWeight: '900', m: 1 }}>Top 10</Typography>
      </Grid>

      <Grid
        item
        xs={5.5}
        md={5.5}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid black',
          borderRadius: '5px',
          p: 2,
          mr: 1,
        }}
      >
        <Typography sx={{ fontSize: '18px', fontWeight: '900' }}>Mentors</Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {mentorsLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            dataMentors?.User.slice(0, 10).map((mentor: any, index: number) => {
              return (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                    <Typography
                      key={mentor.id}
                      sx={
                        index === 0
                          ? {
                              fontSize: '14px',
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '70%',
                            }
                          : {
                              fontSize: '14px',
                              fontWeight: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '70%',
                            }
                      }
                    >
                      {index + 1} - {mentor.username}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '20%', justifyContent: 'end', alignItems: 'center' }}>
                      {mentor.avgScore.toFixed(2)} <StarIcon sx={{ width: '15px' }} />
                    </Box>
                  </Box>
                </>
              );
            })
          )}
        </List>
      </Grid>
      <Grid
        item
        xs={5.5}
        md={5.5}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid black', borderRadius: '5px', p: 2 }}
      >
        <Typography sx={{ width: '100%', fontSize: '18px', fontWeight: '900', textAlign: 'center' }}>Proposers</Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {proposersLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            dataProposers?.User.slice(0, 10).map((proposer: any, index: number) => {
              return (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                    <Typography
                      key={proposer.id}
                      sx={
                        index === 0
                          ? {
                              fontSize: '14px',
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '70%',
                            }
                          : {
                              fontSize: '14px',
                              fontWeight: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '70%',
                            }
                      }
                    >
                      {index + 1} - {proposer.username}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '20%', justifyContent: 'end', alignItems: 'center' }}>
                      {proposer.avgScore.toFixed(2)} <StarIcon sx={{ width: '15px' }} />
                    </Box>
                  </Box>
                </>
              );
            })
          )}
        </List>
      </Grid>
    </Grid>
  );
};

export default FeedbackRanking;
