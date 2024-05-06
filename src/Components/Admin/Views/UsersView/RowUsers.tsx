import { IconButton, List, ListItem, ListItemButton, ListItemText, Paper, TableCell, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { BLOCK_USER, ENABLE_USER } from 'Queries/adminQueries';
import { useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const RowUsers = (data: any) => {
  const [show, setShow] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);
  const [setUserAsBlocked, { error: setBlockedError }] = useMutation(BLOCK_USER, {
    variables: {
      id: data?.data?.id,
    },
  });
  const [setUserAsActive, { error: setActiveError }] = useMutation(ENABLE_USER, {
    variables: {
      id: data?.data?.id,
    },
  });

  const handleSetAsBlocked = () => {
    if (!setBlockedError) {
      setShow(false);
      setUserAsBlocked();
      Swal.fire({
        title: 'User Blocked',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleSetAsActive = () => {
    if (!setActiveError) {
      setShowDisabled(false);
      setUserAsActive();
      Swal.fire({
        title: 'User Active',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    }
  };

  const date = new Date(data?.data?.memberSince?.formatted);

  return (
    <TableRow key={data?.data?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="center" component="th" scope="row">
        {data?.data?.username}
      </TableCell>
      <TableCell align="center">{data?.data?.email}</TableCell>
      <TableCell align="center">
        {data?.data?.roles?.map((role: any) => (
          <Typography key={role.id}>{role?.name}</Typography>
        ))}
      </TableCell>
      <TableCell align="center">{date.toUTCString()}</TableCell>
      <TableCell align="center">{data?.data?.avgScore?.toFixed(2) || 'No Score'}</TableCell>
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
          <Paper elevation={5} sx={{ position: 'absolute', zIndex: 1, ml: -2, mt: 2 }}>
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
          <Paper elevation={5} sx={{ position: 'absolute', zIndex: 1, ml: -2, mt: 2 }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSetAsActive()}>
                  <ListItemText primary="Enable" />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </ClickAwayListener>
      )}
    </TableRow>
  );
};

export default RowUsers;
