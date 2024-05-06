import React, { useState, useEffect, useCallback, useRef } from 'react';
import Grid from '@mui/material/Grid';
import { Typography, Button, TextField, Fab } from '@mui/material';
import Divider from '@mui/material/Divider';
import ReceivedMessage from '../../Views/MyProjects/MyMessages/ReceivedMessage';
import SentMessage from '../../Views/MyProjects/MyMessages/SentMessage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { CONNECT_NOTIFICATION_TO_USER, CREATE_NOTIFICATION, GET_ALL_USER_MESSAGES, GET_USER_ID, SEND_MESSAGE } from 'Queries';
import { SET_MESSAGE_AS_READ } from 'Queries/messageQueries';
import { useMutation, useQuery } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { Message } from 'Types';
import { DateTime } from 'luxon';
import Box from '@mui/material/Box';
import Style from './QuickChat.module.css';
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useOnScreen from 'Hooks/useOnScreen';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export default function Messages({ otherUser, goBack }: any): JSX.Element {
  const { username } = useNetworkAuth();
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
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

  const [messageToSetAsRead, setMessageToSetAsRead] = useState('');

  useEffect(() => {
    setMessageToSetAsRead(messagesData?.Message[messagesData?.Message?.length - 1]?.id);
  }, [messagesData]);

  const [setMessageAsRead] = useMutation(SET_MESSAGE_AS_READ, {
    variables: {
      messageId: messageToSetAsRead,
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
      setMessageAsRead();
    }
  }, [messagesData]);
  const [text, setText] = useState('');
  const [sendMessageMutation] = useMutation(SEND_MESSAGE);

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
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box className={Style.open}>
          <Box onClick={goBack} className={Style.back}>
            <ChevronLeftIcon />
            <Typography sx={{ fontSize: '18px', fontWeight: 'bold', width: '100%', textAlign: 'left' }}>{otherUser}</Typography>
          </Box>
          <Divider />
          <Box sx={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)', zIndex: '5' }}>
            <Fab
              onClick={scrollToBottom}
              sx={{
                zIndex: 9999,
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
          <form onSubmit={sendMessage} className={Style.formMessage}>
            <Grid container>
              <Grid item xs={10}>
                <TextField
                  autoFocus={true}
                  fullWidth
                  id={Style.idMessageField}
                  placeholder="Type your message here"
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  className={Style.messageField}
                  variant="filled"
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  type="submit"
                  disabled={sendingMsg || text.length === 0}
                  fullWidth
                  sx={{ height: '100%', backgroundColor: 'var(--primaryBlue)' }}
                  variant="contained"
                  className={Style.sendButton}
                >
                  <SendIcon fontSize="large" />
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
