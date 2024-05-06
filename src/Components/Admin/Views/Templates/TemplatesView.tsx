import { useNetworkAuth } from 'Providers/NetworkAuth';
import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import { Grid, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_CHALLENGES } from 'Queries/adminQueries';
// import RowChallenges from './RowChallenges';
import ModalAddTemplate from './ModalAddTemplate';
import { GET_USER_ROLES } from 'Queries';
import CardTemplates from './CardTemplates';

const TemplatesView = () => {
  const [search, setSearch] = React.useState('');
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  //   const [fetchChallenges, { data: dataChallenges }] = useLazyQuery(GET_CHALLENGES, {
  //     variables: { search: `(?i).*${search}.*`, order: ordering },
  //     pollInterval: 2000,
  //     fetchPolicy: 'network-only',
  //   });
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

  //   useEffect(() => {
  //     fetchChallenges();
  //   }, [fetchChallenges]);
  if (isAdmin) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Grid sx={{ display: 'flex', flexDirection: 'column', width: '90%', p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', m: 4 }}>
            <ModalAddTemplate />
            <Typography variant="h5" sx={{ ml: 4 }}>
              Templates
            </Typography>
            {/* <Box sx={{ width: '320px', display: 'flex', flexDirection: 'row', alignItems: 'center', alignSelf: 'baseline', pl: '40%' }}>
              <ImportExportOutlinedIcon />
            </Box> */}
          </Box>
          {/* <Grid container alignItems="space-between" display="flex" width={'100%'}> */}
          <Box
            // elevation={3}
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
            <CardTemplates />
            <CardTemplates />
            <CardTemplates />
          </Box>
          {/* </Grid> */}
        </Grid>
      </Box>
    );
  } else {
    return <div>You dont have Admin Permissions</div>;
  }
};

export default TemplatesView;
