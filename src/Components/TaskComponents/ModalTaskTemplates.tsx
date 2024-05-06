import { Box, Button, Grid, IconButton, Paper, Typography } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

const easyTasks = [
  {
    title: 'Easy Task',
    text: 'Up to 5 hours',
    effort: '5 hours',
  },
  {
    title: 'Easy Task',
    text: 'Up to 10 hours',
    effort: '10 hours',
  },
  {
    title: 'Easy Task',
    text: 'Up to 15 hours',
    effort: '15 hours',
  },
  {
    title: 'Easy Task',
    text: 'Up to 20 hours',
    effort: '20 hours',
  },
];

interface Props {
  setTaskText: (text: string) => void;
  setTaskEffort: (text: string) => void;
  setShowTemplates: (val: boolean) => void;
  setEasyTask: (val: boolean) => void;
  handleClose: () => void;
}

// eslint-disable-next-line react/prop-types
function TaskTemplates({ setTaskText, setTaskEffort, setShowTemplates, setEasyTask, handleClose }: Props) {
  const closeModal = () => {
    handleClose();
    // setIsDisabled(true);
  };
  return (
    <Grid container spacing={2} mt={2}>
      <Box
        sx={{
          backgroundColor: 'var(--bgGray)',
          boxShadow: 24,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          borderRadius: '7px',
          width: { xs: '80%', md: '50%' },
          zIndex: 100,
        }}
      >
        <Box className="name" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '18px', ml: 3, mt: 3 }}>Easy Tasks</Typography>
          <IconButton sx={{ m: 1 }} onClick={() => closeModal()}>
            <CloseIcon sx={{ background: 'var(--textDark)', color: 'white', borderRadius: '50%' }} />
          </IconButton>
        </Box>
        <Grid item xs={6} sm={4} md={3} key={'empty-string'}>
          <Button
            onClick={() => {
              setTaskText('');
              setShowTemplates(false);
            }}
          ></Button>
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'row' }}>
          {easyTasks.map((task, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Button
                onClick={() => {
                  setTaskText(task.text);
                  setTaskEffort(task.effort);
                  setShowTemplates(false);
                  setEasyTask(true);
                }}
              >
                <Paper
                  elevation={2}
                  sx={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography sx={{ textAlign: 'center' }}>{task.title}</Typography>
                    <Typography>{task.text}</Typography>
                  </Box>
                </Paper>
              </Button>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Typography sx={{ width: '100%', fontWeight: 'bold', fontSize: '18px', m: 3 }}>FullTime Tasks</Typography>
          <Button
            onClick={() => {
              setTaskText('Fulltime Task');
              setShowTemplates(false);
              setEasyTask(false);
            }}
          >
            <Paper elevation={2} sx={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ textAlign: 'center' }}>FullTime Task</Typography>
                <Typography>Unlimited</Typography>
              </Box>
            </Paper>
          </Button>
        </Grid>
      </Box>
    </Grid>
  );
}

export default TaskTemplates;
