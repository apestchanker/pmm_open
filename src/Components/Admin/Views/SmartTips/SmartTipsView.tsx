import { useNetworkAuth } from 'Providers/NetworkAuth';
import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import { Grid, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import ModalAddSmartTip from './ModalAddSmartTip';
import { GET_USER_ROLES } from 'Queries';
import CardSmartTip from './CardSmartTip';

const SmartTipsView = () => {
  const [search, setSearch] = React.useState('');
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const { username } = useNetworkAuth();
  const { data: userLabelsData } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const userRoles = userLabelsData?.User[0]?.roles;

  useEffect(() => {
    if (userRoles) {
      userRoles.forEach((role: any) => {
        if (role.name === 'Admin') {
          setIsAdmin(true);
        }
      });
    }
  }, [userLabelsData]);

  if (isAdmin) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid sx={{ display: 'flex', flexDirection: 'column', width: '90%', p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', m: 4 }}>
            <ModalAddSmartTip />
            <Typography variant="h5" sx={{ ml: 4 }}>
              Smart tips
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: '300px',
              maxWidth: '285px',
              margin: '5px 0',
              padding: 0,
              cursor: 'pointer',
              justifyContent: 'space-between',
            }}
          >
            <CardSmartTip />
            <CardSmartTip />
            <CardSmartTip />
          </Box>
        </Grid>
      </Box>
    );
  } else {
    return <div>You dont have Admin Permissions</div>;
  }
};

export default SmartTipsView;
