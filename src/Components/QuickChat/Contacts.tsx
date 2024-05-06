import { Box, Skeleton, TextField, Typography, Button, InputAdornment, IconButton } from '@mui/material';
import Styles from './QuickChat.module.css';
import { useState, useEffect } from 'react';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { useLazyQuery, useQuery } from '@apollo/client';
import Divider from '@mui/material/Divider';
import { Message } from 'Types';
import { GET_ALL_MESSAGES_BY_USER, GET_ALL_MESSAGES_BY_SEARCH } from 'Queries/messageQueries';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const Contacts = ({ openChat }: any) => {
  const { username } = useNetworkAuth();
  const [searchValue, setSearchValue] = useState('');
  const {
    data: messagesData,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useQuery(GET_ALL_MESSAGES_BY_USER, {
    pollInterval: 2000,
    variables: {
      username: username,
    },
  });
  const [messagesBySearch, { data: searchedMessages, loading }] = useLazyQuery(GET_ALL_MESSAGES_BY_SEARCH);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    //here we have  all messages separated by user
    if (messagesData !== undefined && searchValue === '') {
      const messagesByUser = messagesData?.Message.reduce((acc: any, curr: Message) => {
        if (curr.sentBy.username === username) {
          if (!acc[curr.sentTo.username]) {
            acc[curr.sentTo.username] = [];
          }
          acc[curr.sentTo.username].push(curr);
        } else {
          if (!acc[curr.sentBy.username]) {
            acc[curr.sentBy.username] = [];
          }
          acc[curr.sentBy.username].push(curr);
        }
        return acc;
      }, {});
      setMessages(messagesByUser);
    }
  }, [messagesLoading, refetchMessages, messagesData, searchValue]);
  const search = (e: any) => {
    e.preventDefault();
    messagesBySearch({ variables: { username: username, userToSearch: `(?i).*${searchValue}.*` } });
  };

  useEffect(() => {
    if (searchValue !== '' && searchedMessages !== undefined) {
      const messagesByUser = searchedMessages?.Message.reduce((acc: any, curr: Message) => {
        if (curr.sentBy.username === username) {
          if (!acc[curr.sentTo.username]) {
            acc[curr.sentTo.username] = [];
          }
          acc[curr.sentTo.username].push(curr);
        } else {
          if (!acc[curr.sentBy.username]) {
            acc[curr.sentBy.username] = [];
          }
          acc[curr.sentBy.username].push(curr);
        }
        return acc;
      }, {});
      setMessages(messagesByUser);
    }
  }, [searchedMessages, loading]);

  const messagesSkelton = [...Array(7)].map((x) => 0);

  return (
    <Box className={Styles.open}>
      <Box>
        <form onSubmit={search} className={Styles.searchForm}>
          <TextField
            variant="filled"
            fullWidth
            placeholder="User..."
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        <Box className={Styles.messageBox}>
          {messagesLoading &&
            messagesSkelton.map((_, index) => (
              <Box key={`skeleton${index}`} className={Styles.skeleton}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: index === 0 ? '1rem' : '0',
                  }}
                >
                  <Skeleton animation="wave" variant="text" width={'30%'} height={30} />
                  <Skeleton animation="wave" variant="text" width={'20%'} height={20} />
                </Box>
                <Skeleton animation="wave" variant="text" width={'60%'} height={20} />
                <Divider />
              </Box>
            ))}
          {!messagesLoading &&
            Object.keys(messages).map((user: any) => (
              <Box className={Styles.eachMessage} key={`${user}-listitem`} onClick={() => openChat(user)}>
                <Box
                  sx={{
                    width: '100%',
                    padding: '5px 10px',
                  }}
                >
                  <Typography className={Styles.name}>{user}</Typography>
                  {messages[user][0].read === false && messages[user][0].sentBy.username != username ? (
                    <FiberManualRecordIcon
                      sx={{ width: '15px', height: '15px', color: '#2f4583', position: 'absolute', marginLeft: '90%' }}
                    />
                  ) : null}
                  <Typography className={Styles.message}>{messages[user][0].text}</Typography>
                </Box>
                <Typography className={Styles.date}>
                  {`${messages[user][0].on.day}/${messages[user][0].on.month}/${messages[user][0].on.year}` || ''}
                </Typography>
                <Divider
                  sx={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                  }}
                />
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};
