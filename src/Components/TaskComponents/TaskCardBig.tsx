import { Avatar, Box, Button, CardActions, Chip, Modal, Paper, TextField, Typography } from '@mui/material';
import defaultAvatar from 'Assets/default-avatar.png';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GET_TASK_CREATOR } from 'Queries/tasksQueries';
import { CREATE_CONTRACT_COLLABORATOR_PROPOSER } from 'Queries/collaboratorQueries';
import { SEND_MESSAGE, CREATE_AND_CONNECT_NOTIFICATION, GET_USER_ID, CREATE_NOTIFICATION, CONNECT_NOTIFICATION_TO_USER } from 'Queries';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const modalStyle = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '330px',
  bgcolor: 'white',
  borderRadius: '10px',
  padding: '15px',
};

const modalStyleRequest = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '15px',
  boxShadow: 24,
  p: 3,
};

const TaskCardBig = ({ title, fees, effort, proposalTitle, id, description, skills }: any) => {
  const { data: taskCreator } = useQuery(GET_TASK_CREATOR, {
    variables: { id: id },
  });
  const { username } = useNetworkAuth();
  const creatorUsername = taskCreator?.Task[0]?.forProposal?.proposedBy?.username;
  const creatorId = taskCreator?.Task[0]?.forProposal?.proposedBy?.id;
  const isCreator = username === taskCreator?.Task[0]?.forProposal?.proposedBy?.username;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  //const [sendNotification] = useMutation(CREATE_AND_CONNECT_NOTIFICATION);
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);
  const navigate = useNavigate();

  const { data: userId, loading: userIdLoading } = useQuery(GET_USER_ID, { variables: { username: username } });

  const [text, setText] = useState('');
  const [openReq, setOpenReq] = useState(false);
  const handleOpenRequest = () => setOpenReq(true);
  const handleCloseRequest = () => setOpenReq(false);
  const closeModalRequest = () => {
    handleCloseRequest();
  };

  const myuuid = uuidv4();
  const contractId = uuidv4();
  const dateTime = moment();
  const messageSent = () => {
    handleClose();
  };

  const [createContractMutation] = useMutation(CREATE_CONTRACT_COLLABORATOR_PROPOSER);
  const createContract = useCallback(async (): Promise<boolean> => {
    try {
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
          taskId: taskCreator?.Task[0]?.id,
          proposerId: taskCreator?.Task[0]?.forProposal?.proposedBy?.id,
          collaboratorId: userId?.User[0]?.id,
          contractId: contractId,
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
          message: `${username} sent you a request.`,
          date: { formatted: date },
          link: `/projects`,
        },
      });
      await connectNotification({
        variables: {
          userID: taskCreator?.Task[0]?.forProposal?.proposedBy?.id,
          notificationID: uniqueId,
        },
      });
      Swal.fire({
        title: 'Request Sent!',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
      handleClose();
      return true;
    } catch (err) {
      //
      handleClose();
      console.error(err);
      return false;
    }
  }, [createContractMutation, userId, creatorId, taskCreator]);
  function handleSendRequest() {
    createContract();
    handleCloseRequest();
    return;
  }

  const sendMessage = useCallback(async (): Promise<boolean> => {
    try {
      if (!text) {
        handleClose();
        Swal.fire({
          title: 'No text to send',
          icon: 'error',
          showCloseButton: true,
          confirmButtonText: 'Ok',
        });
        return false;
      }
      await sendMessageMutation({
        variables: {
          data: {
            id: myuuid,
            on: { formatted: dateTime },
            text: text,
            read: false,
          },
          userBy: userId.User[0].id,
          userTo: creatorId,
          messageId: myuuid,
        },
      });
      handleClose();
      Swal.fire({
        title: 'Message Sent',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
      const uniqueId = uuidv4();
      const date = moment();
      //   await sendNotification({
      //     variables: {
      //       id: uniqueId,
      //       read: false,
      //       message: `${username} sent you a message.`,
      //       date: { formatted: date },
      //       link: `/projects/myMessages/${username}`,
      //       userID: taskCreator?.Task[0]?.forProposal?.proposedBy?.id,
      //     },
      //   });
      await createNotification({
        variables: {
          id: uniqueId,
          message: `${username} sent you a message.`,
          date: { formatted: date },
          link: `/projects/myMessages/${username}`,
        },
      });
      await connectNotification({
        variables: {
          userID: taskCreator?.Task[0]?.forProposal?.proposedBy?.id,
          notificationID: uniqueId,
        },
      });
      handleClose();
      messageSent();
      return true;
    } catch (err) {
      //
      handleClose();
      console.error(err);
      return false;
    }
  }, [creatorUsername, username, sendMessageMutation, text]);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          width: '85%',
          maxWidth: '285px',
          margin: '5px 0',
          position: 'relative',
          cursor: 'pointer',
          height: '300px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 1 }}>
          <Avatar src={defaultAvatar} />
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography
              align="center"
              sx={{
                width: '80%',
                lineHeight: '24px',
                fontSize: '12px',
                marginLeft: defaultAvatar ? '5px' : null,
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {proposalTitle}
            </Typography>
            <Link to={`/tasks/${id}`}>
              <Typography
                align="center"
                sx={{
                  width: '80%',
                  lineHeight: '24px',
                  fontSize: '18px',
                  fontWeight: 500,
                  marginLeft: defaultAvatar ? '5px' : null,
                  color: '#53669A',
                  lineBreak: 'anywhere',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '220px',
                }}
              >
                {title}
              </Typography>
            </Link>
          </Box>
        </Box>
        <Box
          sx={{
            width: 'auto',
            display: 'flex',
            flexDirection: 'row',
            height: '25px',
            borderRadius: '12.5px',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '5px',
          }}
        >
          <Typography
            align="center"
            sx={{
              lineHeight: '24px',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid black',
              borderRadius: '12.5px',
              paddingLeft: '8px',
              paddingRight: '8px',
            }}
          >
            {`Effort: ${effort}`}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 'auto',
            display: 'flex',
            flexDirection: 'row',
            height: '25px',
            borderRadius: '12.5px',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '5px',
          }}
        >
          <Typography
            align="center"
            sx={{
              lineHeight: '24px',
              fontSize: '12px',
              fontWeight: 500,
              border: '1px solid black',
              borderRadius: '12.5px',
              paddingLeft: '8px',
              paddingRight: '8px',
            }}
          >
            {`Fees: ${fees}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '90%', height: '80px' }}>
          <Typography
            align="center"
            sx={{
              p: 2,
              width: '100%',
              lineHeight: '24px',
              fontSize: '12px',
              // lineHeightStep: '20px',
              overflow: 'hidden',
              whiteSpace: 'break',
              marginBottom: '10px',
            }}
          >
            {description}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            pl: 2,
            maxWidth: '250px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Typography sx={{ pr: 2 }}>Skills:</Typography>
          {skills.length < 2 ? (
            skills?.map((sk: any) => (
              <Chip
                sx={{
                  marginRight: '4px',
                  color: 'white',
                  backgroundColor: 'var(--primaryBlue)',
                }}
                key={`${sk.id}`}
                label={sk.name}
              />
            ))
          ) : (
            <>
              <Chip
                sx={{
                  marginRight: '4px',
                  color: 'white',
                  backgroundColor: 'var(--primaryBlue)',
                }}
                key={skills?.[0]?.id}
                label={skills?.[0]?.name}
              />
              <Chip
                sx={{
                  marginRight: '4px',
                  color: 'white',
                  backgroundColor: 'var(--primaryBlue)',
                }}
                key={skills?.[1]?.id}
                label={skills?.[1]?.name}
              />
              <Typography>...</Typography>
            </>
          )}
        </Box>
        <Box
          sx={{
            width: 'auto',
            display: 'flex',
            flexDirection: 'row',
            borderRadius: '12.5px',
            justifyContent: 'space-around',
            m: 1,
          }}
        >
          <CardActions
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              position: 'absolute',
              bottom: '1px',
            }}
          >
            {isCreator === true && (
              <>
                <Button sx={{ color: '#263560' }}>EDIT</Button>
                <Button sx={{ color: '#263560' }}>REMOVE</Button>
              </>
            )}
            {isCreator === false && (
              <>
                <Button sx={{ color: '#263560' }} onClick={() => navigate(`/tasks/${id}`)}>
                  SEE+
                </Button>
                <Button onClick={handleOpen} sx={{ color: 'var(--primaryBlue)', fontSize: '14px' }}>
                  CONTACT
                </Button>
                <Button onClick={handleOpenRequest} sx={{ color: '#263560' }}>
                  APPLY
                </Button>
              </>
            )}
          </CardActions>
          <Modal open={openReq}>
            <Box sx={modalStyleRequest}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography id="modal-modal-title" variant="h5" fontWeight={700} component="h3">
                  {taskCreator?.Task[0]?.forProposal?.proposedBy?.username}
                </Typography>
                <CloseIcon
                  sx={{
                    background: 'var(--textDark)',
                    color: 'white',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                  onClick={() => closeModalRequest()}
                />
              </Box>
              {/* <Typography>{profile}</Typography> */}
              <Typography sx={{ marginTop: '20px' }}>Already decided? Apply to this Task now!</Typography>
              <Button
                onClick={handleSendRequest}
                variant="contained"
                sx={{ marginTop: '15px', alignSelf: 'center', backgroundColor: 'var(--primaryBlue)' }}
              >
                SEND REQUEST
              </Button>
            </Box>
          </Modal>
          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h5" fontWeight={700} component="h2" mb={2}>
                {taskCreator?.Task[0]?.forProposal?.proposedBy?.username}
              </Typography>
              <TextField
                id="outlined-multiline-static"
                multiline
                rows={4}
                placeholder="Your message here"
                onChange={(evt) => {
                  setText(evt.target.value);
                }}
              />
              <Button
                onClick={sendMessage}
                variant="contained"
                sx={{
                  marginTop: '15px',
                  width: '120px',
                  alignSelf: 'end',
                  backgroundColor: 'var(--primaryBlue)',
                  '&:hover': { backgroundColor: 'var(--primaryBlueHover)' },
                }}
              >
                SEND
              </Button>
            </Box>
          </Modal>
        </Box>
      </Paper>
    </>
  );
};

export default TaskCardBig;
