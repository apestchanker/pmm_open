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
import { Grid, MenuItem, Select, TextField, Typography, FormControl } from '@mui/material';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_USER_ROLES } from 'Queries';
import RowFlags from './RowFlags';
import { GET_FLAGS } from 'Queries/adminQueries';
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';
import { SelectChangeEvent } from '@mui/material/Select';

const FlagsView = () => {
  const { username } = useNetworkAuth();
  const { data: userLabelsData } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });
  const [search, setSearch] = React.useState('');
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const [ordering, setOrdering] = useState('modifiedOn_asc');
  const [isAdmin, setIsAdmin] = useState(false);
  const userRoles = userLabelsData?.User[0]?.roles;

  const [fetchFlags, { data: dataFlags }] = useLazyQuery(GET_FLAGS, {
    variables: { search: `(?i).*${search}.*`, order: ordering },
    pollInterval: 2000,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (userRoles) {
      userRoles.forEach((role: any) => {
        if (role.name === 'Admin') {
          setIsAdmin(true);
        }
      });
    }
  }, [userLabelsData]);

  const handleChangeOrdering = (event: SelectChangeEvent) => {
    setOrdering(event.target.value as string);
  };

  useEffect(() => {
    fetchFlags();
  }, [fetchFlags]);

  if (isAdmin) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid sx={{ display: 'flex', flexDirection: 'column', width: '90%', p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', m: 4, ml: 16 }}>
            <TextField
              id="filled-search"
              label="Search By Acussed, Complainant, Subject or Detailed Description"
              type="search"
              variant="filled"
              onChange={handleTextChange}
              sx={{ width: '500px', ml: 4 }}
            />
            <Box sx={{ width: '320px', display: 'flex', flexDirection: 'row', alignItems: 'center', alignSelf: 'baseline', pl: '40%' }}>
              <ImportExportOutlinedIcon />
              <Typography sx={{ width: '100px', fontSize: '14px', fontWeight: 'bold', mr: 2 }}>Sort By</Typography>
              <FormControl fullWidth>
                <Select onChange={handleChangeOrdering}>
                  <MenuItem value={'modifiedOn_asc'}>Date - Oldest First</MenuItem>
                  <MenuItem value={'modifiedOn_desc'}>Date - Newest First</MenuItem>
                  <MenuItem value={'status_asc'}>Pending First</MenuItem>
                  <MenuItem value={'status_desc'}>Resolved First</MenuItem>
                  <MenuItem value={'message_asc'}>Subject - A-Z</MenuItem>
                  <MenuItem value={'message_desc'}>Subject - Z-A</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Accused</TableCell>
                  <TableCell align="center">Complainant</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Subject</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataFlags?.Flag?.map((row: any) => (
                  <RowFlags key={row.id} data={row} />
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

export default FlagsView;
