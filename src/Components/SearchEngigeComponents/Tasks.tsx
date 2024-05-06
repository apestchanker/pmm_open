import { useQuery } from '@apollo/client';
import { Grid, Skeleton, Typography } from '@mui/material';
import TaskCardBig from 'Components/TaskComponents/TaskCardBig';
import { GET_RECOMMENDED_TASKS } from 'Queries';
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

export const Tasks = ({ tab, userSkills, searched, user, setIdArraysTasks, filteredTasks, loadingFilteredTasks }: any) => {
  const { data, loading, error } = useQuery(GET_RECOMMENDED_TASKS, {
    variables: {
      skills: { id_in: userSkills.map((skill: any) => skill.id) },
      exclude: user,
    },
  });

  const [tasks, setTasks] = React.useState([]);
  useEffect(() => {
    if (filteredTasks?.Task.length > 0) {
      setTasks(filteredTasks?.Task);
      return;
    }
    if (searched.length > 0) {
      setTasks(searched);
      setIdArraysTasks(searched.map((task: any) => task.id));
      return;
    }
    if (data !== undefined && searched.length === 0) {
      setTasks(data.Task);
      setIdArraysTasks(data.Task.map((task: any) => task.id));
    }
  }, [data, loading, tab, searched, filteredTasks, loadingFilteredTasks]);
  useEffect(() => {
    if (filteredTasks?.Task.length === 0) {
      Swal.fire({
        title: 'Filter does not match any task',
        text: 'Please try again',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
  }, [filteredTasks]);

  if (tab === 'Tasks' && !loading && userSkills?.length === 0) {
    return (
      <Typography>
        No recommended tasks to show, set skills in your profile to get recommendations or use the search bar to get Tasks.
      </Typography>
    );
  }

  return (
    <div>
      {tab === 'Tasks' &&
        (loading ? (
          <Grid container justifyContent="center">
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={382} width={344} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={382} width={344} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={382} width={344} />
            </Grid>
          </Grid>
        ) : tasks?.length > 0 ? (
          <Grid container>
            {tasks?.map((task: any) => {
              return (
                <Grid item xs={12} sm={6} md={3} key={`${task.id}-grid`}>
                  <TaskCardBig
                    title={task.title}
                    fees={task.fees}
                    effort={task.effort}
                    proposalTitle={task.forProposal.title}
                    description={task.descriptionOfTask}
                    skills={task.neededSkills}
                    id={task.id}
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography>No tasks found</Typography>
        ))}
    </div>
  );
};
