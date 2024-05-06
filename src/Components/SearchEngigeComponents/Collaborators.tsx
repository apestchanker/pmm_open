import { useQuery } from '@apollo/client';
import { Box, Grid, Skeleton, Typography } from '@mui/material';
import CollaboratorCard from 'Components/CollaboratorComponents/CollaboratorCard';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { GET_RECOMMENDED_COLLABORATORS } from 'Queries/collaboratorQueries';
import React, { useCallback, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Interest, Skill, User } from 'Types';

export const Collaborators = ({
  tab,
  user,
  searched,
  setIdArraysUsers,
  filteredUsers,
  loadingFilteredUsers,
  userSkills,
  userInterest,
}: any) => {
  const { data, loading, error } = useQuery(GET_RECOMMENDED_COLLABORATORS, {
    variables: {
      exclude: user,
      userSkills: userSkills?.map((skill: Skill) => skill.id),
      userInterest: userInterest?.Interest?.map((interest: Interest) => interest.id),
    },
  });
  const { username } = useNetworkAuth();
  const [collaborators, setCollaborators] = React.useState([]);
  useEffect(() => {
    if (searched.length > 0) {
      setCollaborators(searched);
      setIdArraysUsers(searched.map((collaborator: any) => collaborator.id));
      return;
    }
    if (filteredUsers?.User.length > 0 && searched !== '') {
      setCollaborators(filteredUsers?.User);
      return;
    }
    if (data !== undefined && searched.length === 0) {
      setCollaborators(data?.User);
      setIdArraysUsers(data?.User.map((collaborator: any) => collaborator.id));
    }
  }, [data, loading, tab, searched, filteredUsers, loadingFilteredUsers]);
  //! Warning infinite rerendering

  useEffect(() => {
    if (filteredUsers?.User.length === 0) {
      Swal.fire({
        title: 'Filter does not match any mentor',
        text: 'Please try again',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
  }, [filteredUsers]);
  // const hasInterests = data?.User[0].interestedIn.length > 0;
  if (tab === 'Collaborators' && !loading && userSkills?.length === 0) {
    return (
      <Typography>
        No recommended collaborators to show, set skills in your profile to get recommendations or use the search bar to get collaborators.
      </Typography>
    );
  }
  return (
    <div>
      {tab === 'Collaborators' &&
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
        ) : collaborators?.length > 0 ? (
          <Grid container>
            {collaborators?.map((collaborator: any) => {
              while (collaborator?.username != username) {
                return (
                  <Grid item xs={12} sm={6} md={3} key={`${collaborator.id}-grid`}>
                    <CollaboratorCard
                      id={collaborator?.id}
                      collaboratorUsername={collaborator?.username}
                      profile={collaborator?.profile}
                      rating={collaborator?.avgScore}
                      bio={collaborator?.bio}
                      URLs={collaborator?.URLs}
                      skills={collaborator?.hasSkill}
                    />
                  </Grid>
                );
              }
            })}
          </Grid>
        ) : 1 ? (
          <Typography>No collaborators found</Typography>
        ) : (
          <Typography>No skills</Typography>
        ))}
    </div>
  );
};
