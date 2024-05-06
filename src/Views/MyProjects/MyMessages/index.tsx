import React, { useState, useEffect, useCallback, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Button, TextField, Fab } from '@mui/material';
import ReturnButton from 'Components/ReturnButton/ReturnButton';
import Divider from '@mui/material/Divider';
import ReceivedMessage from './ReceivedMessage';
import SentMessage from './SentMessage';
import {
  CONNECT_NOTIFICATION_TO_USER,
  CREATE_AND_CONNECT_NOTIFICATION,
  CREATE_NOTIFICATION,
  GET_ALL_USER_MESSAGES,
  GET_USER_ID,
  SEND_MESSAGE,
} from 'Queries';
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { Message } from 'Types';
import { DateTime } from 'luxon';
import Box from '@mui/material/Box';
import Style from './MyMessages.module.css';
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useOnScreen from 'Hooks/useOnScreen';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

type MyMessagesParams = {
  username: string;
};

export default function MyMessages(): JSX.Element {
  const { username } = useNetworkAuth();
  const { username: otherUser } = useParams<MyMessagesParams>();
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
  //const [sendNotification] = useMutation(CREATE_AND_CONNECT_NOTIFICATION);
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);

  const { data: userIdData } = useQuery(GET_USER_ID, {
    variables: {
      username: otherUser,
    },
  });
  const { data: userId } = useQuery(GET_USER_ID, {
    variables: {
      username: username,
    },
  });
  const { data: messagesData, refetch } = useQuery(GET_ALL_USER_MESSAGES, {
    pollInterval: 2000,
    variables: {
      username: username,
      otherUser: otherUser,
    },
  });
  const messagesEndRef: any = useRef(null);
  const isScrolledToBottom = useOnScreen(messagesEndRef);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messagesData]);
  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
  }, []);
  useEffect(() => {
    if (messagesData?.Message?.length) {
      setMessages(messagesData.Message as Message[]);
    }
  }, [messagesData]);
  const [text, setText] = useState('');
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  const myuuid = uuidv4();
  const dateTime = moment();
  const [sendingMsg, setSendingMsg] = useState(false);
  const sendMessage = useCallback(
    async (e: any): Promise<boolean> => {
      e.preventDefault();
      try {
        if (!text) {
          return false;
        }
        setSendingMsg(true);
        await sendMessageMutation({
          variables: {
            data: {
              id: myuuid,
              on: { formatted: dateTime },
              text: text,
              read: false,
            },
            userBy: userId.User[0].id,
            userTo: userIdData?.User[0].id,
            messageId: myuuid,
          },
        });
        setText('');
        setSendingMsg(false);
        const uniqueId = uuidv4();
        const date = new Date();
        /* sendNotification({
          variables: {
            id: uniqueId,
            read: false,
            message: `${username} sent you a message.`,
            date: date,
            link: `/projects/myMessages/${username}`,
            userID: userIdData?.users[0].id,
          },
        }); */
        await createNotification({
          variables: {
            id: uniqueId,
            message: `${username} sent you a message.`,
            date: { formatted: date },
            link: `/projects/myMessages/${username}`,
          },
        });
        await connectNotification({
          variables: {
            userID: userIdData?.User[0].id,
            notificationID: uniqueId,
          },
        });
        return true;
      } catch (err) {
        //
        setSendingMsg(false);
        console.error(err);
        return false;
      }
    },
    [otherUser, username, sendMessageMutation, text],
  );
  return (
    <Box sx={{ width: '80%', margin: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <ReturnButton />
        <Box sx={{ border: '1px solid black', borderRadius: '5px', pt: 3, width: '100%', overflowY: 'hidden', position: 'relative' }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 'bold', width: '100%', lineHeight: '16px', textAlign: 'center', mb: 3 }}>
            {otherUser}
          </Typography>
          <Divider />
          <Box sx={{ position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)', zIndex: '5' }}>
            <Fab
              onClick={scrollToBottom}
              sx={{
                transition: 'all 0.2s ease-in-out',
                transform: isScrolledToBottom ? 'scale(0)' : 'scale(1) translateY(30%)',
                opacity: isScrolledToBottom ? 0 : 1,
                color: 'white',
                backgroundColor: 'var(--primaryBlue)',
                '&:hover': {
                  backgroundColor: 'var(--primaryBlue)',
                },
              }}
            >
              <KeyboardArrowDownIcon fontSize="large" />
            </Fab>
          </Box>
          <Box
            id={Style.messageBox}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '60vh',
              overflowY: 'auto',
              p: 1,
            }}
          >
            {messages.map((m, i) => {
              if (m.sentTo.username === username) {
                return (
                  <Box key={i}>
                    <ReceivedMessage text={m.text} />
                    <Typography sx={{ fontSize: '10px', width: '100%', lineHeight: '10px', textAlign: 'left', mb: 2 }}>
                      {DateTime.fromISO(m.on.formatted).toLocaleString(DateTime.DATETIME_SHORT)}
                    </Typography>
                  </Box>
                );
              } else {
                return (
                  <Box key={i} display="flex" flexDirection="column">
                    <SentMessage text={m.text} />
                    <Typography sx={{ fontSize: '10px', width: '100%', lineHeight: '10px', textAlign: 'right', mb: 2 }}>
                      {DateTime.fromISO(m.on.formatted).toLocaleString(DateTime.DATETIME_SHORT)}
                    </Typography>
                  </Box>
                );
              }
            })}
            <div
              ref={messagesEndRef}
              style={{
                paddingTop: '25px',
              }}
            />
          </Box>
        </Box>
        <form onSubmit={sendMessage} style={{ width: '100%', marginTop: '20px', marginBottom: '50px' }}>
          <Grid container>
            <Grid item xs={11}>
              <TextField fullWidth placeholder="Your Message Here" onChange={handleChange} value={text} />
            </Grid>
            <Grid item xs={1}>
              <Button
                type="submit"
                disabled={sendingMsg || text.length === 0}
                fullWidth
                sx={{ height: '100%', backgroundColor: 'var(--primaryBlue)' }}
                variant="contained"
              >
                <SendIcon />
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
