import { useNetworkAuth } from 'Providers/NetworkAuth';
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import { FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_USERS } from 'Queries/adminQueries';
import RowUsers from './RowUsers';
import ModalAddUser from './ModalAddUser';
import { GET_USER_ROLES } from 'Queries';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';

const UsersView = () => {
  const [search, setSearch] = React.useState('');
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const [ordering, setOrdering] = useState('username_asc');
  const [fetchUsers, { data: dataUsers }] = useLazyQuery(GET_USERS, {
    variables: { search: `(?i).*${search}.*`, order: ordering },
    pollInterval: 2000,
    fetchPolicy: 'network-only',
  });
  const { username } = useNetworkAuth();
  const { data: userLabelsData } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const userRoles = userLabelsData?.User[0]?.roles;

  const handleChangeOrdering = (event: SelectChangeEvent) => {
    setOrdering(event.target.value as string);
  };

  useEffect(() => {
    if (userRoles) {
      userRoles.forEach((role: any) => {
        if (role.name === 'Admin') {
          setIsAdmin(true);
        }
      });
    }
  }, [userLabelsData]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isAdmin) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid sx={{ display: 'flex', flexDirection: 'column', width: '90%', p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', m: 4 }}>
            <ModalAddUser />
            <TextField
              id="filled-search"
              label="Search By Username or Email"
              type="search"
              variant="filled"
              onChange={handleTextChange}
              sx={{ width: '300px', ml: 4 }}
            />
            <Box sx={{ width: '320px', display: 'flex', flexDirection: 'row', alignItems: 'center', alignSelf: 'baseline', pl: '40%' }}>
              <ImportExportOutlinedIcon />
              <Typography sx={{ width: '100px', fontSize: '14px', fontWeight: 'bold', mr: 2 }}>Sort By</Typography>
              <FormControl fullWidth>
                <Select onChange={handleChangeOrdering}>
                  <MenuItem value={'username_asc'}>Username - A-Z</MenuItem>
                  <MenuItem value={'username_desc'}>Username - Z-A</MenuItem>
                  <MenuItem value={'email_asc'}>Email - A-Z</MenuItem>
                  <MenuItem value={'email_desc'}>Email - Z-A</MenuItem>
                  <MenuItem value={'memberSince_asc'}>Member Since - Newest First</MenuItem>
                  <MenuItem value={'memberSince_desc'}>Member Since - Oldest First</MenuItem>
                  <MenuItem value={'isActive_desc'}>Active First</MenuItem>
                  <MenuItem value={'isActive_asc'}>Blocked First</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Username</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Profile</TableCell>
                  <TableCell align="center">Member Since</TableCell>
                  <TableCell align="center">Avg. Score</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataUsers?.User?.map((row: any) => (
                  <RowUsers key={row.id} data={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Box>
    );
  } else {
    return <div>You dont have Admin Permissions</div>;
  }
};

export default UsersView;
