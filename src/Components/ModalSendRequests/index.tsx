import * as React from 'react';
import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import Autocomplete from '@mui/material/Autocomplete';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  GET_USER_ID,
  CREATE_CONTRACT,
  GET_USER_ROLES,
  GET_USER_PROPOSALS,
  GET_USERS,
  CREATE_NOTIFICATION,
  CONNECT_NOTIFICATION_TO_USER,
} from 'Queries';
import { FormHelperText, InputLabel } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import Swal from 'sweetalert2';
import { usePrompt } from 'Hooks/blockingHooks';

const style = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalSendRequests() {
  const { username } = useNetworkAuth();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [age, setAge] = React.useState('');
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [isProposer, setIsProposer] = React.useState(false);
  const { data: userLabelsData, loading: labelsLoading } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });
  const [isDataChanged, setDataChanged] = React.useState(false);

  const userRoles = userLabelsData?.User[0]?.roles;
  React.useEffect(() => {
    if (userRoles) {
      userRoles.forEach((role: any) => {
        if (role?.name?.includes('Proposer')) {
          setIsProposer(true);
        }
      });
    }
  });

  const [userList, { data, loading, error }] = useLazyQuery(GET_USERS, { fetchPolicy: 'network-only' });
  const [userIdRes, { data: userId }] = useLazyQuery(GET_USER_ID, { fetchPolicy: 'network-only' });
  const [fetchProposals, { data: dataP, loading: loadingP, error: errorP }] = useLazyQuery(GET_USER_PROPOSALS, {
    fetchPolicy: 'network-only',
  });

  const [createContractMutation] = useMutation(CREATE_CONTRACT);

  React.useEffect(() => {
    userList();
    userIdRes({ variables: { username } });
    fetchProposals({ variables: { username } });
  }, [userList, fetchProposals, userIdRes]);

  const userListing = data?.User;
  const proposalListing = dataP?.Proposal;

  const handleChange = (event: SelectChangeEvent) => {
    setDataChanged(true);
    setAge(event.target.value as string);
  };

  const closeModal = () => {
    usePrompt('There are Some Unsaved Changes. Are you sure you want to leave?', isDataChanged);
    handleClose();
    setIsDisabled(true);
  };

  const [selectedUser, setSelectedUser] = React.useState('');
  const [selectedProposal, setSelectedProposal] = React.useState('');
  const [selectedUserId, setSelectedUserId] = React.useState('');
  const [selectedProposalId, setSelectedProposalId] = React.useState('');
  const [userToSendContract, setUserToSendContract] = React.useState('');

  //const [sendNotification] = useMutation(CREATE_AND_CONNECT_NOTIFICATION);
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);

  React.useEffect(() => {
    selectedUser;
    selectedProposalId;
    selectedProposal;
    setUserToSendContract(userId?.User[0]?.id);
    userToSendContract;
  }, [selectedUser, selectedProposalId, selectedProposal, setUserToSendContract, userToSendContract]);

  const contractId = uuidv4();
  const contractDate = moment();

  const createContract = useCallback(async (): Promise<boolean> => {
    try {
      await createContractMutation({
        variables: {
          data: {
            id: contractId,
            terms: 'PENDING',
            status: 'PENDING',
            isMentorApprover: true,
            date: { formatted: contractDate },
          },
          proposalId: selectedProposalId,
          mentorId: selectedUserId,
          proposerId: userId.User[0].id,
          contractId: contractId,
        },
      });
      // NOTIFICATION MUTATION
      const uniqueId = uuidv4();
      const date = moment();
      /* sendNotification({
        variables: {
          id: uniqueId,
          read: false,
          message: `${username} sent you a request.`,
          date: date,
          link: `/projects`,
          userID: selectedUserId,
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
          userID: selectedUserId,
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
        text: 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error(err);
      return false;
    }
  }, [username, createContractMutation, selectedUserId, userToSendContract, selectedProposalId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      {isProposer && (
        <AddCircleIcon sx={{ cursor: 'pointer', width: '50px', height: '50px', color: 'var(--primaryBlue)', mb: 3 }} onClick={handleOpen} />
      )}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Box
            sx={{
              cursor: 'pointer',
              background: 'white',
              color: 'var(--textDark)',
              borderRadius: '50%',
              alignSelf: 'end',
            }}
          >
            <CancelRoundedIcon onClick={handleClose} />
          </Box>
          <FormControl sx={{ display: 'flex' }}>
            <RadioGroup
              sx={{ flexDirection: 'column' }}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue="user"
            >
              <FormControlLabel value="user" control={<Radio />} label="User" />
              <Box sx={{ flexDirection: 'row', width: '100%' }}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={userListing || []}
                  value={data?.id}
                  onChange={(event, newSelectedId) => {
                    setSelectedUserId(newSelectedId.id);
                    setDataChanged(true);
                  }}
                  sx={{ width: '100%' }}
                  getOptionLabel={(data: any) => data?.username}
                  renderInput={(params) => <TextField {...params} />}
                  onInputChange={(event, newSelectedUser) => {
                    setSelectedUser(newSelectedUser);
                  }}
                />
                {selectedUser === '' && <FormHelperText>Required</FormHelperText>}
              </Box>
              <FormControlLabel value="Email" control={<Radio />} label="Email (external invitation)" />
              <TextField id="outlined-basic" variant="outlined" />
            </RadioGroup>
          </FormControl>
          <Box sx={{ minWidth: 120, marginBottom: '20px', mt: 2 }}>
            <Typography>Relationship</Typography>
            <FormControl sx={{ width: '100%' }} disabled>
              <InputLabel id="demo-simple-select-disabled-label">MENTOR</InputLabel>
              <Select
                labelId="demo-simple-select-disabled-label"
                id="demo-simple-select-disabled"
                value={age}
                label="MENTOR"
                onChange={handleChange}
              ></Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Typography>Proposal</Typography>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={proposalListing || []}
                sx={{ width: '100%' }}
                value={dataP?.id}
                onChange={(event, newSelectedPropId) => {
                  setSelectedProposalId(newSelectedPropId.id);
                  setDataChanged(true);
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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
            <Button
              variant="contained"
              sx={{ width: '100%', backgroundColor: 'var(--primaryBlue)' }}
              onClick={createContract}
              disabled={!selectedUserId || !selectedProposalId}
            >
              SEND REQUEST
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
