import React from 'react';
import { ADD_CHALLENGE } from 'Queries/adminQueries';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Button, Modal, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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
  marginRight: '25px',
};

interface State {
  id: string;
  //   fund: number;
  //   title: string;
  isActive: boolean;
}

const ModalAddTemplate = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [uniqueId, setUniqueId] = React.useState(uuidv4());
  const [values, setValues] = React.useState<State>({
    id: uniqueId,
    // fund: Number(0),
    // title: '',
    isActive: true,
  });

  //   const handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setUniqueId(uuidv4());
  //     setValues({ ...values, [name]: event.target.value, id: uniqueId });
  //   };

  const [addTemplate, { error }] = useMutation(ADD_CHALLENGE, {
    variables: {
      data: {
        id: values.id,
        // fund: Number(values.fund),
        // title: values.title,
        isActive: true,
      },
    },
  });
  const navigate = useNavigate();
  const handleAddTemplate = async () => {
    if (!error) {
      await addTemplate();
      handleClose();
      Swal.fire({
        title: 'Template Added',
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
            New Template
          </Typography>
          {/* <TextField placeholder="Fund" type="number" required onChange={handleChange('fund')} sx={{ m: 2 }}></TextField>
          <TextField placeholder="Title" required onChange={handleChange('title')} sx={{ m: 2 }}></TextField> */}
          <Button
            sx={{ width: '150px', bgcolor: 'rgba(38, 53, 96, 1)', mt: 2 }}
            variant="contained"
            onClick={() => {
              navigate('/admin/templates/proposal');
            }}
          >
            Proposal
          </Button>
          <Button
            sx={{ width: '150px', bgcolor: 'rgba(38, 53, 96, 1)', mt: 2 }}
            variant="contained"
            onClick={() => {
              navigate('/admin/templates/agreement');
            }}
          >
            Agreement
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ModalAddTemplate;
