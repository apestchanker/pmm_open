import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// import { ADD_USER } from 'Queries/adminQueries';
import { Box, Button, Checkbox, FormControl, FormControlLabel, Modal, TextField, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const style = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'rgba(229, 229, 229, 1)',
  borderRadius: '10px',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
  width: '450px',
  maxHeight: '100%',
};

interface State {
  id: string;
  username: string;
  email: string;
  roles: string;
}

const ModalAddUser = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [uniqueId, setUniqueId] = React.useState(uuidv4());
  const [values, setValues] = React.useState<State>({
    id: uniqueId,
    username: '',
    email: '',
    roles: '',
  });
  const handleChange = (username: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUniqueId(uuidv4());
    setValues({ ...values, [username]: event.target.value, id: uniqueId });
  };
  // const [addUser, { error }] = useMutation(ADD_USER, {
  //   variables: {
  //     data: {
  //       id: values.id,
  //       username: values.username,
  //       email: values.email,
  //       roles: values.roles,
  //     },
  //   },
  // });

  // const handleAddUser = () => {
  //   if (!error) {
  //     addUser();
  //     handleClose();
  //     Swal.fire({
  //       title: 'User Added',
  //       icon: 'success',
  //       showCloseButton: true,
  //       confirmButtonText: 'Ok',
  //     });
  //   }
  // };
  return (
    <>
      <AddCircleIcon
        sx={{
          cursor: 'pointer',
          width: '50px',
          height: '50px',
          color: 'var(--primaryBlue)',
          mb: 3,
        }}
        onClick={handleOpen}
      />
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            User
          </Typography>
          <TextField placeholder="User Name" required onChange={handleChange('username')} sx={{ m: 2, width: '90%' }}></TextField>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Email
          </Typography>
          <TextField placeholder="email" required onChange={handleChange('email')} sx={{ m: 2, width: '90%' }}></TextField>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Role
          </Typography>
          <FormControl fullWidth sx={{ borderRadius: '4px', mb: 2 }} className={'profile-type'}>
            <FormControl
              component="fieldset"
              sx={{ width: '100%', flexDirection: 'Row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <FormControlLabel control={<Checkbox inputProps={{ 'aria-label': 'role-mentor' }} />} label="Mentor" value={'role-mentor'} />
              <FormControlLabel
                control={<Checkbox inputProps={{ 'aria-label': 'role-proposer' }} />}
                label="Proposer"
                value={'role-proposer'}
              />
              <FormControlLabel
                control={<Checkbox inputProps={{ 'aria-label': 'role-collaborator' }} />}
                label="Collaborator"
                value={'role-collaborator'}
              />
              <FormControlLabel control={<Checkbox inputProps={{ 'aria-label': 'role-admin' }} />} label="Admin" value={'role-admin'} />
            </FormControl>
          </FormControl>
          <Button sx={{ width: '150px', bgcolor: 'rgba(38, 53, 96, 1)', mt: 2 }} variant="contained">
            CREATE USER
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ModalAddUser;
