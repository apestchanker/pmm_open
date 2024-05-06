import { CONNECT_NOTIFICATION_TO_USER, CREATE_CONTRACT, CREATE_NOTIFICATION, GET_PROPOSAL_BY_ID, GET_USER_ID } from 'Queries';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import Linkify from 'react-linkify';
import Style from './ProposalDetail.module.css';
import ReturnButton from 'Components/ReturnButton/ReturnButton';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { CustomBtn } from 'Components/MUI Components/CustomBtn';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

function ProposalDetail() {
  const { username } = useNetworkAuth();
  const { id } = useParams();
  const contractId = uuidv4();
  const { data, loading } = useQuery(GET_PROPOSAL_BY_ID, {
    variables: { id },
  });
  const contractDate = moment();
  const navigate = useNavigate();

  const USER_ID = data?.Proposal[0]?.proposedBy?.id;
  const { data: activeUserId } = useQuery(GET_USER_ID, {
    variables: {
      username: username,
    },
  });
  const [createContractMutation] = useMutation(CREATE_CONTRACT);
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);
  return (
    <Box sx={{ position: 'relative', width: '70%', margin: 'auto', mt: 10 }}>
      {loading && <p>Loading...</p>}
      <Box className={Style.returnBox}>
        <ReturnButton />
      </Box>
      <Grid container spacing={2}>
        <img
          src={
            data?.Proposal[0]?.attachments[0]?.url ||
            'https://images.unsplash.com/photo-1501516069922-a9982bd6f3bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
          }
          alt="Proposal Detail"
          className={Style?.imageMobile}
        />
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography component="h1" className={Style.proposalTitle}>
                {data?.Proposal[0]?.title}
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle1">Challenge: {data?.Proposal[0]?.inChallenge?.title}</Typography>
                <Typography variant="subtitle1">
                  Proposer:{' '}
                  <Link className="linkTag" to={`/users/${USER_ID}`}>
                    {data?.Proposal[0]?.proposedBy?.username}
                  </Link>
                </Typography>
                <Typography variant="subtitle1">Mentors: {data?.Proposal[0]?.relatedContracts?.length || 0}</Typography>
              </Box>
              <Box mt={5}>
                <Typography variant="h6" className={Style?.subtitles}>
                  Describe the problem
                </Typography>
                <Linkify
                  componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
                    <a target="_blank" rel={'noopener noreferrer'} href={decoratedHref} key={key}>
                      {decoratedText}
                    </a>
                  )}
                >
                  <Typography className={Style?.simpleText}>{data?.Proposal[0]?.problem}</Typography>
                </Linkify>
              </Box>
            </Box>
            <Box>
              <img
                src={
                  data?.Proposal[0]?.attachments[0]?.url ||
                  'https://images.unsplash.com/photo-1501516069922-a9982bd6f3bd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
                }
                alt="Proposal Detail"
                className={Style?.imageDesktop}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ marginTop: '19px' }} variant="h6" className={Style?.subtitles}>
            Describe your solution to the problem
          </Typography>
          <Linkify
            componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
              <a target="_blank" rel={'noopener noreferrer'} href={decoratedHref} key={key}>
                {decoratedText}
              </a>
            )}
          >
            <Typography className={Style?.simpleText}>{data?.Proposal[0]?.solution}</Typography>
          </Linkify>
        </Grid>
        <Grid item xs={12} sx={{ paddingBottom: '100px' }}>
          <Box sx={{ marginTop: '19px' }}>
            <Typography className={Style?.subtitles}>Relevant experience</Typography>
            <Linkify
              componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
                <a target="_blank" rel={'noopener noreferrer'} href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              <Typography className={Style?.simpleText}>{data?.Proposal[0]?.relevantExperience}</Typography>
            </Linkify>
          </Box>
          {data?.Proposal[0]?.repo && (
            <Box mt={5}>
              <Typography className={Style?.subtitles}>
                Website/GitHub repository:{' '}
                <a
                  href={data?.Proposal[0]?.repo || '#'}
                  style={{ color: 'black', textDecoration: 'underline' }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {data?.Proposal[0]?.repo}
                </a>
              </Typography>
            </Box>
          )}
          <Box mt={5}>
            <Typography className={Style?.subtitles}>
              Requested funds in USD: $<span style={{ fontWeight: 'normal' }}>{data?.Proposal[0]?.requestedFunds}-</span>
            </Typography>
          </Box>
          <Box mt={5} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography sx={{ marginRight: '5px' }} className={Style?.subtitles}>
              Tags:{' '}
            </Typography>
            {data?.Proposal[0]?.describedByInterests?.map((interest: any) => {
              return (
                <Chip
                  key={`${interest?.name}interestId`}
                  sx={{
                    color: 'white',
                    backgroundColor: 'var(--primaryBlue)',
                    marginRight: '5px',
                    marginTop: '3px',
                  }}
                  label={interest?.name}
                />
              );
            })}
          </Box>
          <Box mt={5}>
            <Typography className={Style?.subtitles}>Detailed plan</Typography>
            <Linkify
              componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
                <a target="_blank" rel={'noopener noreferrer'} href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              <Typography className={Style?.simpleText}>{data?.Proposal[0]?.descriptionOfSolution}</Typography>
            </Linkify>
          </Box>
          <Box mt={5}>
            <Typography className={Style?.subtitles}>Please describe how your proposed solution will address the challenge</Typography>
            <Linkify
              componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
                <a target="_blank" rel={'noopener noreferrer'} href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              <Typography className={Style?.simpleText}>{data?.Proposal[0]?.howAddressesChallenge}</Typography>
            </Linkify>
          </Box>
          <Box mt={5}>
            <Typography className={Style?.subtitles}>
              What main challenges or risks do you foresee to deliver this project succesfully?
            </Typography>
            <Linkify
              componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
                <a target="_blank" rel={'noopener noreferrer'} href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              <Typography className={Style?.simpleText}>{data?.Proposal[0]?.mainChallengesOrRisks}</Typography>
            </Linkify>
          </Box>
          <Box mt={5}>
            <Typography className={Style.subtitles}>Please provide a detailed plan and timeline for delivering the solution</Typography>
            <Linkify
              componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
                <a target="_blank" rel={'noopener noreferrer'} href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              <Typography className={Style?.simpleText}>{data?.Proposal[0]?.detailedPlan}</Typography>
            </Linkify>
          </Box>
          <Box mt={5}>
            <Typography className={Style?.subtitles}>Please provide a detailed budget breakdown</Typography>
            <Linkify
              componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
                <a target="_blank" rel={'noopener noreferrer'} href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              <Typography className={Style?.simpleText}>{data?.Proposal[0]?.detailedBudget}</Typography>
            </Linkify>
          </Box>
          <Box mt={5}>
            <Typography className={Style?.subtitles}>
              Please provide details of your team members required to complete the project
            </Typography>
            <Linkify
              componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
                <a target="_blank" rel={'noopener noreferrer'} href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              <Typography className={Style?.simpleText}>{data?.Proposal[0]?.teamRequired}</Typography>
            </Linkify>
          </Box>
          <Box mt={5}>
            <Typography className={Style?.subtitles}>
              Please provide information on whether this proposal is a continuation of a previously funded project in Catalyst or an
              entirely new one.
            </Typography>
            <Linkify
              componentDecorator={(decoratedHref: string, decoratedText: string, key: number) => (
                <a target="_blank" rel={'noopener noreferrer'} href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              <Typography className={Style?.simpleText}>{data?.Proposal[0]?.continuationOrNew}</Typography>
            </Linkify>
          </Box>
        </Grid>
        <Grid mt={7} item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}></Grid>
      </Grid>
      {data?.Proposal[0]?.proposedBy.username !== username && (
        <Box sx={{ marginBottom: '40px' }}>
          <CustomBtn
            cb={() => {
              Swal.fire({
                title: 'Are you sure you want to send a request?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: 'var(--primaryBlue)',
                cancelButtonColor: 'var(--primaryGray)',
                confirmButtonText: 'Yes, continue',
                cancelButtonText: 'No, cancel',
              }).then((result) => {
                if (result.value) {
                  createContractMutation({
                    variables: {
                      data: {
                        id: contractId,
                        terms: 'PENDING',
                        status: 'PENDING',
                        isMentorApprover: false,
                        date: { formatted: contractDate },
                      },
                      proposalId: data?.Proposal[0]?.id,
                      mentorId: data?.Proposal[0]?.proposedBy.id,
                      proposerId: activeUserId?.User[0]?.id,
                      contractId: contractId,
                    },
                  })
                    .then(async () => {
                      const uniqueId = uuidv4();
                      await createNotification({
                        variables: {
                          id: uniqueId,
                          message: `${username} sent you a request.`,
                          date: { formatted: contractDate },
                          link: `/projects/`,
                        },
                      });
                      await connectNotification({
                        variables: {
                          userID: data?.Proposal[0]?.proposedBy.id,
                          notificationID: uniqueId,
                        },
                      });
                      Swal.fire({
                        title: 'Request sent!',
                        icon: 'success',
                      });
                    })
                    .catch((err) => {
                      Swal.fire({
                        title: err,
                        icon: 'error',
                      });
                    });
                }
              });
            }}
          >
            Apply
          </CustomBtn>
          <CustomBtn
            cb={() => {
              navigate(`/projects/myMessages/${data?.Proposal[0]?.proposedBy.username}`);
            }}
          >
            Contact
          </CustomBtn>
        </Box>
      )}
    </Box>
  );
}

export default ProposalDetail;
