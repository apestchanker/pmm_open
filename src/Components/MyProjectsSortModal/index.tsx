import { Button, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const MyProjectsSortModal = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button startIcon={<ImportExportOutlinedIcon />} sx={{ color: 'var(--primaryBlue)' }} onClick={handleOpen}>
        <Typography sx={{ textTransform: 'none', fontSize: '16px' }}>Sort By</Typography>
      </Button>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'right', marginBottom: '10px' }}>
            <CloseIcon
              sx={{ background: 'var(--textDark)', color: 'white', borderRadius: '50%', cursor: 'pointer' }}
              onClick={handleClose}
            />
          </Box>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Newest to Oldest" />
            <FormControlLabel control={<Checkbox />} label="Oldest to Newest" />
            <FormControlLabel control={<Checkbox />} label="From A to Z" />
            <FormControlLabel control={<Checkbox />} label="From Z to A" />
          </FormGroup>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: '20px' }}>
            <Button sx={{ bgcolor: '#263560' }} variant="contained">
              Sort
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default MyProjectsSortModal;
