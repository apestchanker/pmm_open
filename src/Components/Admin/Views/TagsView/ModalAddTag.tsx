import React from 'react';
import { ADD_INTEREST } from 'Queries/adminQueries';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
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
  width: '20%',
  maxWidth: '700px',
  maxHeight: '100%',
};

interface State {
  id: string;
  name: string;
  isActive: boolean;
}

const ModalAddTag = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [uniqueId, setUniqueId] = React.useState(uuidv4());
  const [values, setValues] = React.useState<State>({
    id: uniqueId,
    name: '',
    isActive: true,
  });

  const handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUniqueId(uuidv4());
    setValues({ ...values, [name]: event.target.value, id: uniqueId });
  };

  const [addInterest, { error }] = useMutation(ADD_INTEREST, {
    variables: {
      data: {
        id: values.id,
        name: values.name,
        isActive: true,
      },
    },
  });

  const handleAddInterest = () => {
    if (!error) {
      addInterest();
      handleClose();
      Swal.fire({
        title: 'Interest Tag Added',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

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
            New Interest Tag
          </Typography>
          <TextField placeholder="Tag Name" required onChange={handleChange('name')} sx={{ m: 2 }}></TextField>
          <Button sx={{ width: '75px', bgcolor: 'rgba(38, 53, 96, 1)', mt: 2 }} variant="contained" onClick={handleAddInterest}>
            ADD
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ModalAddTag;
