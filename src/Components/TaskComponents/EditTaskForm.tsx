import React, { useEffect, useState } from 'react';
import { GET_TASK_BY_ID, UPDATE_TASK } from 'Queries/tasksQueries';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Button, Grid, FormControl, FilledInput, Checkbox } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Swal from 'sweetalert2';
import { usePrompt } from 'Hooks/blockingHooks';

const EditTaskForm = () => {
  const { id } = useParams();
  const { data: taskData, loading: taskDataLoading } = useQuery(GET_TASK_BY_ID, {
    variables: { id },
  });
  const navigate = useNavigate();
  const [isDataChanged, setDataChanged] = useState(false);
  usePrompt('There are Some Unsaved Changes. Do you want to go Away?', isDataChanged);

  const [values, setValues] = useState({
    id: id,
    title: taskData?.Task[0]?.title,
    effort: taskData?.Task[0]?.effort,
    fees: Number(taskData?.Task[0]?.fees),
    descriptionOfTask: taskData?.Task[0]?.descriptionOfTask,
    easytask: taskData?.Task[0]?.easytask || false,
    isTemplate: false,
  });

  useEffect(() => {
    if (taskData) {
      setValues({
        id: id,
        title: taskData?.Task[0]?.title,
        effort: taskData?.Task[0]?.effort,
        fees: Number(taskData?.Task[0]?.fees),
        descriptionOfTask: taskData?.Task[0]?.descriptionOfTask,
        easytask: taskData?.Task[0]?.easytask || false,
        isTemplate: false,
      });
    }
  }, [taskData, id]);

  const [updateTask, { error: errorUpdateTask }] = useMutation(UPDATE_TASK);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    setDataChanged(true);
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.checked });
    setDataChanged(true);
  };

  if (taskDataLoading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#55555542',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <CircularProgress sx={{ alignSelf: 'center', mt: '10%' }} />
      </Box>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDataChanged(false);

    await updateTask({
      variables: {
        id: id,
        data: {
          id: id,
          title: values?.title,
          effort: values?.effort,
          fees: Number(values?.fees),
          descriptionOfTask: values?.descriptionOfTask,
          easytask: values?.easytask || false,
          isTemplate: false,
        },
      },
    });
    if (errorUpdateTask) {
      Swal.fire({
        title: 'Something went wrong, please try again',
        icon: 'error',
        showCloseButton: true,
        confirmButtonText: 'Ok',
      });
    } else {
      Swal.fire({
        title: 'Task Updated successfully',
        icon: 'success',
        showCloseButton: true,
        confirmButtonText: 'Ok',
        didDestroy: () => {
          return navigate('/marketplace/tasks');
        },
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={3}
          sx={{ position: 'relative', width: '80%', margin: 'auto', p: { xs: 1, md: 10 }, pt: { xs: 5, md: 10 } }}
        >
          <Button
            onClick={() => {
              navigate(-1);
            }}
            sx={{
              color: 'var(--primaryBlue)',
              position: { md: 'absolute' },
              top: { md: '10px' },
              left: { md: '10px' },
              textTransform: 'none',
            }}
            startIcon={<ArrowBackIosNewIcon />}
          >
            <Typography variant="h6">Return</Typography>
          </Button>
          <Typography sx={{ fontSize: '24px', fontWeight: 'bold', width: '100%', lineHeight: '16px' }}>Edit Task</Typography>
          {/* TITLE START*/}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Typography>Title(35 characters) *</Typography>
              <FilledInput
                required
                fullWidth
                id="title-input"
                type="text"
                inputProps={{ maxLength: 35 }}
                value={values.title}
                name="title"
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          {/* TITLE END*/}
          {/* easytask START*/}
          {/* <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'row', align: 'center', justifyContent: 'center', mt: 2 }}>
            <FormControl fullWidth>
              <Typography>Easy task? *</Typography>
              <Checkbox
                sx={{ width: '20px', height: '20px', m: 2 }}
                checked={values.easytask}
                name="easytask"
                onChange={handleCheckboxChange}
              />
            </FormControl>
          </Grid> */}
          {/* easytask END*/}
          {/* EFFORT START*/}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Typography>Effort</Typography>
              <FilledInput required fullWidth id="effort-input" type="text" value={values.effort} name="effort" onChange={handleChange} />
            </FormControl>
          </Grid>
          {/* EFFORT END*/}
          {/* Fees START*/}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Typography>Fees</Typography>
              <FilledInput required fullWidth id="fees-input" type="number" value={values.fees} name="fees" onChange={handleChange} />
            </FormControl>
          </Grid>
          {/* Fees END*/}

          {/* Describe START*/}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Typography>Describe your project and bring task details</Typography>
              <FilledInput
                required
                fullWidth
                id="description-input"
                type="text"
                sx={{ height: 'auto' }}
                value={values.descriptionOfTask}
                name="descriptionOfTask"
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
          {/* Describe END*/}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button
                disabled={taskDataLoading}
                type="submit"
                variant="contained"
                sx={{ backgroundColor: 'var(--primaryBlue)', width: '200px', py: 2 }}
              >
                Update
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default EditTaskForm;
