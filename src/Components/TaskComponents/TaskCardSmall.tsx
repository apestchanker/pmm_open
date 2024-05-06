import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
  Modal,
} from '@mui/material';
import defaultAvatar from 'Assets/default-avatar.png';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GET_TASK_CREATOR, SET_TASK_AS_DRAFT, SET_TASK_AS_PUBLISHED, SET_TASK_AS_STAFFED, SET_TASK_AS_REMOVED } from 'Queries/tasksQueries';
import { SEND_MESSAGE, GET_USER_ID, CREATE_NOTIFICATION, CONNECT_NOTIFICATION_TO_USER } from 'Queries';
import { useMutation, useQuery } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import ClickAwayListener from '@mui/material/ClickAwayListener';

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

const TaskCardSmall = ({ title, fees, effort, proposalTitle, id, status, applied }: any) => {
  const { data: taskCreator } = useQuery(GET_TASK_CREATOR, {
    variables: { id: id },
  });
  const navigate = useNavigate();
  const { username } = useNetworkAuth();
  const isCreator = username === taskCreator?.Task[0]?.forProposal?.proposedBy?.username;
  const [show, setShow] = useState(false);

  const [setTaskAsDraft, { error: setDraftError }] = useMutation(SET_TASK_AS_DRAFT, {
    variables: {
      taskId: id,
      taskStatusId: status,
    },
  });
  const [setTaskAsPublished, { error: setPublishedError }] = useMutation(SET_TASK_AS_PUBLISHED, {
    variables: {
      taskId: id,
      taskStatusId: status,
    },
  });
  const [setTaskAsStaffed, { error: setStaffedError }] = useMutation(SET_TASK_AS_STAFFED, {
    variables: {
      taskId: id,
      taskStatusId: status,
    },
  });
  const [setTaskAsRemoved, { error: setRemovedError }] = useMutation(SET_TASK_AS_REMOVED, {
    variables: {
      taskId: id,
      taskStatusId: status,
    },
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [text, setText] = useState('');
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const { data: userId, loading: userIdLoading } = useQuery(GET_USER_ID, { variables: { username: username } });
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);
  const myuuid = uuidv4();
  const dateTime = moment();
  // const uniqueId = uuidv4();
  // const date = moment();
  const messageSent = () => {
    handleClose();
  };
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
          userTo: taskCreator?.Task[0]?.forProposal?.proposedBy?.id,
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
          id: myuuid,
          message: `${username} sent you a message.`,
          date: { formatted: dateTime },
          link: `/projects/myMessages/${username}`,
        },
      });
      await connectNotification({
        variables: {
          userID: taskCreator?.Task[0]?.forProposal?.proposedBy?.id,
          notificationID: myuuid,
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
  }, [isCreator, username, sendMessageMutation, text]);

  const handleSetAsDraft = () => {
    if (!setDraftError) {
      setTaskAsDraft();
      setShow(false);
      Swal.fire({
        title: 'Task Set As Draft',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };
  const handleSetAsPublished = () => {
    if (!setPublishedError) {
      setTaskAsPublished();
      setShow(false);
      Swal.fire({
        title: 'Task Set As Published',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };
  const handleSetAsStaffed = () => {
    if (!setStaffedError) {
      setTaskAsStaffed();
      setShow(false);
      Swal.fire({
        title: 'Task Set As Staffed',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };
  const handleSetAsRemoved = () => {
    if (!setRemovedError) {
      setTaskAsRemoved();
      setShow(false);
      Swal.fire({
        title: 'Task Removed',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

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
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 1 }}>
          <Avatar src={defaultAvatar} />
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
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

              {!applied && (
                <IconButton onClick={() => setShow((prev) => !prev)} sx={{ width: '25px', height: '25px', ml: 2 }}>
                  <MoreVertOutlinedIcon />
                </IconButton>
              )}
            </Box>

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
          {isCreator === true && (
            <>
              <Button sx={{ color: '#263560' }} onClick={() => navigate(`/myTasks/${id}`)}>
                EDIT
              </Button>
              <Button sx={{ color: '#263560' }} onClick={() => handleSetAsRemoved()}>
                REMOVE
              </Button>
            </>
          )}
          {isCreator === false && (
            <>
              <Button sx={{ color: '#263560' }} onClick={() => navigate(`/tasks/${id}`)}>
                SEE+
              </Button>
              <Button sx={{ color: '#263560' }} onClick={handleOpen}>
                CONTACT
              </Button>
              {!applied ? <Button sx={{ color: '#263560' }}>APPLY</Button> : null}
            </>
          )}
        </Box>
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
      </Paper>
      {show && (
        <ClickAwayListener onClickAway={() => setShow(false)}>
          <Paper elevation={5} sx={{ position: 'absolute', zIndex: 1, ml: 46, mt: 1 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSetAsDraft()}>
                  <ListItemText primary="Draft" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSetAsPublished()}>
                  <ListItemText primary="Published" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSetAsStaffed()}>
                  <ListItemText primary="Staffed" />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </ClickAwayListener>
      )}
    </>
  );
};

export default TaskCardSmall;
