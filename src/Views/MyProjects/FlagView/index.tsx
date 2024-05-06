import React, { useCallback } from 'react';
import { Typography, Grid, Box, FormControl, MenuItem, TextField, Button } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ReturnButton from 'Components/ReturnButton/ReturnButton';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_USER_BY_ID, GET_USER_ID, CREATE_FLAG } from 'Queries';
import { useMutation, useQuery } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import Swal from 'sweetalert2';

function FlagView() {
  const { toUser } = useParams();
  const { username } = useNetworkAuth();

  const { data: userId } = useQuery(GET_USER_ID, {
    variables: {
      username: username,
    },
  });

  const [createFlagMutation] = useMutation(CREATE_FLAG);

  const { data: reportedUserData } = useQuery(GET_USER_BY_ID, {
    variables: {
      id: toUser,
    },
  });
  const [subject, setSubject] = React.useState('');
  const [text, setText] = React.useState('');

  const description = subject + ': ' + text;

  const handleChange = (event: SelectChangeEvent) => {
    setSubject(event.target.value);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  const uniqueId = uuidv4();
  const dateTime = moment();
  const navigate = useNavigate();
  const createFlag = useCallback(
    async (e: any): Promise<boolean> => {
      e.preventDefault();
      try {
        if (!text || !subject) {
          Swal.fire({
            title: 'Error!',
            text: 'All fields are required!',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          return false;
        }
        await createFlagMutation({
          variables: {
            data: {
              id: uniqueId,
              message: description,
              status: false,
              modifiedOn: { formatted: dateTime },
            },
            fromUser: userId?.User[0]?.id,
            flaggedUser: toUser,
            flagId: uniqueId,
          },
        });
        setText('');
        Swal.fire({
          title: 'Flag Sent! An Administrator will review it as soon as possible',
          icon: 'success',
          showCloseButton: true,
          confirmButtonText: 'Ok',
          didDestroy: () => {
            return navigate('/projects/interactions');
          },
        });
        return true;
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong, please try again',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return false;
      }
    },
    [userId, createFlagMutation, text],
  );

  return (
    <>
      <ReturnButton />
      <Grid xs={12} sx={{ display: 'flex', flexDirection: 'column', justifySelf: 'center', p: 3 }}>
        <Typography variant="h4" sx={{ ml: 3 }}>
          FLAG
        </Typography>
        <Typography sx={{ m: 3, width: '50%' }}>
          Remember: This tool is set and created to flag bad behaviours or wrongly intended actions within our platform. Remember, your
          complaints will be attended and if we find it necessary we will take public action within our community to solve this issue.
        </Typography>
        <Grid sx={{ display: 'flex', flexDirection: 'Row' }}>
          <Typography sx={{ ml: 5, mb: 3, fontWeight: 'bold' }}>User: {reportedUserData?.User[0]?.username}</Typography>
          <Typography sx={{ ml: 5, mb: 3, fontWeight: 'bold', display: 'flex', flexDirection: 'row' }}>
            Role:
            {reportedUserData?.User[0]?.roles?.map((e: any) => (
              <Typography sx={{ pl: 2 }} key={e.id}>
                {e.name}
              </Typography>
            ))}
          </Typography>
        </Grid>
        <Typography sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ml: 5, fontWeight: 'bold' }}>
          Subject:
          <Box sx={{ width: '320px', ml: 2 }}>
            <FormControl fullWidth>
              <Select labelId="demo-simple-select-label" id="demo-simple-select" value={subject} onChange={handleChange}>
                <MenuItem value={'Breach of Contract'}>Breach of Contract</MenuItem>
                <MenuItem value={'Violence'}>Violence</MenuItem>
                <MenuItem value={'Unrespectful/Wrong Behavior'}>Unrespectful/Wrong Behavior</MenuItem>
                <MenuItem value={'Abusive Behavior'}>Abusive Behavior</MenuItem>
                <MenuItem value={'Misuse of the platform'}>Misuse of the platform</MenuItem>
                <MenuItem value={'Spam'}>Spam</MenuItem>
                <MenuItem value={'False Profile'}>False Profile</MenuItem>
                <MenuItem value={'Illegal Activity'}>Illegal Activity</MenuItem>
                <MenuItem value={'Suspecious Behaviour'}>Suspecious Behaviour</MenuItem>
                <MenuItem value={'Bullying'}>Bullying</MenuItem>
                <MenuItem value={'Dangerous Organization'}>Dangerous Organization</MenuItem>
                <MenuItem value={'Hate Incitement'}>Hate Incitement</MenuItem>
                <MenuItem value={'Fraud'}>Fraud</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Typography>

        <Box sx={{ m: 5 }}>
          <FormControl fullWidth sx={{ borderRadius: '4px' }}>
            <TextField
              id="describedSolution-input"
              multiline
              rows={4}
              placeholder="Please tell us as detailed as posible what happened..."
              variant="outlined"
              fullWidth
              value={text}
              onChange={handleTextChange}
            />
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            type="submit"
            variant="contained"
            onClick={createFlag}
            sx={{ backgroundColor: 'var(--primaryBlue)', width: '200px', py: 2 }}
          >
            FLAG
          </Button>
        </Box>
      </Grid>
    </>
  );
}

export default FlagView;
