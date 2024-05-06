import React, { useState, useEffect, useCallback } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import ToggleButton, { Choice } from 'Components/ToggleButton';
import { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DropDown from 'Components/DropDown';
import { GET_USER_ROLES } from 'Queries';
import AddTaskForm from 'Components/TaskComponents/AddTaskForm';
import AddTaskButton from 'Components/TaskComponents/AddTaskButton';
import { Grid } from '@mui/material';
import TaskCardSmall from 'Components/TaskComponents/TaskCardSmall';
import { GET_MY_WORKING_TASKS, GET_USER_TASKS } from 'Queries/tasksQueries';

const activeChoices: Choice[] = [
  { label: 'Published', value: 'Published' },
  { label: 'Working On', value: 'WorkingOn' },
];

const Tasks = () => {
  const { username } = useNetworkAuth();
  const [status, setStatus] = useState('Published');
  const [activeSelected, setActiveSelected] = useState(0);
  const [componentToShow, setComponentToShow] = useState<string>('Tasks');
  const handleToggle = useCallback(
    (choice: Choice) => {
      setStatus(choice.value);
      setActiveSelected(activeChoices.indexOf(choice));
    },
    [username],
  );
  const { data: userLabelsData, loading: labelsLoading } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });

  const { data: userTasks, loading: userTasksLoading } = useQuery(GET_USER_TASKS, {
    pollInterval: 2000,
    variables: { username: username },
  });
  const { data: workingOnTasks, loading: workingOnTasksLoading } = useQuery(GET_MY_WORKING_TASKS, {
    pollInterval: 2000,
    variables: { username: username },
  });

  const [userRoles, setUserRoles] = useState<string[]>([]);
  useEffect(() => {
    if (userLabelsData) {
      setUserRoles(userLabelsData?.User[0]?.roles?.map((role: any) => role?.name) || []);
    }
  }, [labelsLoading]);
  const isProposer = userRoles?.includes('Proposer');
  const fundedProposal = userTasks?.User[0]?.proposals?.length > 0;

  if (componentToShow === 'AddTaskForm') {
    return <AddTaskForm setComponentToShow={setComponentToShow} />;
  } else {
    if (status === 'Published') {
      return (
        <Box sx={{ width: '90%', margin: 'auto', paddingBottom: 0, mt: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'stretch', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {isProposer && fundedProposal && <AddTaskButton setComponentToShow={setComponentToShow} />}
              <Box sx={{ marginLeft: '50px' }}>
                <ToggleButton onToggle={handleToggle} choices={activeChoices} selected={activeSelected} />
              </Box>
            </Box>
          </Box>
          <Grid container xs={12} sx={{ mt: 4 }}>
            {/* PROPOSAL COLUMN */}
            <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}></Grid>
            {/* END PROPOSAL COLUMN */}

            {/* DRAFT COLUMN */}
            <Grid
              item
              xs={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  borderBottom: '3px solid #808080',
                  fontSize: '13px',
                  width: { sm: '80%', md: '75%', lg: '60%' },
                  textAlign: 'center',
                }}
              >
                Draft
              </Typography>
              {/* TO BE REPLACED WITH LOGIC */}
            </Grid>
            {/* END DRAFT COLUMN */}

            {/* PUBLISHED COLUMN */}
            <Grid
              item
              xs={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  borderBottom: '3px solid #38D059',
                  fontSize: '13px',
                  width: { sm: '80%', md: '75%', lg: '60%' },
                  textAlign: 'center',
                }}
              >
                Published
              </Typography>
              {/* TO BE REPLACED WITH LOGIC */}
            </Grid>
            {/* END PUBLISHED COLUMN */}

            {/* STAFFED COLUMN */}
            <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                sx={{
                  borderBottom: '3px solid #FF0000',
                  width: { sm: '80%', md: '75%', lg: '60%' },
                  textAlign: 'center',
                  fontSize: '13px',
                }}
              >
                Staffed
              </Typography>
            </Grid>
            {/* END STAFFED COLUMN */}
          </Grid>
          {/* <Cards>{cards}</Cards> */}
          {/* PARA ANALIZAR, VER SI NO ES MAS DEFINIR ROWS */}
          <Grid container xs={12} sx={{ mt: 4 }}>
            {userTasks?.User[0]?.proposals?.map((proposal: any) => {
              return (
                <>
                  {/* PROPOSAL TITLE */}
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minHeight: '100px',
                      borderBottom: '2px solid grey',
                      justifyContent: 'center',
                      borderRight: '2px solid grey',
                    }}
                  >
                    <Typography variant="h6" component="h3" sx={{ fontSize: '18px' }}>
                      {proposal.title}
                    </Typography>
                  </Grid>
                  {/* END PROPOSAL TITLE */}
                  {/* DRAFT COLUMN */}
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      borderRight: '2px solid grey',
                      borderBottom: '2px solid grey',
                    }}
                  >
                    {proposal?.relatedTasks.map((task: any) => {
                      if (task.status.id === 'task-draft') {
                        return (
                          <TaskCardSmall
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            fees={task.fees}
                            effort={task.effort}
                            status={task.status.id}
                            proposalTitle={task.forProposal.title}
                          />
                        );
                      }
                    })}
                  </Grid>
                  {/* END DRAFT COLUMN */}
                  {/* PUBLISHED COLUMN */}
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      borderRight: '2px solid grey',
                      borderBottom: '2px solid grey',
                    }}
                  >
                    {proposal?.relatedTasks.map((task: any) => {
                      if (task.status.id === 'task-published') {
                        return (
                          <TaskCardSmall
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            fees={task.fees}
                            effort={task.effort}
                            status={task.status.id}
                            proposalTitle={task.forProposal.title}
                          />
                        );
                      }
                    })}
                  </Grid>
                  {/* END PUBLISHED COLUMN */}
                  {/* STAFFED COLUMN */}
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      borderBottom: '2px solid grey',
                    }}
                  >
                    {proposal?.relatedTasks.map((task: any) => {
                      if (task.status.id === 'task-staffed') {
                        return (
                          <TaskCardSmall
                            key={task.id}
                            id={task.id}
                            title={task.title}
                            fees={task.fees}
                            effort={task.effort}
                            status={task.status.id}
                            proposalTitle={task.forProposal.title}
                          />
                        );
                      }
                    })}
                  </Grid>
                  {/* END STAFFED COLUMN */}
                </>
              );
            })}
          </Grid>
          {/* FIN - PARA ANALIZAR, VER SI NO ES MAS DEFINIR ROWS */}
        </Box>
      );
    } else {
      return (
        <Box sx={{ width: '90%', margin: 'auto', paddingBottom: 0, mt: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'stretch', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              {isProposer && fundedProposal && <AddTaskButton setComponentToShow={setComponentToShow} />}
              <Box sx={{ marginLeft: '50px' }}>
                <ToggleButton onToggle={handleToggle} choices={activeChoices} selected={activeSelected} />
              </Box>
            </Box>
          </Box>

          <Grid container xs={12} sx={{ mt: 4 }}>
            {workingOnTasks?.Task?.map((task: any) => {
              return (
                <>
                  {/* PROPOSAL TITLE */}
                  <Grid
                    item
                    xs={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minHeight: '100px',
                      borderBottom: '2px solid grey',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '18px' }}>{task.title}</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={9}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '2px solid grey',
                    }}
                  >
                    <TaskCardSmall
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      fees={task.fees}
                      effort={task.effort}
                      status={task.status.id}
                      proposalTitle={task.forProposal.title}
                      applied={true}
                    />
                  </Grid>
                </>
              );
            })}
          </Grid>
        </Box>
      );
    }
  }
};

export default Tasks;
