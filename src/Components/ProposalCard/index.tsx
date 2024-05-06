import { default as MuiCard } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { default as MuiAvatar } from '@mui/material/Avatar';
import defaultAvatar from 'Assets/default-avatar.png';
import styled from '@mui/system/styled';
import CloseIcon from '@mui/icons-material/Close';
import StatusIndicator from 'Components/StatusIndicator';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import Modal from '@mui/material/Modal';
import {
  REMOVE_PROPOSAL,
  SET_PROPOSAL_ACTIVE,
  SET_PROPOSAL_INACTIVE,
  GET_USER_ID,
  CREATE_AND_CONNECT_NOTIFICATION,
  CREATE_CONTRACT,
  SEND_MESSAGE,
  CREATE_NOTIFICATION,
  CONNECT_NOTIFICATION_TO_USER,
  SET_PROPOSAL_FSTATUS_DRAFT,
  SET_PROPOSAL_FSTATUS_LOOKING_FOR_MENTOR,
  SET_PROPOSAL_FSTATUS_MENTOR_ASSIGNED,
  SET_PROPOSAL_FSTATUS_PRESENTED,
  SET_PROPOSAL_FSTATUS_FUNDED,
} from 'Queries';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { IconButton, List, ListItem, ListItemButton, ListItemText, Paper, TextField, Tooltip } from '@mui/material';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const modalStyle = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '330px',
  height: '208px',
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
interface CardProps {
  title: string;
  detailedPlan: string;
  id: string;
  challenge: string;
  mentors: number;
  fundingStatus: number;
  status: string;
  displayAvatar?: boolean;
  proposedBy: any;
  fstatus: string;
}
const Avatar = styled(MuiAvatar)`
  width: 40px;
  height: 40px;
`;

const TitleContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const Card = styled(MuiCard)`
  border: 1px solid rgba(0, 0, 0, 0.12);
`;

