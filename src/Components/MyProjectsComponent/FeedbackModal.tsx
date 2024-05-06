import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Rating,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Fragment, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CONNECT_NOTIFICATION_TO_USER,
  CONNECT_RATING_TO_USER,
  CONNECT_RATING_TO_USER_HAS_RATED,
  CREATE_AND_CONNECT_NOTIFICATION,
  CREATE_NOTIFICATION,
  CREATE_RATING_NODE,
  GET_USER_ID,
} from 'Queries';
import { useMutation, useQuery } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import Swal from 'sweetalert2';
import moment from 'moment';

const fontStyles = {
  fontSize: '16px',
  lineHeight: '16px',
  fontWeight: 'bold',
  marginRight: '5px',
};

const FeedbackModal = ({ open, handleClose, userRole, userName: userToBeRated }: any) => {
  //this is the username of the person that is rating the other user
  const { username } = useNetworkAuth();
  const [value, setValue] = useState<number | null>(2);
  const [feedback, setFeedback] = useState('');
  const [isFunded, setIsFunded] = useState('');

  const handleSelectChange = (event: SelectChangeEvent) => {
    setIsFunded(event.target.value as string);
  };

  const { data: userIdData } = useQuery(GET_USER_ID, {
    variables: { username: userToBeRated },
  });
  const { data: actualUserId } = useQuery(GET_USER_ID, {
    variables: { username: username },
  });

  //mutations
  const [createRatingNode] = useMutation(CREATE_RATING_NODE);
  const [connectRatingToUser] = useMutation(CONNECT_RATING_TO_USER);
  const [connectRatingToUserHasRated] = useMutation(CONNECT_RATING_TO_USER_HAS_RATED);
  //const [sendNotification] = useMutation(CREATE_AND_CONNECT_NOTIFICATION);
  const [createNotification] = useMutation(CREATE_NOTIFICATION);
  const [connectNotification] = useMutation(CONNECT_NOTIFICATION_TO_USER);

  const uniqueId = uuidv4();
  const actualDate = new Date();

  const handleChange = (event: any) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async () => {
    //updateMutation
    //! pending: add fields sentBy, sentTo and sentOn
    //! pending: add fields sentBy, sentTo and sentOn
    try {
      await createRatingNode({
        variables: {
          id: uniqueId,
          feedback: feedback,
          score: value,
          sentBy: username,
          sentTo: userToBeRated,
          sentOn: { formatted: actualDate },
        },
      });
      // NOTIFICATION MUTATION
      const uniqueIdNotif = uuidv4();
      const date = moment();
      /* sendNotification({
        variables: {
          id: uniqueIdNotif,
          read: false,
          message: `${username} just rated you!.`,
          date: date,
          link: `/projects`,
          userID: userIdData.User[0].id,
        },
      }); */
      await createNotification({
        variables: {
          id: uniqueIdNotif,
          message: `${username} just rated you!.`,
          date: { formatted: date },
          link: `/projects`,
        },
      });
      await connectNotification({
        variables: {
          userID: userIdData?.User[0].id,
          notificationID: uniqueIdNotif,
        },
      });
      // NOTIFICATION MUTATION END
      Swal.fire({
        title: 'Feedback sent successfully',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    } catch (err) {
      Swal.fire({
        title: 'Something went wrong, please try again',
        icon: 'error',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }

    //! commented actualDate due to query changes
    const res = await connectRatingToUser({
      variables: {
        userId: userIdData?.User[0].id,
        // date: actualDate,
        ratingID: uniqueId,
      },
    });

    //! commented actualDate due to query changes
    await connectRatingToUserHasRated({
      variables: {
        userId: actualUserId.User[0].id,
        // date: actualDate,
        ratingID: uniqueId,
      },
    });

    handleClose();
  };

  return (
    <Fragment>
      <Modal
        hideBackdrop
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '80%', lg: '60%' },
            bgcolor: 'background.paper',
            fontFamily: 'roboto',
            borderRadius: '10px',
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '24px' }} id="child-modal-title">
              FEEDBACK
            </Typography>
            <IconButton>
              <CloseIcon sx={{ background: 'var(--textDark)', color: 'white', borderRadius: '50%' }} onClick={() => handleClose()} />
            </IconButton>
          </Box>
          <Box>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={fontStyles}>User: </Box> {userToBeRated}
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={fontStyles}>Role: </Box> {userRole}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={fontStyles}>Rating: </Box>{' '}
              <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
            </Typography>
          </Box>

          <Box>
            <Typography variant="body1">Tell us a little bit about your experience with this person:</Typography>
            <TextField placeholder="..." multiline rows={7} sx={{ width: '100%' }} onChange={handleChange} value={feedback} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'var(--primaryBlue)', marginTop: '10px', padding: '5px 35px' }}
              onClick={handleSubmit}
            >
              SAVE
            </Button>
          </Box>
        </Box>
      </Modal>
    </Fragment>
  );
};

export default FeedbackModal;
