import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  Paper,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Box } from '@mui/system';
import { useMutation } from '@apollo/client';
import { SET_FLAG_AS_RESOLVED, SET_FLAG_AS_PENDING_REVIEW } from 'Queries/adminQueries';
import Swal from 'sweetalert2';

const RowFlags = (data: any) => {
  const [show, setShow] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);
  const date = new Date(data?.data?.modifiedOn?.formatted);
  const [open, setOpen] = React.useState(false);
  const handleOpenDescription = () => setOpen(true);
  const handleCloseDescription = () => setOpen(false);
  const subject = data?.data?.message.split(': ');
  const [setFlagAsResolved, { error: setResolvedError }] = useMutation(SET_FLAG_AS_RESOLVED, {
    variables: {
      flagId: data?.data?.id,
    },
  });
  const [setFlagAsPendingReview, { error: setPendingReviewError }] = useMutation(SET_FLAG_AS_PENDING_REVIEW, {
    variables: {
      flagId: data?.data?.id,
    },
  });

  const handleSetAsResolved = () => {
    if (!setResolvedError) {
      setShow(false);
      setFlagAsResolved();
      Swal.fire({
        title: 'Flag Set as Resolved',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleSetAsPending = () => {
    if (!setPendingReviewError) {
      setShow(false);
      setFlagAsPendingReview();
      Swal.fire({
        title: 'Flag Set as Pending Review',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

  const style = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'rgba(229, 229, 229, 1)',
    borderRadius: '10px',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
    width: '700px',
    maxHeight: '100%',
  };

  return (
    <TableRow key={data?.data?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="center" component="th" scope="row">
        {data?.data?.flaggedUser[0]?.username || 'User Flagged'}
      </TableCell>
      <TableCell align="center">{data?.data?.flaggingUser[0]?.username || 'Undefined'}</TableCell>
      <TableCell align="center">{date.toUTCString() || 'Undefined'}</TableCell>
      <TableCell align="center">{subject[0] || 'Undefined'}</TableCell>
      <TableCell align="center">
        <Button variant="outlined" onClick={handleOpenDescription}>
          Read Detailed Description
        </Button>
      </TableCell>
      <Modal open={open} onClose={handleCloseDescription} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              pl: 2,
              pr: 2,
            }}
          >
            <Typography id="modal-modal-title" component="h2" sx={{ p: 2 }}>
              Username: {data?.data?.flaggedUser[0]?.username || 'User Flagged'}
            </Typography>
            <Typography id="modal-modal-title" component="h2">
              Subject: {subject[0] || 'Pre-determined Subject'}
            </Typography>
            <Typography id="modal-modal-title" component="h2">
              Date: {data?.data?.modifiedOn?.formatted || '2022-06-16'}
            </Typography>
          </Box>
          <Box sx={{ width: '90%', border: '1px solid black', m: 2, p: 2, bgcolor: 'white', borderRadius: '10px' }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Detailed Description:
            </Typography>
            <Typography id="modal-modal-title" component="p">
              {subject[1]}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              justifyContent: 'space-around',
              pl: 4,
              pr: 4,
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                handleSetAsResolved(), setOpen(false);
              }}
            >
              RESOLVED
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleSetAsPending(), setOpen(false);
              }}
            >
              PENDING
            </Button>
          </Box>
        </Box>
      </Modal>
      {data?.data?.status === false ? (
        <>
          <TableCell align="center" sx={{ backgroundColor: '#F7DFC6' }}>
            Pending Review
          </TableCell>
          <TableCell align="center">
            <IconButton onClick={() => setShow((prev) => !prev)} sx={{ width: '25px', height: '25px', ml: 2 }}>
              <MoreVertOutlinedIcon />
            </IconButton>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell align="center" sx={{ backgroundColor: '#C3F1CD' }}>
            Resolved
          </TableCell>
          <TableCell align="center">
            <IconButton onClick={() => setShowDisabled((prev) => !prev)} sx={{ width: '25px', height: '25px', ml: 2 }}>
              <MoreVertOutlinedIcon />
            </IconButton>
          </TableCell>
        </>
      )}
      {show && (
        <ClickAwayListener onClickAway={() => setShow(false)}>
          <Paper elevation={5} sx={{ position: 'absolute', zIndex: 1, ml: -6, mt: 2 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSetAsResolved()}>
                  <ListItemText primary="Set as Resolved" />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </ClickAwayListener>
      )}
      {showDisabled && (
        <ClickAwayListener onClickAway={() => setShowDisabled(false)}>
          <Paper elevation={5} sx={{ position: 'absolute', zIndex: 1, ml: -6, mt: 2 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSetAsPending()}>
                  <ListItemText primary="Set as Pending Review" />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </ClickAwayListener>
      )}
    </TableRow>
  );
};

export default RowFlags;
