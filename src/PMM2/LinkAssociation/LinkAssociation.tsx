import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import mediaCheck from 'PMM2/utils/mediaCheck';
import React, { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_MENTOR_LINK, GET_PROPOSAL_BY_REFERAL, GET_PROPOSAL_PRESENTED } from 'Queries/PMM2/mentoringQueries';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingCircle from 'PMM2/utils/LoadingCircle';
import { useNavigate } from 'react-router-dom';
import { useCreateContract } from 'Hooks/createContract';
import { useMentorProposal } from 'Hooks/createMentorProposal';
import { v4 as uuidv4 } from 'uuid';

interface LinkInterface {
  userId: string | null | undefined;
}

const LinkAssociation = ({ userId }: LinkInterface) => {
  const { refurl } = useParams();
  const { data: getMentorLink, loading: loading } = useQuery(GET_MENTOR_LINK, {
    variables: { referralUrl: refurl },
  });
  console.log(getMentorLink, 'Mentor');
  const { data: getProposalReferral, loading: loadingReferral } = useQuery(GET_PROPOSAL_BY_REFERAL, {
    variables: { referralUrl: refurl },
  });
  console.log(getProposalReferral, 'getProposalReferral');
  const { data: getProposal, loading: loadingProposal } = useQuery(GET_PROPOSAL_PRESENTED, {
    variables: { referralUrl: refurl },
  });
  const { loginWithPopup, user, isAuthenticated, isLoading } = useAuth0();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginWithPopup();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const { addProposal } = useMentorProposal();
  const { createContract } = useCreateContract();

  const sendProposaltRequest = async (id: string, userId: string, mentorId: string, username: string) => {
    if (userId && username && mentorId) {
      const result = await addProposal({ id, userId, mentorId, username });
      if (result) {
        console.log(result, 'proposal OK');
      } else {
        console.log(result, 'proposal NOT OK');
      }
    }
  };

  const sendContractRequest = async (proposalId: string, mentorId: string, proposedBy: string) => {
    if (mentorId && proposedBy) {
      const result = await createContract({ proposalId, mentorId, proposedBy });
      if (result) {
        console.log(result, 'contract OK');
      } else {
        console.log(result, 'contract NOT OK');
      }
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user !== undefined) {
      const mentorId = getMentorLink.User[0].id;
      const proposedBy = user.sub ?? ''; // Using the user id retrieved from Auth0 provider
      const username = user.name ?? '';
      const proposalId = uuidv4();
      console.log(proposedBy, 'Proposer');
      console.log(mentorId, 'MentorID');
      sendProposaltRequest(proposalId, proposedBy, mentorId, username);
      sendContractRequest(proposalId, mentorId, proposedBy);
      navigate('/'); // redirect to the home page after successful login
    }
  }, [isLoading, isAuthenticated, user]);

  useEffect(() => {
    if (!getMentorLink?.User?.length) {
      setError('Loading your mentor page...');
    } else {
      setError('');
    }
  }, [getMentorLink]);

  const addLocal = () => {
    if (!error) {
      localStorage.removeItem('Mentor');
      localStorage.setItem(`Mentor`, getMentorLink.User[0].id);
      handleLogin();
    }
  };
  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {loading || loadingProposal || loadingReferral ? (
        <LoadingCircle />
      ) : (
        <Box>
          <Box
            sx={{
              padding: '45px 70px',
            }}
          >
            <Box mb={'30px'} ml={'50px'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography fontFamily="Roboto" fontWeight={700} fontSize={'22px'} color={'#000000'}>
                Welcome to Proposal Mentor Marketplace! you’ve been invited to collaborate with:
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Avatar src={getMentorLink.User[0].picurl} sx={{ width: '175px', height: '175px' }}></Avatar>
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography fontFamily="Roboto" fontWeight={700} fontSize={'22px'} color={'#263560'}>
                  {getMentorLink.User[0].username}
                </Typography>
                <Box>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={12} sx={{ display: 'flex', direction: 'row' }}>
                      {getMentorLink.User[0].roles.map((role: any, index: any) => {
                        return (
                          <Typography
                            key={index}
                            fontFamily="Roboto"
                            fontWeight={400}
                            fontSize={'16px'}
                            lineHeight={'40px'}
                            color={'#263560'}
                            sx={{ marginRight: '10px' }}
                          >
                            {role.name}
                          </Typography>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={12} sx={{ display: 'flex', direction: 'row' }}>
                      {getMentorLink.User[0].hasSkill.map((skills: any, index: any) => {
                        return (
                          <Typography
                            key={index}
                            fontFamily="Roboto"
                            fontWeight={400}
                            fontSize={'16px'}
                            lineHeight={'40px'}
                            color={'#263560'}
                            sx={{ marginRight: '10px' }}
                          >
                            {skills.name}
                          </Typography>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Box>
                <Rating
                  name="half-rating-read"
                  defaultValue={getMentorLink.User[0].rating[0]?.score ? getMentorLink.User[0].rating[0].score : 0}
                  precision={0.5}
                  readOnly
                  sx={{ color: '#263560' }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                {getMentorLink.User[0].URLs.map((url: any, index: any) => {
                  return (
                    <Typography
                      key={index}
                      sx={{ display: 'flex', justifyContent: 'center' }}
                      fontFamily="Roboto"
                      fontWeight={400}
                      fontSize={'16px'}
                      lineHeight={'40px'}
                      color={'#263560'}
                    >
                      {url}
                    </Typography>
                  );
                })}
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              padding: '10px 70px',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={3} sx={{ display: 'flex', direction: 'row' }}>
                <Typography
                  sx={{ display: 'flex', justifyContent: 'left', paddingRight: '20px' }}
                  fontFamily="Roboto"
                  fontWeight={700}
                  fontSize={'16px'}
                  lineHeight={'40px'}
                  color={'#263560'}
                >
                  Language
                </Typography>
                <Stack direction="row" spacing={3}>
                  {getMentorLink.User[0].languages.map((language: any, index: any) => {
                    return <Chip key={index} label={language.name} color="secondary" />;
                  })}
                </Stack>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', direction: 'row' }}>
                <Typography
                  sx={{ display: 'flex', justifyContent: 'left', paddingRight: '20px' }}
                  fontFamily="Roboto"
                  fontWeight={700}
                  fontSize={'16px'}
                  lineHeight={'40px'}
                  color={'#263560'}
                >
                  Tags:
                </Typography>
                <Stack direction="row" spacing={3}>
                  {getMentorLink.User[0].interestedIn.map((language: any, index: any) => {
                    return <Chip key={index} label={language.name} color="secondary" />;
                  })}
                </Stack>
              </Grid>
              <Grid></Grid>
            </Grid>
            <Box
              mt={'30px'}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Grid
                container
                spacing={5}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Grid item xs={12} md={2.5}>
                  <Typography
                    fontFamily="Roboto"
                    fontWeight={700}
                    fontSize={'15px'}
                    color={'#FF5C00'}
                    sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center', height: '50%' }}
                  >
                    Projects being mentored
                  </Typography>
                  <Typography
                    fontFamily="Roboto"
                    fontWeight={700}
                    fontSize={'48px'}
                    color={'#FF5C00'}
                    sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}
                  >
                    {
                      getMentorLink.User[0].proposals
                        .map((p: any) => {
                          return p.proposedBy;
                        })
                        .filter((p: any) => p.id === getMentorLink.User[0].id).length
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2.5}>
                  <Typography
                    fontFamily="Roboto"
                    fontWeight={700}
                    fontSize={'15px'}
                    color={'#FF5C00'}
                    sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center', height: '50%' }}
                  >
                    Projects mentored funded
                  </Typography>
                  <Typography
                    fontFamily="Roboto"
                    fontWeight={700}
                    fontSize={'48px'}
                    color={'#FF5C00'}
                    sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}
                  >
                    {getMentorLink.User[0].contractedBy
                      ? getMentorLink.User[0].contractedBy
                          .map((p: any) => {
                            return p.relatedProposal;
                          })
                          .filter((p: any) => p.fundingStatus.name === 'Funded').length
                      : 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography
                    fontFamily="Roboto"
                    fontWeight={700}
                    fontSize={'15px'}
                    color={'#FF5C00'}
                    sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center', height: '50%' }}
                  >
                    Projects mentored
                  </Typography>
                  <Typography
                    fontFamily="Roboto"
                    fontWeight={700}
                    fontSize={'48px'}
                    color={'#FF5C00'}
                    sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}
                  >
                    {
                      getMentorLink.User[0].contractedBy
                        .map((p: any) => {
                          return p.mentor;
                        })
                        .filter((p: any) => p.id === getMentorLink.User[0].id).length
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography
                    fontFamily="Roboto"
                    fontWeight={700}
                    fontSize={'15px'}
                    color={'#FF5C00'}
                    sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center', height: '50%' }}
                  >
                    Own proposals funded
                  </Typography>
                  <Typography
                    fontFamily="Roboto"
                    fontWeight={700}
                    fontSize={'48px'}
                    color={'#FF5C00'}
                    sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}
                  >
                    {getProposalReferral.Proposal.length}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography
                    fontFamily="Roboto"
                    fontWeight={700}
                    fontSize={'15px'}
                    color={'#FF5C00'}
                    sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center', height: '50%' }}
                  >
                    Own proposals presented
                  </Typography>
                  <Typography
                    fontFamily="Roboto"
                    fontWeight={700}
                    fontSize={'48px'}
                    color={'#FF5C00'}
                    sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}
                  >
                    {getProposal.Proposal.length}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box
              sx={{
                paddingTop: '30px',
              }}
            >
              <Typography>{getMentorLink.User[0].bio}</Typography>
            </Box>
            <Box mt={'2em'} ml={'3em'} mb={'2em'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography fontFamily="Roboto" fontWeight={700} fontSize={{ xs: '1em', sm: '1.5em', md: '1.5em' }} color={'#000000'}>
                Once you sign in or become a member, you’ll be automatically linked to this mentor.
              </Typography>
            </Box>
            {typeof userId !== 'string' ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#263560',
                    color: '#FFFFFF',
                    borderRadius: '40px',
                    padding: '0.5em 2em',
                    height: 'auto',
                    width: 'auto',
                  }}
                  onClick={addLocal}
                >
                  <Typography fontFamily="Roboto" fontWeight={700} fontSize={{ xs: '1em', sm: '1.5em', md: '1.5em' }}>
                    JOIN PMM
                  </Typography>
                </Button>
              </Box>
            ) : (
              ''
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LinkAssociation;
