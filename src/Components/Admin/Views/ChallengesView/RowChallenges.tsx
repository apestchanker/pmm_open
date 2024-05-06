import { IconButton, List, ListItem, ListItemButton, ListItemText, Paper, TableCell, TableRow } from '@mui/material';
import React, { useState } from 'react';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { BLOCK_CHALLENGES, ENABLE_CHALLENGES, DELETE_CHALLENGES } from 'Queries/adminQueries';
import { useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const RowChallenges = (data: any) => {
  const [show, setShow] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);
  const [setChallengeAsBlocked, { error: setBlockedError }] = useMutation(BLOCK_CHALLENGES, {
    variables: {
      id: data?.data?.id,
    },
  });
  const [setChallengeActive, { error: setActiveError }] = useMutation(ENABLE_CHALLENGES, {
    variables: {
      id: data?.data?.id,
    },
  });
  const [deleteChallenge, { error: deleteError }] = useMutation(DELETE_CHALLENGES, {
    variables: {
      id: data?.data?.id,
    },
  });

  const handleSetAsBlocked = () => {
    if (!setBlockedError) {
      setShow(false);
      setChallengeAsBlocked();
      Swal.fire({
        title: 'Challenge Blocked',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleSetAsActive = () => {
    if (!setActiveError) {
      setShowDisabled(false);
      setChallengeActive();
      Swal.fire({
        title: 'Challenge Activated',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleDeleteTag = () => {
    if (!deleteError) {
      setShowDisabled(false);
      deleteChallenge();
      Swal.fire({
        title: 'Challenge Deleted',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

  return (
    <TableRow key={data?.data?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="center" component="th" scope="row">
        {data?.data?.title}
      </TableCell>
      <TableCell align="center" component="th" scope="row">
        {data?.data?.fund}
      </TableCell>
      {data?.data?.isActive === true ? (
        <>
          <TableCell align="center">Active</TableCell>
          <TableCell align="center">
            <IconButton onClick={() => setShow((prev) => !prev)} sx={{ width: '25px', height: '25px', ml: 2 }}>
              <MoreVertOutlinedIcon />
            </IconButton>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell align="center">Blocked</TableCell>
          <TableCell align="center">
            <IconButton onClick={() => setShowDisabled((prev) => !prev)} sx={{ width: '25px', height: '25px', ml: 2 }}>
              <MoreVertOutlinedIcon />
            </IconButton>
          </TableCell>
        </>
      )}
      {show && (
        <ClickAwayListener onClickAway={() => setShow(false)}>
          <Paper elevation={5} sx={{ position: 'absolute', zIndex: 1, ml: -15, mt: 1 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSetAsBlocked()}>
                  <ListItemText primary="Block" />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </ClickAwayListener>
      )}
      {showDisabled && (
        <ClickAwayListener onClickAway={() => setShowDisabled(false)}>
          <Paper elevation={5} sx={{ position: 'absolute', zIndex: 1, ml: -15, mt: 1 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSetAsActive()}>
                  <ListItemText primary="Enable" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleDeleteTag()}>
                  <ListItemText primary="Delete" />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </ClickAwayListener>
      )}
    </TableRow>
  );
};

export default RowChallenges;
