import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react';

const contractsPlaceholder = [
  {
    title: 'Template B',
    text: 'This is a project 2',
  },
  {
    title: 'Template C',
    text: 'This is a project 3',
  },
  {
    title: 'Template D',
    text: 'This is a project 4',
  },
  {
    title: 'Template E',
    text: 'This is a project 5',
  },
];

interface Props {
  setAgreementText: (text: string) => void;
  setIsDisabled: (val: boolean) => void;
  setShowTemplates: (val: boolean) => void;
}

function ContractsTemplates({ setAgreementText, setIsDisabled, setShowTemplates }: Props) {
  return (
    <Grid container spacing={2} mt={2}>
      <Grid item xs={6} sm={4} md={3} key={'empty-string'}>
        <Button
          onClick={() => {
            setAgreementText('');
            setIsDisabled(false);
            setShowTemplates(false);
          }}
        >
          <Paper elevation={2} sx={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography sx={{ textAlign: 'center' }}>{'START FROM SCRATCH'}</Typography>
            </Box>
          </Paper>
        </Button>
      </Grid>
      {contractsPlaceholder.map((contract, index) => (
        <Grid item xs={6} sm={4} md={3} key={index}>
          <Button
            onClick={() => {
              setAgreementText(contract.text);
              setIsDisabled(false);
              setShowTemplates(false);
            }}
          >
            <Paper elevation={2} sx={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ textAlign: 'center' }}>{contract.title}</Typography>
                <Typography>{contract.text}</Typography>
              </Box>
            </Paper>
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export default ContractsTemplates;
