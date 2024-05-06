import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Grid } from '@mui/material';
import { DELETE_MESSAGES } from 'Queries';
import { useMutation } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import Swal from 'sweetalert2';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

interface props {
  sentBy: string;
  sentTo: string;
}

export default function ModalDelete({ sentBy, sentTo }: props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const closeModal = () => {
    handleClose();
  };
  const [deleteMessagesMutation] = useMutation(DELETE_MESSAGES);
  const { username } = useNetworkAuth();
  const deleteMessage = React.useCallback(async () => {
    try {
      await deleteMessagesMutation({
        variables: {
          where: {
            sentTo: {
              username: sentTo,
            },
            AND: {
              sentBy: {
                username: sentBy,
              },
            },
          },
        },
      });
      await deleteMessagesMutation({
        variables: {
          where: {
            sentBy: {
              username: sentTo,
            },
            AND: {
              sentTo: {
                username: sentBy,
              },
            },
          },
        },
      });
      handleClose();
      Swal.fire({
        title: 'Messages Deleted',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
      return true;
    } catch (err) {
      handleClose();
      console.error(err);
      return false;
    }
  }, [username, sentBy, sentTo]);

  return (
    <div>
      <DeleteOutlinedIcon fontSize="medium" onClick={handleOpen}>
        Open modal
      </DeleteOutlinedIcon>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
            <CloseIcon
              sx={{ background: 'var(--textDark)', color: 'white', borderRadius: '50%', cursor: 'pointer', alignSelf: 'end' }}
              onClick={() => closeModal()}
            />
          </Grid>
          <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography id="modal-modal-title" sx={{ fontSize: '20px', p: 2 }}>
              Are you sure you want to delete this message?
            </Typography>
            <Button sx={{ bgcolor: '#263560', width: '50%' }} variant="contained" onClick={deleteMessage}>
              DELETE
            </Button>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
