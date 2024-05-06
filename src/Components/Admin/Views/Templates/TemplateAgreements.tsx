import {
  Autocomplete,
  Button,
  CircularProgress,
  FilledInput,
  FormControl,
  Grid,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import Style from './AddProposalForm.module.css';
import { CREATE_LATEST_ACTIVITIES, GET_USER_ID } from 'Queries';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useMutation, useQuery } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

interface State {
  id: string;
  description: string;
  content: string;
  statusDate: string;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgba(229, 229, 229, 1)',
  borderRadius: '10px',
  border: '0px solid #000',
  boxShadow: 24,
  p: 4,
};

function AddTemplateAgreement() {
  const { username } = useNetworkAuth();
  const actualDate = new Date().toISOString();
  const [uniqueId, setUniqueId] = React.useState(uuidv4());
  const navigate = useNavigate();

  const { data: userData } = useQuery(GET_USER_ID, {
    variables: { username },
  });

  const [values, setValues] = React.useState<State>({
    id: uniqueId,
    description: '',
    content: '',
    statusDate: actualDate,
  });

  const handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value, id: uniqueId });
    setUniqueId(uuidv4());
    // setDataChanged(true);
  };

  const [createLatestAct] = useMutation(CREATE_LATEST_ACTIVITIES);

  //   const [createTemplateAgreement, { data: draftData, error: draftError }] = useMutation({
  //     variables: {
  //       id: values.id,
  //       description: values.description,
  //       content: values.content,
  //       isTemplate: true,
  //       userId: userData?.User[0]?.id,
  //     },
  //   });

  //   const handleDraftSubmit = async (event: { preventDefault: () => void }) => {
  //     event.preventDefault();
  //     if (
  //       values.description === '' ||
  //       values.content === ''
  //     ) {
  //       Swal.fire({
  //         title: 'Something went wrong, please try again',
  //         icon: 'error',
  //         showCloseButton: true,
  //         confirmButtonText: 'Ok',
  //       });
  //     } else {
  //       const graphResponse = await createTemplateAgreement();
  //       Swal.fire({
  //         title: 'Agreement template added successfully',
  //         icon: 'success',
  //         showCloseButton: true,
  //         confirmButtonText: 'Ok',
  //         didDestroy: () => {
  //           setComponentToShow('Proposals');
  //         },
  //       });
  //     }
  //     await createLatestAct({
  //       variables: {
  //         id: `${uniqueId}-${actualDate} latact-agreement-template`,
  //         message: '#LAT-ACT - You created a agreement template',
  //         date: { formatted: actualDate },
  //         link: '#',
  //       },
  //     }).then(() => {
  //       connectNotification({
  //         variables: {
  //           userID: userData?.User[0]?.id,
  //           notificationID: `${uniqueId}-${actualDate} latact-proposal`,
  //         },
  //       });
  //     });
  //   };
  return (
    <Grid container spacing={3} sx={{ position: 'relative', width: '80%', margin: 'auto', p: { xs: 1, md: 10 }, pt: { xs: 5, md: 10 } }}>
      <Button
        onClick={() => {
          navigate('/admin/templates');
        }}
        sx={{ color: 'var(--primaryBlue)', position: { md: 'absolute' }, top: { md: '10px' }, left: { md: '10px' } }}
        startIcon={<ArrowBackIosNewIcon />}
      >
        <Typography variant="h6">Return</Typography>
      </Button>
      <Typography sx={{ fontSize: '24px', fontWeight: 'bold', width: '100%', lineHeight: '16px' }}>Agreement Template</Typography>
      {/* 140 CHARAS DESCRIPTION START*/}
      <Grid item xs={12} className={Style.gridItem}>
        <FormControl fullWidth>
          <Typography>Brief description (140 characters) *</Typography>
          <FilledInput
            required
            fullWidth
            inputProps={{ maxLength: 140 }}
            id="description-140-charas-input"
            type="text"
            // placeholder="..."
            value={values.description}
            onChange={handleChange('description')}
          />
        </FormControl>
      </Grid>
      {/* 140 CHARAS DESCRIPTION END*/}

      {/* CONTENT START*/}
      <Grid item xs={12} className={Style.gridItem}>
        <FormControl fullWidth>
          <Typography>Content </Typography>
          <FilledInput
            required
            fullWidth
            multiline
            rows={4}
            inputProps={{ maxLength: 280 }}
            id="relevant-exp-input"
            type="text"
            value={values.content}
            onChange={handleChange('content')}
          />
        </FormControl>
      </Grid>
      {/* CONTENT END*/}
      <Grid item xs={12} className={Style.gridItem}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" sx={{ backgroundColor: 'var(--primaryBlue)', width: '200px', py: 2 }}>
            Publish
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
export default AddTemplateAgreement;
