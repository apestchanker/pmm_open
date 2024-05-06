import { useQuery } from '@apollo/client';
import { Grid, Skeleton, Typography } from '@mui/material';
import MentorCardComponent from 'Components/MentorCard';
import ProposerCardComponent from 'Components/ProposerCard';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { GET_RECOMMENDED_PROPOSERS } from 'Queries';
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

export const Proposers = ({ tab, user, searched, setIdArraysUsers, filteredUsers, loadingFilteredUsers }: any) => {
  const { data, loading, error } = useQuery(GET_RECOMMENDED_PROPOSERS, {
    variables: {
      username: user,
    },
  });
  const { username } = useNetworkAuth();
  const [proposers, setProposers] = React.useState([]);
  useEffect(() => {
    if (filteredUsers?.User.length > 0) {
      setProposers(filteredUsers?.User);
      return;
    }
    if (searched.length > 0) {
      setProposers(searched);
      setIdArraysUsers(searched.map((proposer: any) => proposer.id));
      return;
    }
    if (data !== undefined && searched.length === 0) {
      setProposers(data.User[0].proposersWithSimilarInterests);
      setIdArraysUsers(data.User[0].proposersWithSimilarInterests.map((proposer: any) => proposer.id));
    }
  }, [data, loading, tab, searched, filteredUsers, loadingFilteredUsers]);
  useEffect(() => {
    if (filteredUsers?.User.length === 0) {
      Swal.fire({
        title: 'Filter does not match any proposer',
        text: 'Please try again',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
  }, [filteredUsers]);
  return (
    <div>
      {tab === 'Proposers' &&
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
        ) : proposers?.length > 0 ? (
          <Grid container>
            {proposers?.map((mentor: any) => {
              while (mentor?.username != username) {
                return (
                  <Grid item xs={12} sm={6} md={3} key={`${mentor.id}-grid`}>
                    <ProposerCardComponent
                      id={mentor?.id}
                      mentorUsername={mentor?.username}
                      profile={mentor?.profile}
                      rating={mentor?.avgScore}
                      bio={mentor?.bio}
                      URLs={mentor?.URLs}
                      interests={mentor?.interestedIn}
                    />
                  </Grid>
                );
              }
            })}
          </Grid>
        ) : (
          <Typography>No proposers found</Typography>
        ))}
    </div>
  );
};
