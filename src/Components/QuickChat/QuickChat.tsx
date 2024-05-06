import { Box, Typography } from '@mui/material';
import Styles from './QuickChat.module.css';
import MessageIcon from '@mui/icons-material/Message';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import { useState, useEffect, useCallback } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Contacts } from './Contacts';
import Messages from './Messages';
import { CHECK_UNREAD_MESSAGES } from 'Queries/messageQueries';
import { useLazyQuery } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const QuickChat = () => {
  const [open, setOpen] = useState(false);
  const [otherUser, setOtherUser] = useState('');
  const { username } = useNetworkAuth();
  const [messagesOpen, setMessagesOpen] = useState(false);
  const goBack = () => {
    setMessagesOpen(false);
  };
  const openChat = (user: string) => {
    setOtherUser(user);
    setMessagesOpen(true);
  };
  const [fetchUnreadMessages, { data: unreadMessages }] = useLazyQuery(CHECK_UNREAD_MESSAGES, {
    pollInterval: 2000,
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    fetchUnreadMessages({ variables: { username } });
  }, [username, fetchUnreadMessages]);
  const escFunction = useCallback((event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      //Do whatever when esc is pressed
    }
  }, []);
  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, []);
  return (
    <Box className={`${Styles.root} ${open ? Styles.boxShadow : ''}`}>
      {!open && (
        <Box className={Styles.closed} onClick={() => setOpen(open ? false : true)}>
          <ExpandLessIcon
            className={open ? Styles.expandLessIcon : Styles.expandMoreIcon}
            sx={{
              color: '#fff',
              width: '32px',
              height: '32px',
            }}
          />
          <Box className={Styles.closedContent}>
            {unreadMessages?.Message?.length > 0 ? (
              <>
                <MessageIcon
                  fontSize="small"
                  sx={{
                    color: '#fff',
                  }}
                />
                <Box>
                  <FiberManualRecordIcon sx={{ display: 'flex', color: 'red', width: '10px', alignItems: 'start', mb: 2 }} />
                </Box>
              </>
            ) : (
              <MessageIcon
                fontSize="small"
                sx={{
                  color: '#fff',
                  mr: 1,
                }}
              />
            )}

            <Typography className={Styles.messagesTxt}>Messages</Typography>
          </Box>
        </Box>
      )}
      {open && (
        <Box>
          <Box className={Styles.closed} onClick={() => setOpen(open ? false : true)}>
            <ExpandLessIcon
              className={open ? Styles.expandLessIcon : Styles.expandMoreIcon}
              sx={{
                color: '#fff',
                width: '32px',
                height: '32px',
              }}
            />
            <Box className={Styles.closedContent}>
              {unreadMessages?.Message?.length > 0 ? (
                <>
                  <MessageIcon
                    fontSize="small"
                    sx={{
                      color: '#fff',
                    }}
                  />
                  <Box>
                    <FiberManualRecordIcon sx={{ display: 'flex', color: 'red', width: '10px', alignItems: 'start', mb: 2 }} />
                  </Box>
                </>
              ) : (
                <MessageIcon
                  fontSize="small"
                  sx={{
                    color: '#fff',
                    mr: 1,
                  }}
                />
              )}
              <Typography className={Styles.messagesTxt}>Messages</Typography>
            </Box>
          </Box>
          {messagesOpen ? <Messages otherUser={otherUser} goBack={goBack} /> : <Contacts openChat={openChat} />}
        </Box>
      )}
    </Box>
  );
};