const ProposalCardComponent = ({
  title,
  challenge,
  mentors,
  fundingStatus,
  status,
  detailedPlan,
  id,
  fstatus,
  displayAvatar = false,
  proposedBy,
}: CardProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { username } = useNetworkAuth();

  const isProposalOwner = proposedBy?.username === username;
  const navigate = useNavigate();
  // const isProposer = roles.includes('Proposer');
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  //const [sendNotification] = useMutation(CREATE_AND_CONNECT_NOTIFICATION);
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);
  const [openReq, setOpenReq] = useState(false);
  const [createContractMutation] = useMutation(CREATE_CONTRACT);
  const { data: userId, loading: userIdLoading } = useQuery(GET_USER_ID, { variables: { username: username } });
  const handleOpenRequest = () => setOpenReq(true);
  const handleCloseRequest = () => setOpenReq(false);
  const closeModalRequest = () => {
    handleCloseRequest();
  };
  const contractId = uuidv4();
  const dateTime = moment();
  const [text, setText] = useState('');
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
          proposalId: id,
          mentorId: userId.User[0].id,
          proposerId: proposedBy?.id,
          contractId: contractId,
        },
      });
      Swal.fire({
        title: 'Request Sent!',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
      // NOTIFICATION MUTATION
      const uniqueId = uuidv4();
      /* await sendNotification({
        variables: {
          id: uniqueId,
          read: false,
          message: `${username} sent you a request.`,
          date: date,
          link: `/projects`,
          userID: proposedBy?.id,
        },
      }); */
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
          userID: proposedBy?.id,
          notificationID: uniqueId,
        },
      });
      // NOTIFICATION MUTATION END

      handleClose();
      return true;
    } catch (err) {
      //
      handleClose();
      console.error(err);
      return false;
    }
  }, [createContractMutation, userId]);
  function handleSendRequest() {
    createContract();
    handleCloseRequest();
    return;
  }
  const myuuid = uuidv4();
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
          userBy: userId?.User[0]?.id,
          userTo: proposedBy?.id,
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
      /* await sendNotification({
        variables: {
          id: uniqueId,
          read: false,
          message: `${username} sent you a message.`,
          date: date,
          link: `/projects/myMessages/${username}`,
          userID: proposedBy?.id,
        },
      }); */
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
          userID: proposedBy?.id,
          notificationID: uniqueId,
        },
      });
      handleClose();
      return true;
    } catch (err) {
      //
      handleClose();
      console.error(err);
      return false;
    }
  }, [proposedBy?.username, username, sendMessageMutation, text]);
  //! username and statusDate commented by queryChanges
  const [disableProposal, { data, loading, error }] = useMutation(SET_PROPOSAL_INACTIVE, {
    variables: {
      proposalId: id,
    },
  });

  //! username and statusDate commented by queryChanges
  const [enableProposal, { error: enableError }] = useMutation(SET_PROPOSAL_ACTIVE, {
    variables: {
      // username: username,
      proposalId: id,
      // statusDate: statusDate,
    },
  });

  //! username and statusDate commented by queryChanges
  const [removeProposal, { error: removeError }] = useMutation(REMOVE_PROPOSAL, {
    variables: {
      // username: username,
      proposalId: id,
      // statusDate: statusDate,
    },
  });

  const handleDisable = () => {
    if (!error) {
      disableProposal();
      Swal.fire({
        title: 'Proposal Disabled',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleEnable = () => {
    if (!enableError) {
      enableProposal();
      Swal.fire({
        title: 'Proposal Enabled',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleRemove = () => {
    if (!removeError) {
      removeProposal();
      handleClose();
      Swal.fire({
        title: 'Proposal Removed',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };
  const [show, setShow] = useState(false);

  const [setProposalAsDraft, { error: setDraftError }] = useMutation(SET_PROPOSAL_FSTATUS_DRAFT, {
    variables: {
      proposalId: id,
      proposalStatusId: fstatus,
    },
  });
  const [setProposalAsLookingForMentor, { error: setLookingForMentorError }] = useMutation(SET_PROPOSAL_FSTATUS_LOOKING_FOR_MENTOR, {
    variables: {
      proposalId: id,
      proposalStatusId: fstatus,
    },
  });
  const [setProposalAsMentorAssigned, { error: setMentorAssignedError }] = useMutation(SET_PROPOSAL_FSTATUS_MENTOR_ASSIGNED, {
    variables: {
      proposalId: id,
      proposalStatusId: fstatus,
    },
  });
  const [setProposalAsPresented, { error: setPresentedError }] = useMutation(SET_PROPOSAL_FSTATUS_PRESENTED, {
    variables: {
      proposalId: id,
      proposalStatusId: fstatus,
    },
  });
  const [setProposalAsFunded, { error: setFundedError }] = useMutation(SET_PROPOSAL_FSTATUS_FUNDED, {
    variables: {
      proposalId: id,
      proposalStatusId: fstatus,
    },
  });
  const handleSetProposalAsDraft = () => {
    if (!setDraftError) {
      setProposalAsDraft();
      setShow(false);
      Swal.fire({
        title: 'Proposal Set As Draft',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };
  const handleSetProposalAsLookingForMentor = () => {
    if (!setLookingForMentorError) {
      setProposalAsLookingForMentor();
      setShow(false);
      Swal.fire({
        title: 'Proposal Set As Looking For Mentor',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };
  const handleSetProposalAsMentorAssigned = () => {
    if (!setMentorAssignedError) {
      setProposalAsMentorAssigned();
      setShow(false);
      Swal.fire({
        title: 'Proposal Set As Mentor Assigned',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };
  const handleSetProposalAsPresented = () => {
    if (!setPresentedError) {
      setProposalAsPresented();
      setShow(false);
      Swal.fire({
        title: 'Proposal Set As Presented',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };
  const handleSetProposalAsFunded = () => {
    if (!setFundedError) {
      setProposalAsFunded();
      setShow(false);
      Swal.fire({
        title: 'Proposal Set As Funded',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleAddTask = () => {
    navigate(`/marketplace/tasks/addTask/${id}`);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: '240px',
        margin: '5px 0',
        height: '260px',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <TitleContainer
        sx={{
          justifyContent: 'space-between !important',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', pt: 2, pl: 2 }}>
          {displayAvatar && <Avatar src={defaultAvatar} />}
          <Tooltip title={title}>
            <Typography
              onClick={() => navigate(`/proposals/details/${id}`)}
              sx={{
                lineHeight: '19px',
                fontSize: '18px',
                marginLeft: displayAvatar ? '5px' : null,
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '160px',
              }}
            >
              {title || 'Proposal Title'}
            </Typography>
          </Tooltip>
        </Box>
        {isProposalOwner && (
          <IconButton onClick={() => setShow((prev) => !prev)} sx={{ width: '25px', height: '25px', ml: 2, mt: 2, mr: 2 }}>
            <MoreVertOutlinedIcon />
          </IconButton>
        )}
        {show && isProposalOwner ? (
          <ClickAwayListener onClickAway={() => setShow(false)}>
            <Paper elevation={5} sx={{ width: '200px', position: 'absolute', zIndex: 1, mt: 38, ml: 15 }}>
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleSetProposalAsDraft()}>
                    <ListItemText primary="Draft" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleSetProposalAsLookingForMentor()}>
                    <ListItemText primary="Looking For Mentor" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleSetProposalAsMentorAssigned()}>
                    <ListItemText primary="Mentor Assigned" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleSetProposalAsPresented()}>
                    <ListItemText primary="Presented" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleSetProposalAsFunded()}>
                    <ListItemText primary="Funded" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Paper>
          </ClickAwayListener>
        ) : null}
        {/* <ShareIcon sx={{ width: '15px', height: '13px' }} /> */}
      </TitleContainer>
      <CardContent sx={{ zIndex: -1 }} onClick={() => navigate(`/proposals/details/${id}`)}>
        <Typography
          sx={{
            lineHeight: '14px',
            fontSize: '13px',
            fontWeight: 400,
            marginTop: '3px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          onClick={() => navigate(`/proposals/details/${id}`)}
        >
          {challenge || 'F7 - Open Source'}
        </Typography>
        <TitleContainer
          sx={{ justifyContent: 'space-between', flexDirection: { md: 'row', xs: 'row', lg: 'column' }, alignItems: { lg: 'flex-start' } }}
          onClick={() => navigate(`/proposals/details/${id}`)}
        >
          <Typography sx={{ lineHeight: '14px', fontSize: '14px', fontWeight: 400, marginTop: '10px' }}>Mentors: {mentors}</Typography>
          <StatusIndicator status={fundingStatus} numberSections={5} proposalId={id} />
        </TitleContainer>
        {/* <Typography sx={{ color: 'rgba(0,0,0,0.6)' }}>{detailedPlan} </Typography> */}
        {detailedPlan ? (
          <Typography
            onClick={() => navigate(`/proposals/details/${id}`)}
            variant="body2"
            sx={{ color: 'rgba(0, 0, 0, 0.6)', lineBreak: 'anywhere', height: '80px', overflow: 'hidden', textOverflow: 'hidden', mt: 1 }}
          >
            {detailedPlan}
          </Typography>
        ) : (
          <Typography
            onClick={() => navigate(`/proposals/details/${id}`)}
            variant="body2"
            sx={{ color: 'rgba(0, 0, 0, 0.6)', lineBreak: 'anywhere', height: '80px', overflow: 'hidden', textOverflow: 'hidden', mt: 1 }}
          >
            No detailed Plan
          </Typography>
        )}
      </CardContent>
      {isProposalOwner ? (
        <CardActions
          sx={{
            margin: '0px',
            position: 'absolute',
            width: '100%',
            maxWidth: 'fill-available',
            justifyContent: 'space-around',
            bottom: '0px',
            padding: '0px',
          }}
        >
          {status === 'Active' ? (
            <Button sx={{ color: '#263560', width: '50px', p: 0, mb: 2 }} onClick={() => navigate(`/myProposals/${id}`)}>
              EDIT
            </Button>
          ) : (
            <>
              <Button sx={{ color: '#263560', p: 0, mb: 2 }} onClick={() => handleOpen()}>
                REMOVE
              </Button>
              <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid transparent',
                    boxShadow: 24,
                    borderRadius: 5,
                    p: 4,
                  }}
                >
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Are you sure you want to remove this proposal?
                    <br />
                    <Typography sx={{ fontWeight: 600 }}>(Warning: This cannot be undone.)</Typography>
                  </Typography>
                  <Button onClick={() => handleRemove()}>Yes</Button>
                  <Button onClick={() => handleClose()}>No</Button>
                </Box>
              </Modal>
            </>
          )}
          {status === 'Active' ? (
            <Button sx={{ color: '#263560', width: '50px', p: 0, mb: 2 }} onClick={() => handleDisable()}>
              DISABLE
            </Button>
          ) : (
            <Button sx={{ color: '#263560', p: 0, mb: 2 }} onClick={() => handleEnable()}>
              ENABLE
            </Button>
          )}
          {fstatus === 'funding-status-004' && (
            <Button sx={{ color: '#263560', width: '100px', p: 0, mb: 2 }} onClick={() => handleAddTask()}>
              Add task
            </Button>
          )}
        </CardActions>
      ) : (
        <CardActions
          sx={{
            margin: '5px',
            position: 'absolute',
            width: '100%',
            maxWidth: 'fill-available',
            justifyContent: 'space-around',
            bottom: '0px',
          }}
        >
          <Button sx={{ color: '#263560' }} onClick={() => navigate(`/proposals/details/${id}`)}>
            SEE +
          </Button>

          <Button onClick={handleOpen} sx={{ color: '#263560' }}>
            CONTACT
          </Button>
          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h5" fontWeight={700} component="h2">
                {proposedBy.username}
              </Typography>
              <TextField
                id="outlined-multiline-static"
                multiline
                rows={4}
                placeholder="Your message here"
                onChange={(evt: any) => {
                  setText(evt.target.value);
                }}
              />
              <Button
                onClick={sendMessage}
                variant="contained"
                sx={{
                  backgroundColor: 'var(--primaryBlue)',
                  marginTop: '15px',
                  width: '120px',
                  alignSelf: 'end',
                  '&:hover': { backgroundColor: 'var(--primaryBlueHover)' },
                }}
              >
                SEND
              </Button>
            </Box>
          </Modal>
          <Button onClick={handleOpenRequest} sx={{ color: '#263560' }}>
            APPLY
          </Button>
          <Modal open={openReq}>
            <Box sx={modalStyleRequest}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography id="modal-modal-title" variant="h5" fontWeight={700} component="h3">
                  {proposedBy.username}
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
              <Typography sx={{ marginTop: '20px' }}>Already decided? Send a proposal request now!</Typography>
              <Button
                onClick={handleSendRequest}
                variant="contained"
                sx={{ marginTop: '15px', alignSelf: 'center', backgroundColor: 'var(--primaryBlue)' }}
              >
                SEND REQUEST
              </Button>
            </Box>
          </Modal>
        </CardActions>
      )}
    </Paper>
  );
};

export default ProposalCardComponent;
