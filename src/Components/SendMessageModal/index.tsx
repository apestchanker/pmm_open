import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Button, IconButton, Modal, TextField, Tooltip, Typography } from '@mui/material';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import React, { useCallback, useState } from 'react';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { GET_USER_ID } from 'Queries';

const SEND_MESSAGE = gql`
  mutation ($data: _MessageCreate!, $userBy: ID, $userTo: ID, $messageId: ID) {
    CreateMessage(data: $data) {
      id
    }
    AddMessageSentBy(from: { id: $userBy }, to: { id: $messageId }) {
      to {
        id
      }
    }
    AddMessageSentTo(from: { id: $messageId }, to: { id: $userTo }) {
      to {
        id
      }
    }
  }
`;

function SendMessageModal(toUser: any) {
  const myuuid = uuidv4();
  const dateTime = moment();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [text, setText] = useState('');
  const { username } = useNetworkAuth();
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const { data: userId } = useQuery(GET_USER_ID, { variables: { username: username } });
  const { data: otherUserId } = useQuery(GET_USER_ID, { variables: { username: toUser.toUser } });

  const modalStyle = {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '330px',
    height: '208px',
    bgcolor: 'white',
    borderRadius: '10px',
    padding: '15px',
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
        // variables: { input: [{ fromUsername: username, toUsername: toUser.toUser, text, read: false }] },
        variables: {
          data: {
            id: myuuid,
            on: { formatted: dateTime },
            text: text,
            read: false,
          },
          userBy: userId.User[0].id,
          userTo: otherUserId.User[0].id,
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
      handleClose();
      return true;
    } catch (err) {
      //
      handleClose();
      console.error(err);
      return false;
    }
  }, [username, sendMessageMutation, text]);
  return (
    <>
      <Tooltip title="Send Message">
        <IconButton onClick={handleOpen}>
          <MailOutlineIcon />
        </IconButton>
      </Tooltip>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {toUser?.toUser}
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
    </>
  );
}

export default SendMessageModal;
