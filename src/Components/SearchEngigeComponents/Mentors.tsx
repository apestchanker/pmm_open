import { useQuery } from '@apollo/client';
import { Grid, Skeleton, Typography } from '@mui/material';
import MentorCardComponent from 'Components/MentorCard';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { GET_RECOMMENDED_MENTORS } from 'Queries';
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

export const Mentors = ({ tab, user, searched, setIdArraysUsers, filteredUsers, loadingFilteredUsers }: any) => {
  const { data, loading, error } = useQuery(GET_RECOMMENDED_MENTORS, {
    variables: {
      username: user,
    },
  });
  const { username } = useNetworkAuth();
  const [mentors, setMentors] = React.useState([]);
  useEffect(() => {
    if (filteredUsers?.User.length > 0) {
      setMentors(filteredUsers?.User);
      return;
    }
    if (searched.length > 0) {
      setMentors(searched);
      setIdArraysUsers(searched.map((mentor: any) => mentor.id));
      return;
    }
    if (data !== undefined && searched.length === 0) {
      setMentors(data?.User[0].mentorsWithSimilarInterests);
      setIdArraysUsers(data?.User[0].mentorsWithSimilarInterests.map((mentor: any) => mentor.id));
    }
  }, [data, loading, tab, searched, filteredUsers, loadingFilteredUsers]);
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
  const hasInterests = data?.User[0].interestedIn.length > 0;
  return (
    <div>
      {tab === 'Mentors' &&
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
        ) : mentors?.length > 0 ? (
          <Grid container>
            {mentors?.map((mentor: any) => {
              while (mentor?.username != username) {
                return (
                  <Grid item xs={12} sm={6} md={3} key={`${mentor.id}-grid`}>
                    <MentorCardComponent
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
        ) : hasInterests ? (
          <Typography>No mentors found</Typography>
        ) : (
          <Typography>No interests</Typography>
        ))}
    </div>
  );
};
