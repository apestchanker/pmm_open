import React, { useCallback, useState } from 'react';
import { Box, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import Style from './ProposerProfile.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { CONNECT_NOTIFICATION_TO_USER, CREATE_NOTIFICATION, GET_SINGLE_USER } from 'Queries';
import ReturnButton from 'Components/ReturnButton/ReturnButton';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { GET_TASK_BY_ID } from 'Queries/tasksQueries';
import { Link } from 'react-router-dom';
import { CustomBtn } from 'Components/MUI Components/CustomBtn';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { CREATE_CONTRACT_PROPOSER_COLLABORATOR } from 'Queries/collaboratorQueries';

function TaskDetail() {
  const { id } = useParams();
  const { username } = useNetworkAuth();
  const navigate = useNavigate();

  const [mentoringProposals, setMentoringProposals] = useState<any>([]);

  const { data, loading, error } = useQuery(GET_TASK_BY_ID, {
    variables: { id },
  });

  const { data: userData } = useQuery(GET_SINGLE_USER, {
    variables: { username },
  });

  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);
  const [createContractMutation] = useMutation(CREATE_CONTRACT_PROPOSER_COLLABORATOR);

  const createContract = useCallback(async (): Promise<boolean> => {
    try {
      const contractId = uuidv4();
      const date = moment();
      const x = await createContractMutation({
        variables: {
          data: {
            id: contractId,
            terms: 'PENDING',
            status: 'PENDING',
            isMentorApprover: false,
            date: { formatted: date },
          },
          taskId: data?.Task[0]?.id,
          proposerId: data?.Task[0]?.forProposal?.proposedBy?.id,
          collaboratorId: userData?.User[0]?.id,
          contractId: contractId,
          proposalId: data?.Task[0]?.forProposal?.id,
        },
      });
      // NOTIFICATION MUTATION
      const uniqueId = uuidv4();
      //   await sendNotification({
      //     variables: {
      //       id: uniqueId,
      //       read: false,
      //       message: `${username} sent you a request.`,
      //       date: date,
      //       link: `/projects`,
      //       userID: userId?.User[0]?.id,
      //     },
      //   });
      // NOTIFICATION MUTATION END
      await createNotification({
        variables: {
          id: uniqueId,
          message: `${username} sent you a request to collaborate in ${data?.Task[0]?.title}.`,
          date: { formatted: date },
          link: `/projects`,
        },
      });
      await connectNotification({
        variables: {
          userID: data?.Task[0]?.forProposal?.proposedBy?.id,
          notificationID: uniqueId,
        },
      });
      Swal.fire({
        title: 'Request Sent!',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
      return true;
    } catch (err) {
      //
      console.error(err);
      return false;
    }
  }, [createContractMutation, userData, data]);
  function handleSendRequest() {
    createContract();
    return;
  }

  if (loading)
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ alignSelf: 'center', mt: '10%' }} />
      </Box>
    );

  return (
    <Grid container spacing={3} style={{ margin: 'auto', width: '80%', paddingTop: '50px', position: 'relative' }}>
      <Grid container md={2} sx={{ alignItems: 'flex-start' }}>
        <ReturnButton />
      </Grid>
      <Grid container sx={{ justifyContent: 'space-between' }} md={10}>
        <Grid item xs={5} md={4}>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Box className="side-img-info">
              <Typography component="h1" variant="h6" fontWeight={700} fontSize="24px" lineHeight="16px" marginBottom={'23px'}>
                {data?.Task[0].title}
              </Typography>
              {/* MAP TO ADD */}
              <Typography fontWeight={400} fontSize="16px" lineHeight="16px" marginBottom={'16px'}>
                <Link style={{ color: 'black', textDecoration: ' underline' }} to={`/proposals/details/${data?.Task[0].forProposal.id}`}>
                  {data?.Task[0].forProposal.title || 'Proposal Title'}
                </Link>
              </Typography>
              <Typography fontWeight={400} fontSize="16px" lineHeight="16px" marginBottom={'16px'}>
                Effort: {data?.Task[0].effort || 'Effort'}
              </Typography>
              <Typography fontWeight={400} fontSize="16px" lineHeight="16px" marginBottom={'16px'}>
                Fees: {data?.Task[0].fees || '0'}
              </Typography>
              <Typography fontWeight={400} fontSize="16px" lineHeight="16px" marginBottom={'16px'}>
                Owner:{' '}
                <Link style={{ color: 'black', textDecoration: ' underline' }} to={`/users/${data?.Task[0].forProposal.proposedBy.id}`}>
                  {data?.Task[0].forProposal.proposedBy.username || 'User'}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={5} md={4}>
          {/* URLS TO MAP */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', flexDirection: 'column' }}>
            {data?.Task[0].forProposal.proposedBy.URLs?.map((url: string, index: number) => {
              return (
                <Box key={index} display="flex" alignItems={'center'}>
                  <Typography className={Style.subtitles}>URL: </Typography>
                  <Typography>
                    <a
                      style={{ color: 'var(--linkBlue)', marginLeft: '5px', textDecoration: 'underline' }}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {url}
                    </a>
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box
            className="user-img"
            sx={{
              width: '178px',
              height: '178px',
              background: 'red',
              borderRadius: '100px',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '25px',
            }}
          ></Box>
        </Grid>
        {/* <Grid container> */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', mt: 5, alignItems: 'center' }}>
            <Typography className={Style.subtitles}>Language</Typography>
            {data?.Task[0].forProposal.proposedBy.languages.map((lang: any) => {
              return (
                <Chip sx={{ color: 'white', backgroundColor: 'var(--primaryBlue)', marginLeft: '10px' }} key={lang.id} label={lang.name} />
              );
            })}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mt: 3 }}>
            <Typography className={Style.subtitles}>Job Description</Typography>
            <Box
              sx={{
                height: '160px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <Typography className={Style.simpleText}>
                {data?.Task[0].descriptionOfTask || <Typography>No Description</Typography>}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', mt: 3, alignItems: 'center' }}>
            <Typography className={Style.subtitles}>Tags: </Typography>
            {data?.Task[0].neededSkills.map((tag: any) => {
              return (
                <Chip sx={{ color: 'white', backgroundColor: 'var(--primaryBlue)', marginLeft: '10px' }} key={tag.name} label={tag.name} />
              );
            })}
          </Box>
        </Grid>
      </Grid>

      <Grid xs={12} sx={{ marginTop: '50px', display: 'flex', justifyContent: 'center', paddingBottom: '30px' }}>
        {data?.Task[0].forProposal.proposedBy.username !== username && (
          <CustomBtn
            cb={() => {
              Swal.fire({
                title: 'You are about to be redirected, are you sure you want to continue?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: 'var(--primaryBlue)',
                cancelButtonColor: 'var(--primaryGray)',
                confirmButtonText: 'Yes, continue',
                cancelButtonText: 'No, cancel',
              }).then((result) => {
                if (result.value) {
                  navigate(`/projects/myMessages/${data?.Task[0].forProposal.proposedBy.username}`);
                }
              });
            }}
          >
            Contact
          </CustomBtn>
        )}
        {data?.Task[0].forProposal.proposedBy.username !== username && (
          <CustomBtn
            cb={() => {
              Swal.fire({
                title: 'You are about to send an application to this task, are you sure you want to continue?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: 'var(--primaryBlue)',
                cancelButtonColor: 'var(--primaryGray)',
                confirmButtonText: 'Yes, continue',
                cancelButtonText: 'No, cancel',
              }).then((result) => {
                if (result.value === true) {
                  createContract();
                }
              });
            }}
          >
            Apply
          </CustomBtn>
        )}
      </Grid>
    </Grid>
  );
}

export default TaskDetail;
