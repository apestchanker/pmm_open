import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FormControlLabel from '@mui/material/FormControlLabel';
import TuneIcon from '@mui/icons-material/Tune';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import { GET_RECEIVED_MESSAGES, GET_SENT_MESSAGES } from 'Queries';
import { useLazyQuery } from '@apollo/client';
import { Message } from 'Types';
import { useNetworkAuth } from 'Providers/NetworkAuth';

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

export interface Messages {
  [key: string]: Message[];
}

export default function ModalFilterMessages(props: any) {
  const { username } = useNetworkAuth();
  const [radioValues, setRadioValues] = React.useState('unread');
  const [checkboxesState, setCheckboxesState] = React.useState({
    proposer: false,
    mentor: false,
  });
  const [dateState, setDateState] = React.useState({
    fromDate: '',
    toDate: '',
  });
  const [queryMessages, { data: messagesData, loading: messagesLoading }] = useLazyQuery(GET_RECEIVED_MESSAGES);
  const [queryMessagesSentByUser, { data: messagesDataByUser }] = useLazyQuery(GET_SENT_MESSAGES);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setDateState({ fromDate: '', toDate: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    if (messagesData && messagesDataByUser) {
      const messages = messagesData.Message as Message[];
      const messagesByUser = messagesDataByUser.Message as Message[];
      const reducedMessages = messages.reduce((acc, message) => {
        const sentBy: string = message.sentBy.username;
        if (!(sentBy in acc)) {
          acc[sentBy] = [message];
        } else {
          acc[sentBy].push(message);
        }
        return acc;
      }, {} as Messages);
      const reducedMessagesByUser = messagesByUser.reduce((acc, message) => {
        const sentTo: string = message.sentTo.username;
        if (!(sentTo in acc)) {
          acc[sentTo] = [message];
        } else {
          acc[sentTo].push(message);
        }
        return acc;
      }, {} as Messages);
      for (const key in reducedMessagesByUser) {
        if (!reducedMessages.hasOwnProperty(key)) {
          reducedMessages[key] = [...reducedMessagesByUser[key]];
        }
      }
      props.setMessagesByUser(reducedMessagesByUser);
      props.setMessages(reducedMessages);
    }
  }, [messagesData, messagesLoading, messagesDataByUser]);

  // const handleChange = (event: any) => {
  //   setCheckboxesState({ ...checkboxesState, [event.target.name]: event.target.checked });
  // };
  const handleDateChange = (event: any) => {
    setDateState({ ...dateState, [event.target.name]: event.target.value });
  };
  const handleApplyFilters = async () => {
    let { fromDate, toDate } = dateState;
    if (fromDate.length === 0) {
      fromDate = '2000-01-01';
    } else if (toDate.length === 0) {
      toDate = '3000-01-01';
    }
    handleClose();
    if (fromDate.length > 0 && toDate.length > 0) {
      queryMessages({
        variables: {
          username: username,
        },
      });
      queryMessagesSentByUser({
        variables: {
          username: username,
        },
      });
    } else {
      queryMessages({
        variables: {
          username: username,
        },
      });
      queryMessagesSentByUser({
        variables: {
          username: username,
        },
      });
    }
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Typography sx={{ fontSize: '18px' }} onClick={handleOpen}>
          Filter
        </Typography>
        <TuneIcon onClick={handleOpen} sx={{ width: '30px', height: '30px', cursor: 'pointer' }} />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '10px' }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}> Filters </Typography>
            <CloseIcon
              sx={{ background: 'var(--textDark)', color: 'white', borderRadius: '50%', cursor: 'pointer' }}
              onClick={handleClose}
            />
          </Box>
          {/* <Typography fontSize={20} fontWeight="bold">
            Relationship
          </Typography>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={checkboxesState.proposer}
                  label="Proposer"
                  name="proposer"
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={checkboxesState.mentor}
                  label="Mentor"
                  name="mentor"
                  onChange={(e) => handleChange(e)}
                />
              </Grid>
            </Grid>
          </FormGroup> */}
          <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}> Status </Typography>
          <FormControl fullWidth>
            <RadioGroup value={radioValues} onChange={(e) => setRadioValues(e.target.value)}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControlLabel value="read" control={<Radio />} label="Read" />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel value="unread" control={<Radio />} label="Unread" />
                </Grid>
              </Grid>
            </RadioGroup>
          </FormControl>
          <Box sx={{ flexDirection: 'column' }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}> Dates </Typography>
            <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  id="fromDate"
                  label="From"
                  type="date"
                  name="fromDate"
                  value={dateState.fromDate}
                  onChange={(e) => handleDateChange(e)}
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="toDate"
                  label="To"
                  name="toDate"
                  type="date"
                  value={dateState.toDate}
                  onChange={(e) => handleDateChange(e)}
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button sx={{ bgcolor: '#263560' }} variant="contained" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
