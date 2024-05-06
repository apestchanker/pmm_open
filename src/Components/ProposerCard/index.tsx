import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { default as MuiAvatar } from '@mui/material/Avatar';
import defaultAvatar from 'Assets/default-avatar.png';
import styled from '@mui/system/styled';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { Interest } from 'Types';
import Box from '@mui/material/Box';
import Rating from 'Components/Rating';
import { useCallback, useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import { Chip, FormHelperText, Paper, Tooltip } from '@mui/material';
import { GET_USER_ROLES } from 'Queries';

import {
  GET_USER_ID,
  CREATE_CONTRACT,
  GET_USER_PROPOSALS,
  GET_USERS,
  SEND_MESSAGE,
  CREATE_NOTIFICATION,
  CONNECT_NOTIFICATION_TO_USER,
} from 'Queries';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
interface MentorCardProps {
  mentorUsername: string;
  profile: string;
  rating?: number;
  bio: string;
  URLs: string[];
  interests: Interest[];
  id: string;
  displayAvatar?: boolean;
}
const Avatar = styled(MuiAvatar)`
  width: 40px;
  height: 40px;
`;

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

const TitleContainer = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;
const dateTime = moment();

const ProposerCardComponent = ({
  mentorUsername,
  profile,
  rating = 0,
  bio,
  URLs,
  interests,
  displayAvatar = true,
  id,
}: MentorCardProps) => {
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  //const [sendNotification] = useMutation(CREATE_AND_CONNECT_NOTIFICATION);

  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);

  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = () => setOpenSnackbar(false);
  const [openSnackbarRequest, setOpenSnackbarRequest] = useState(false);
  const handleCloseSnackbarRequest = () => setOpenSnackbarRequest(false);
  const [text, setText] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openReq, setOpenReq] = useState(false);
  const handleOpenRequest = () => setOpenReq(true);
  const handleCloseRequest = () => setOpenReq(false);
  const [userList, { data }] = useLazyQuery(GET_USERS, {
    fetchPolicy: 'network-only',
  });
  const [userIdRes, { data: userId }] = useLazyQuery(GET_USER_ID, {
    fetchPolicy: 'network-only',
  });
  const [mentorIdRes, { data: mentorId }] = useLazyQuery(GET_USER_ID, {
    fetchPolicy: 'network-only',
  });
  const [fetchProposals, { data: dataP }] = useLazyQuery(GET_USER_PROPOSALS, {
    fetchPolicy: 'network-only',
  });
  const { username } = useNetworkAuth();
  const { data: userLabelsData } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });
  const [isMentor, setIsMentor] = useState(false);
  const [isProposer, setIsProposer] = useState(false);
  const userRoles = userLabelsData?.User[0]?.roles;

  React.useEffect(() => {
    if (userRoles) {
      userRoles.forEach((role: any) => {
        if (role.name === 'Mentor') {
          setIsMentor(true);
        }
        if (role.name === 'Proposer') {
          setIsProposer(true);
        }
      });
    }
  }, [userLabelsData]);
  const [createContractMutation] = useMutation(CREATE_CONTRACT);
  React.useEffect(() => {
    userList();
    userIdRes({ variables: { username } });
    mentorIdRes({ variables: { username: mentorUsername } });
    fetchProposals({ variables: { username } });
  }, [userList, fetchProposals, userIdRes, mentorIdRes, mentorUsername]);
  const [selectedUser, setSelectedUser] = React.useState('');
  const [selectedProposal, setSelectedProposal] = React.useState('');
  const [selectedUserId, setSelectedUserId] = React.useState('');
  const [selectedProposalId, setSelectedProposalId] = React.useState('');
  const [userToSendContract, setUserToSendContract] = React.useState('');
  const [mentorToSendContract, setMentorToSendContract] = React.useState('');

  const proposalListing = dataP?.Proposal;

  const closeModalRequest = () => {
    handleCloseRequest();
  };
  const messageSent = () => {
    handleClose();
  };
  React.useEffect(() => {
    selectedUser;
    selectedProposalId;
    selectedProposal;
    setUserToSendContract(userId?.User[0]?.id);
    setMentorToSendContract(mentorId?.User[0]?.id);
    userToSendContract;
    mentorToSendContract;
  }, [selectedUser, selectedProposalId, selectedProposal, setUserToSendContract, userToSendContract, setMentorToSendContract]);

  const { data: userIdData } = useQuery(GET_USER_ID, {
    variables: {
      username: mentorUsername,
    },
  });

  const myuuid = uuidv4();
  const Name = () => {
    return (
      <Typography
        sx={{
          lineHeight: '24px',
          fontSize: '18px',
          fontWeight: 700,
          marginLeft: displayAvatar ? '5px' : null,
          lineBreak: 'anywhere',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '180px',
        }}
      >
        {mentorUsername}
      </Typography>
    );
  };
  const Profile = () => {
    return (
      <Typography
        sx={{
          lineHeight: '24px',
          fontSize: '16px',
          fontWeight: 400,
          marginLeft: displayAvatar ? '5px' : null,
          lineBreak: 'anywhere',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '180px',
        }}
      >
        {profile}
      </Typography>
    );
  };
  const RatingComp = () => {
    return rating ? (
      <Box
        sx={{
          marginLeft: displayAvatar ? '5px' : null,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Rating rating={rating} />
      </Box>
    ) : (
      <Typography sx={{ ml: '5px', color: '#767676' }}>Not rated yet</Typography>
    );
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
          userBy: userId?.User[0]?.id,
          userTo: mentorId?.User[0]?.id,
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
          userID: userIdData?.User[0].id,
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
          userID: userIdData?.User[0].id,
          notificationID: uniqueId,
        },
      });

      handleClose();
      messageSent();
      return true;
    } catch (err) {
      //
      handleClose();
      // Swal.fire({
      //   title: 'Error!',
      //   text: 'Something went wrong',
      //   icon: 'error',
      //   confirmButtonText: 'OK',
      // });
      console.error(err);
      return false;
    }
  }, [mentorUsername, username, sendMessageMutation, text]);

  const createContract = useCallback(async (): Promise<boolean> => {
    try {
      const contractId = uuidv4();
      const date = moment();
      const { data } = await createContractMutation({
        variables: {
          data: {
            id: contractId,
            terms: 'PENDING',
            status: 'PENDING',
            isMentorApprover: false,
            date: { formatted: date },
          },
          proposalId: selectedProposalId,
          mentorId: mentorId?.User[0]?.id,
          proposerId: userId?.User[0]?.id,
          contractId: contractId,
        },
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
          userID: userIdData?.User[0].id,
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
          userID: userIdData?.User[0].id,
          notificationID: uniqueId,
        },
      });
      // NOTIFICATION MUTATION END
      handleClose();
      Swal.fire({
        title: 'Request Sent!',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
      return true;
    } catch (err) {
      //
      handleClose();
      Swal.fire({
        title: 'Error!',
        text: 'Select your proposal to apply!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error(err);
      return false;
    }
  }, [username, createContractMutation, selectedUserId, userToSendContract, selectedProposalId]);

  const mentorForContract = userId?.User[0]?.id;

  const createMentorProposerContract = useCallback(async (): Promise<boolean> => {
    try {
      const contractId = uuidv4();
      const date = moment();
      const { data } = await createContractMutation({
        variables: {
          data: {
            id: contractId,
            terms: 'PENDING',
            status: 'PENDING',
            isMentorApprover: false,
            date: { formatted: date },
          },
          proposalId: 'mentor-proposer-contract',
          mentorId: mentorForContract,
          proposerId: userIdData?.User[0]?.id,
          contractId: contractId,
        },
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
          userID: userIdData?.User[0].id,
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
          userID: userIdData?.User[0].id,
          notificationID: uniqueId,
        },
      });
      // NOTIFICATION MUTATION END
      handleClose();
      Swal.fire({
        title: 'Request Sent!',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
      return true;
    } catch (err) {
      //
      handleClose();
      Swal.fire({
        title: 'Error!',
        text: 'Select your proposal to apply!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error(err);
      return false;
    }
  }, [username, createContractMutation, selectedUserId, userToSendContract, selectedProposalId, mentorId, userId, userIdData]);

  function handleSendRequest() {
    createContract();
    handleCloseRequest();
    return;
  }
  function handleSendMentorProposerRequest() {
    createMentorProposerContract();
    handleCloseRequest();
    return;
  }
  const router = useNavigate();
  return (
    <Paper elevation={3} sx={{ width: 'auto', height: '300px', maxWidth: '285px', margin: '5px 0', padding: 0, cursor: 'pointer' }}>
      <CardContent sx={{ padding: '14px 14px 0px 14px', position: 'relative', height: '100%' }}>
        <TitleContainer>
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            {displayAvatar && (
              <Avatar
                src={mentorId?.User[0]?.picurl}
                sx={{
                  width: '66px',
                  height: '66px',
                }}
              />
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Name />
              <Profile />
              <RatingComp />
            </Box>
          </Box>
          {/* <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', marginTop: '0px' }}>
            <ShareIcon sx={{ width: '25px', height: '25px', marginRight: '25px', color: 'rgba(0, 0, 0, 0.6)' }} />
            <CancelIcon sx={{ width: '25px', height: '25px', color: 'rgba(0, 0, 0, 0.6)' }} />
          </Box> */}
        </TitleContainer>
        <Typography
          onClick={() => router(`/users/${id}`)}
          variant="body2"
          sx={{
            color: 'rgba(0, 0, 0, 0.6)',
            height: '80px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            lineBreak: 'auto',
            maxHeight: '80px',
            whiteSpace: 'wrap',
            maxWidth: '250px',
            mt: '10px',
          }}
        >
          {bio || 'No bio provided'}
        </Typography>
        {URLs?.length > 0 ? (
          <Tooltip title={URLs[0]} placement="top">
            <Typography
              sx={{
                display: 'flex',
                marginBottom: '4px',
              }}
            >
              URL:{' '}
              <a
                style={{
                  color: 'var(--linkBlue)',
                  maxWidth: '200px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  marginLeft: '4px',
                  maxHeight: '23px',
                }}
                href={URLs[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {URLs[0]}
              </a>
            </Typography>
          </Tooltip>
        ) : (
          <Box sx={{ height: ' 28px' }}></Box>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
          {interests.slice(0, 2).map((interest) => (
            <Chip
              sx={{
                marginRight: '4px',
                color: 'white',
                backgroundColor: 'var(--primaryBlue)',
              }}
              key={`${interest.name}-${mentorUsername}`}
              label={interest.name}
            />
          ))}
        </Box>
        <CardActions
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute',
            bottom: '35px',
            width: '80%',
          }}
        >
          <Button sx={{ color: 'var(--primaryBlue)', fontSize: '14px' }} onClick={() => router(`/users/${id}`)}>
            SEE +
          </Button>
          <Button onClick={handleOpen} sx={{ color: 'var(--primaryBlue)', fontSize: '14px' }}>
            CONTACT
          </Button>
        </CardActions>
        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h5" fontWeight={700} component="h2" mb={2}>
              {mentorUsername}
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
        {isProposer && !isMentor && (
          <Modal open={openReq}>
            <Box sx={modalStyleRequest}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography id="modal-modal-title" variant="h5" component="h3" sx={{ fontWeight: 700 }}>
                  {mentorUsername}
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
              <Typography>{profile}</Typography>
              <Typography sx={{ marginTop: '20px' }}>Already decided? Send a proposal request now!</Typography>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Typography>Proposal</Typography>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={proposalListing}
                    sx={{ width: '100%' }}
                    value={dataP?.id}
                    onChange={(event, newSelectedPropId) => {
                      setSelectedProposalId(newSelectedPropId.id);
                    }}
                    getOptionLabel={(dataP: any) => dataP?.title}
                    renderInput={(params) => <TextField {...params} />}
                    onInputChange={(event, newSelectedProposal) => {
                      setSelectedProposal(newSelectedProposal);
                    }}
                  />
                  {selectedProposalId === null && <FormHelperText>Required</FormHelperText>}
                </FormControl>
              </Box>
              <Button
                onClick={handleSendRequest}
                variant="contained"
                sx={{ marginTop: '15px', width: '100%', alignSelf: 'center', backgroundColor: 'var(--primaryBlue)' }}
              >
                SEND REQUEST
              </Button>
            </Box>
          </Modal>
        )}
        {isMentor && !isProposer && (
          <Modal open={openReq}>
            <Box sx={modalStyleRequest}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography id="modal-modal-title" variant="h5" component="h3" sx={{ fontWeight: 700 }}>
                  {mentorUsername}
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
              <Typography>{profile}</Typography>
              <Typography sx={{ marginTop: '20px' }}>Already decided? Send a request now!</Typography>
              <Button
                onClick={handleSendMentorProposerRequest}
                variant="contained"
                sx={{ marginTop: '15px', width: '100%', alignSelf: 'center', backgroundColor: 'var(--primaryBlue)' }}
              >
                SEND REQUEST
              </Button>
            </Box>
          </Modal>
        )}
        {isProposer && isMentor && (
          <Modal open={openReq}>
            <Box sx={modalStyleRequest}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography id="modal-modal-title" variant="h5" component="h3" sx={{ fontWeight: 700 }}>
                  {mentorUsername}
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
              <Typography>{profile}</Typography>
              <Typography sx={{ marginTop: '20px' }}>Already decided? Send a request now!</Typography>
              <Button
                onClick={handleSendMentorProposerRequest}
                variant="contained"
                sx={{ marginTop: '15px', width: '100%', alignSelf: 'center', backgroundColor: 'var(--primaryBlue)' }}
              >
                SEND REQUEST
              </Button>
            </Box>
          </Modal>
        )}
        <Snackbar open={openSnackbarRequest} autoHideDuration={6000} onClose={handleCloseSnackbarRequest} message="Request Sent" />
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Message Sent" />
      </CardContent>
    </Paper>
  );
};

export default ProposerCardComponent;
