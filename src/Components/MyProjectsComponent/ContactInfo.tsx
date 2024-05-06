import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPDATE_CONTRACT_TERMS } from 'Queries';
import ContractsTemplates from './ContractsTemplates';
import Swal from 'sweetalert2';

interface State {
  name: string;
  proposalName: string;
  status: string;
  relationship: string;
  agreementText: string;
  contractID: string;
  handleClose: () => void;
}

function ContactInfo({ name, proposalName, status, relationship, agreementText, contractID, handleClose }: State) {
  // CHILD MODAL
  const [open, setOpen] = React.useState(false);

  const [showTemplates, setShowTemplates] = React.useState(false);

  let userRole: string;
  if (relationship === 'Mentor') {
    userRole = 'Proposer';
  }
  if (relationship === 'Proposer') {
    userRole = 'Mentor';
  } else relationship === 'Collaborator';
  {
    userRole = 'Proposer';
  }

  const handleChildModalClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  ///
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [agreementState, setAgreementState] = React.useState(agreementText || '');
  const navigate = useNavigate();

  const [updateTerms] = useMutation(UPDATE_CONTRACT_TERMS);

  const closeModal = () => {
    handleClose();
    setIsDisabled(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAgreementState(event.target.value);
  };

  const handleSubmit = () => {
    updateTerms({
      variables: {
        newTerms: agreementState,
        contractID: contractID,
      },
    });
    Swal.fire({
      title: 'Agreement Updated',
      icon: 'success',
      showCloseButton: false,
      confirmButtonText: 'Ok',
      didDestroy: () => {
        return navigate('/projects');
      },
    });
    setIsDisabled(true);
    handleClose();
  };

  return (
    <Box
      sx={{
        backgroundColor: 'var(--bgGray)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        borderRadius: '7px',
        width: { xs: '80%', md: '50%' },
      }}
    >
      <Box className="name" sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>{name}</Typography>
        <IconButton>
          <CloseIcon sx={{ background: 'var(--textDark)', color: 'white', borderRadius: '50%' }} onClick={() => closeModal()} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
        <Box sx={{ flexDirection: 'column' }}>
          <Typography sx={{ fontSize: '14px' }}>Project: {proposalName}</Typography>
          <Typography sx={{ fontSize: '14px' }}>Status: {status}</Typography>
          <Typography sx={{ fontSize: '14px', paddingBottom: '12px' }}>Relationship: {relationship}</Typography>
          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', paddingBottom: '12px' }}>Agreement</Typography>
        </Box>
        {isDisabled ? (
          <Button sx={{ color: 'var(--primaryBlue)' }} startIcon={<AddIcon />} onClick={() => setShowTemplates(true)}>
            <Typography>Add</Typography>
          </Button>
        ) : (
          <Button
            sx={{ color: 'var(--primaryBlue)' }}
            onClick={() => {
              setShowTemplates(false);
              setIsDisabled(true);
            }}
          >
            <Typography>Cancel</Typography>
          </Button>
        )}
      </Box>
      <Box>
        {!showTemplates ? (
          <TextField
            placeholder="..."
            style={{ width: '100%', backgroundColor: isDisabled ? 'var(--inactiveGray)' : 'white', border: 'transparent' }}
            multiline
            rows="7"
            value={agreementState}
            onChange={handleChange}
            disabled={isDisabled}
          />
        ) : (
          <ContractsTemplates setAgreementText={setAgreementState} setIsDisabled={setIsDisabled} setShowTemplates={setShowTemplates} />
        )}
        {!isDisabled && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'var(--primaryBlue)',
                '&:hover': { backgroundColor: 'var(--primaryBlueHover)' },
                marginTop: '10px',
                padding: '5px 35px',
              }}
              onClick={handleSubmit}
            >
              SAVE
            </Button>
          </Box>
        )}
      </Box>
      <Box></Box>
    </Box>
  );
}

export default ContactInfo;
