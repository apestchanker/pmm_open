import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};
interface NoResultsProps {
  open: boolean;
  handleClose: () => void;
}
const NoResultsModal = ({ open, handleClose }: NoResultsProps) => {
  return (
    <div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Mmm... Try again!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            No results were found for you request, try another words or topics related to what you´re looking for.
          </Typography>
          <Button onClick={handleClose} variant="contained" sx={{ mt: 5, bgcolor: '#263560' }}>
            Got it!
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default NoResultsModal;
