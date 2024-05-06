import React from 'react';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { useMutation } from '@apollo/client';
import { CONNECT_NOTIFICATION_TO_ALL_USERS, CREATE_NOTIFICATION } from 'Queries';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import Swal from 'sweetalert2';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '7px',
  boxShadow: 24,
  p: 4,
};

function Notifications() {
  const uniqueId = uuid();
  const date = moment();
  const [message, setMessage] = React.useState('');

  const [open, setOpen] = React.useState(false);

  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_ALL_USERS);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (message.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a message',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    await createNotification({
      variables: {
        id: uniqueId,
        message: message,
        date: { formatted: date },
        link: `#`,
      },
    });
    const res = await connectNotification({
      variables: {
        notificationID: uniqueId,
      },
    });

    if (res) {
      Swal.fire({
        title: 'Notification Sent!',
        icon: 'success',
      });
      setMessage('');
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }

    setOpen(false);
  };
  return (
    <Box
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        marginTop: '20px',
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: 'fit-content', display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h5"
          sx={{
            marginBottom: '20px',
          }}
        >
          Notify all users
        </Typography>
        <Typography>Message</Typography>
        <TextField multiline type="text" size="medium" value={message} onChange={handleChange} />
        <Button variant="contained" sx={{ bgcolor: 'rgba(38, 53, 96, 1)', mt: '15px' }} fullWidth onClick={() => setOpen(true)}>
          Submit
        </Button>
      </form>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography variant="body1">You&apos;re about to send a notification to all users. Are you sure you want to continue?</Typography>
          <Box
            sx={{
              display: 'flex',
              marginTop: '20px',
            }}
          >
            <Button variant="contained" color="error" fullWidth onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button sx={{ marginLeft: '15px' }} onClick={(e) => handleSubmit(e)} variant="contained" fullWidth>
              Continue
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Notifications;
