import { CardMedia, CircularProgress, Grid, Typography } from '@mui/material';
import Joyride from 'react-joyride';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import Style from './Landing.module.css';
import PersonImg from '../../Assets/landingPagePerson.png';
import CardanoLogo from '../../Assets/cardano-logo.svg';
import CatalystLogo from '../../Assets/catalyst-logo.svg';
import AimLogo from '../../Assets/aim-logo.svg';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { useLazyQuery, useMutation, useQuery, useApolloClient } from '@apollo/client';
import {
  GET_ALL_USER_PROPOSALS,
  GET_RECOMMENDED_PROPOSALS,
  GET_RECOMMENDED_PROPOSERS,
  GET_MENTORING_PROPOSALS,
  GET_RECOMMENDED_MENTORS,
  GET_USER_ROLES,
  GET_LATEST_ACTIVITIES,
  GET_USER_ID,
  MERGE_USER,
  GET_USER_MEMBER_SINCE,
} from 'Queries';
import { useAuth0 } from '@auth0/auth0-react';
import ProposalsCard from './YouMightLikeComponents/ProposalsCard';
import SearchCard from './YouMightLikeComponents/SearchCard';
import ProposersCard from './YouMightLikeComponents/ProposersCard';
import Swal from 'sweetalert2';
import { Step } from 'Types';
import { date } from 'yup/lib/locale';
import { DateTime } from 'luxon';
import { useNavigate } from 'react-router-dom';

function LandingAuth() {
  const { user, isAuthenticated } = useAuth0();
  const { roles, loginUser } = useNetworkAuth();
  const username = user?.nickname;
  const [proposalsArr, setProposalsArr] = useState<any>([]);
  const [recommendedProposals, setRecommendedProposals] = useState<any>([]);
  const [recommendedProposers, setRecommendedProposers] = useState<any>([]);
  const [recommendedMentors, setRecommendedMentors] = useState<any>([]);
  const [mentoringProposals, setMentoringProposals] = useState<any>([]);

  const { data: userLabelsData, loading: labelsLoading } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });
  const { data: userMemberSince, loading: memberSinceLoading } = useQuery(GET_USER_MEMBER_SINCE, {
    variables: { username: username },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!memberSinceLoading) {
      if (userMemberSince !== undefined && userMemberSince.User[0]?.memberSince?.formatted === '2022-01-03T00:00:00Z') {
        navigate('/tour');
      }
    }
  }, [userMemberSince, memberSinceLoading]);

  ////////////
  // GUARDADO DEL USUARIO DE AUTH0 en la BD de PMM
  ///////////
  // Usa Queries de /Queries -- GET_USER_ID para validar si el usuario ya existe y MERGE_USER para crear/modificar el usuario
  const datex = '2022-01-01T00:00:00Z';
  //const datex = DateTime.now().toString();

  if (isAuthenticated) {
    try {
      //ESTE TRY DESPUES SE PUEDE ELIMINAR, ES PARA TESTS
      // Busco el usuario que viene de AUTH0 en la BD de PMM, este dato debiera usarse en el useEffect siguiente
      // Cambiar para traer directamente el user en base al id que devuelve auth0
      const [fetchID, { data: userID, loading: userLoading }] = useLazyQuery(GET_USER_ID, {
        variables: { username: username },
      });
      const [mergeUser, { data }] = useMutation(MERGE_USER);

      /* useEffect(() => {
        async () => {
          const result = await fetchID();
        };
      }, []); */

      // Pregunto si el usuario que viene de AUTH0 ya está en la BD de PMM, para no sobreescribir el MemberSince
      useEffect(() => {
        (async () => {
          await fetchID();
        })();
        (async () => {
          //if (!userID?.User[0]?.id) {
          if (userID?.User[0]?.id === null || userID?.User[0]?.id === undefined) {
            //Si el usuario no existe, lo creo y actualizo todos los datos mandatorios
            // utilizar sub como id.
            await mergeUser({
              variables: {
                where: {
                  id: user?.sub,
                },
                data: {
                  username: user?.nickname,
                  email: user?.email,
                  memberSince: { formatted: datex },
                  password: '',
                  isActive: true,
                  id: user?.sub,
                },
              },
            }).then(() => {
              window.location.reload();
            });
            /* if (user?.email && user?.nickname) {
              await loginUser?.({
                id: user.email,
                username: user.nickname,
                email: user.email,
                roles: userLabelsData?.User[0]?.roles.map((r: any) => r.name),
                labels: userLabelsData?.User[0]?.labels,
              });
            } */
          } else {
            if (user?.sub && user?.nickname && user?.email) {
              loginUser?.({
                id: user.sub,
                username: user.nickname,
                email: user.email,
                roles: userLabelsData?.User[0]?.roles.map((r: any) => r.name),
                labels: userLabelsData?.User[0]?.labels,
              });
            }
          }
        })();

        return () => {
          // this now gets called when the component unmounts
        };
      }, []);
    } catch (err) {
      console.log(err);
    }
  }

  const [steps, setSteps] = useState<Step[]>([]);

  /*   //TOUR VARIABLES
  const stopLandingTour = localStorage.getItem('stopLandingTour');
  const stopAllTours = localStorage.getItem('stopAllTours'); */

  const { data: notificationData, refetch } = useQuery(GET_LATEST_ACTIVITIES, {
    pollInterval: 10000,
    variables: {
      username: username,
    },
  });

  const [userRoles, setUserRoles] = useState<string[]>([]);
  useEffect(() => {
    if (!labelsLoading) {
      setUserRoles(userLabelsData?.User[0]?.roles.map((role: any) => role.name) || []);
    }
  }, [labelsLoading]);

  const isProposer = userRoles?.includes('Proposer');
  const isMentor = userRoles?.includes('Mentor');

  const [notificationsState, setNotificationsState] = useState([]);

  useEffect(() => {
    if (notificationData) {
      setNotificationsState(notificationData?.User[0]?.hasnotification || []);
    }
  }, [notificationData]);

  /* const { data, loading, error } = useQuery(GET_ALL_USER_PROPOSALS, {
    variables: { username: username },
  }); */
  const [fetchProposals, { data, loading, error }] = useLazyQuery(GET_ALL_USER_PROPOSALS, { fetchPolicy: 'network-only' });
  const [fetchRecommendedProposals, { data: recommendedProposalsData, loading: recommendedLoading }] = useLazyQuery(
    GET_RECOMMENDED_PROPOSALS,
    {
      fetchPolicy: 'network-only',
    },
  );
  const [fetchRecommendedProposers, { data: recommendedProposersData, loading: recommendedProposersLoading }] = useLazyQuery(
    GET_RECOMMENDED_PROPOSERS,
    {
      fetchPolicy: 'network-only',
    },
  );
  const [fetchMentoringProposals, { data: mentoringProposalsData, loading: mentoringProposalsLoading }] = useLazyQuery(
    GET_MENTORING_PROPOSALS,
    {
      fetchPolicy: 'network-only',
    },
  );
  const [fetchRecommendedMentors, { data: recommendedMentorsData, loading: recommendedMentorsLoading }] = useLazyQuery(
    GET_RECOMMENDED_MENTORS,
    {
      fetchPolicy: 'network-only',
    },
  );

  useEffect(() => {
    fetchProposals({ variables: { username } });
    fetchRecommendedProposals({ variables: { username } });
    fetchRecommendedProposers({ variables: { username } });
    fetchMentoringProposals({ variables: { username } });
    fetchRecommendedMentors({ variables: { username } });
    /*     if (stopLandingTour == null && stopAllTours == null) {
      setSteps([
        {
          target: '.proposals-container',
          content: "Here you'll find proposals that you made or are currently being mentored by you.",
        },
        {
          target: '.latest-activities',
          content: 'This are your latest activities!',
        },
        {
          target: '.might-like-container',
          content: 'Here you can find things that might be interesting to you!',
        },
        {
          target: '.useful-links',
          content: 'Here you can find useful links to our communities!',
        },
      ]);
    } */
  }, []);

  useEffect(() => {
    setProposalsArr(data);
    setRecommendedProposals(recommendedProposalsData);
    setRecommendedProposers(recommendedProposersData);
    setMentoringProposals(mentoringProposalsData);
    setRecommendedMentors(recommendedMentorsData);
  }, [data, recommendedProposalsData, recommendedProposersData, recommendedMentorsData]);

  if (loading || recommendedLoading) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ alignSelf: 'center', mt: '10%' }} />
      </Box>
    );
  }

  const handleJoyrideEnd = (data: any) => {
    const { action, index, status, type } = data;
    if (status === 'finished') {
      localStorage.setItem('stopLandingTour', 'true');
    }
    if (status === 'skipped') {
      Swal.fire({
        title: 'Skip tour!',
        text: 'Skip all tours or just this one?',
        icon: 'info',
        confirmButtonText: 'No, just this one',
        showDenyButton: true,
        denyButtonText: 'All',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('stopLandingTour', 'true');
        } else if (result.isDenied) {
          localStorage.setItem('stopAllTours', 'true');
        }
      });
    }
    return;
  };

  return (
    <Box>
      <Box sx={{ width: '90%', margin: 'auto', marginTop: '20px' }}>
        <Typography className={Style.mainTitle} sx={{ width: '100%' }}>
          Welcome to Proposals Mentors Marketplace
        </Typography>
        <Box>
          {/* TOP BOX */}
          <Grid container className={Style.cardContainer}>
            {/* TOP LEFT ITEM START */}
            <Grid
              item
              xs={12}
              md={7}
              className={Style.card}
              sx={{
                maxWidth: '700px',
                maxHeight: { xs: 'none', md: '320px' },
                padding: '0 !important',
                overflow: 'hidden',
                marginBottom: { xs: '30px' },
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                <CardMedia
                  component="img"
                  height="100%"
                  image={PersonImg}
                  alt="person"
                  sx={{ maxHeight: '350px', height: { xs: '30vh', md: 'auto' }, minHeight: '350px' }}
                />
                <Box sx={{ padding: '25px' }}>
                  <Typography sx={{ fontSize: '16px' }}>
                    Our purpose is to facilitate proposal creation, promotion and execution, by enabling project proposers to match and
                    partner with skilled mentors of Cardano&apos;s community
                    <br /> that are willing to mentor projects and proposers. <br />
                    On this platform we work together to achieve outstanding results, value and increase the chances of success.
                  </Typography>
                  <Typography mt={2} sx={{ fontSize: '18px', fontWeight: '500' }}>
                    Welcome to PMM.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {/* TOP LEFT ITEM END */}
            {/* TOP RIGHT ITEM START */}
            <Grid
              item
              xs={12}
              md={4}
              className={`${Style.card} proposals-container`}
              sx={{ padding: '7px', maxHeight: '320px', marginBottom: { xs: '20px' } }}
            >
              <Typography className={Style.title}>My Proposals</Typography>
              <hr />
              <Box sx={{ height: '260px', overflowY: 'auto' }} id={Style.proposalsCard}>
                {isProposer &&
                  proposalsArr?.Proposal?.map((proposal: any, index: number) => {
                    return <ProposalsCard key={index} id={proposal?.id} title={proposal?.title} text={proposal?.detailedPlan} />;
                  })}
                {isMentor &&
                  mentoringProposals?.contracts?.map((item: any, index: number) => {
                    return (
                      <ProposalsCard
                        key={index}
                        id={item.relatedProposal?.id}
                        title={item.relatedProposal?.title}
                        text={item.relatedProposal?.detailedPlan}
                      />
                    );
                  })}
              </Box>
            </Grid>
          </Grid>
          {/* TOP RIGHT ITEM END */}
          {/* BOTTOM BOX */}
          {/* LEFT BOTTOM BOX START*/}
          <Grid container className={Style.cardContainer}>
            <Grid
              item
              xs={12}
              md={6}
              className={`${Style.card} might-like-container`}
              sx={{ padding: '7px', maxHeight: '345px', overflow: 'hidden', marginBottom: { xs: '30px' } }}
            >
              <Typography className={Style.title}>Things you might like</Typography>
              <hr />
              <Box sx={{ height: '290px', overflowY: 'auto' }} id={Style.mightLikeCard}>
                {isMentor &&
                  recommendedProposals?.User?.[0]?.proposalsWithSimilarInterests?.map((proposal: any, index: number) => {
                    return <ProposalsCard id={proposal.id} key={index} title={proposal.title} text={proposal.detailedPlan} />;
                  })}
                {isMentor &&
                  recommendedProposers?.User?.[0]?.proposersWithSimilarInterests?.map((user: any, index: number) => {
                    return <ProposersCard id={user.id} key={index} username={user.username} bio={user.bio} />;
                  })}
                {isProposer &&
                  recommendedMentors?.User?.[0]?.mentorsWithSimilarInterests?.map((user: any, index: number) => {
                    return <ProposersCard id={user.id} key={index} username={user.username} bio={user.bio} />;
                  })}
              </Box>
            </Grid>
            {/* LEFT BOTTOM BOX END*/}
            {/* RIGHT BOTTOM BOX START*/}
            <Grid item xs={12} md={5} sx={{ maxHeight: '140px', paddingBottom: '25px' }}>
              {/* SEARCH APPEARANCES END */}
              <Box className={`${Style.card} latest-activities`} sx={{ padding: '7px', overflow: 'hidden' }}>
                <Typography className={Style.title}>Latest Activities</Typography>
                <Box
                  sx={{
                    overflowY: 'auto',
                    height: '136px',
                  }}
                >
                  {/* <hr /> */}
                  {notificationsState.length > 0 ? (
                    notificationsState.map((notification: any, index: number) => {
                      return (
                        <SearchCard
                          key={`activity ${index}`}
                          id={`activity ${index}`}
                          text={notification.message.split(' - ')[1]}
                          date={notification.createdOn.formatted}
                          index={index}
                        />
                      );
                    })
                  ) : (
                    <SearchCard id={`activity 1`} text={'Nothing to show here..'} date={null} index={0} />
                  )}
                </Box>
                {/* <Typography className={Style.title}>Search Appearances</Typography> */}
              </Box>
              {/* SEARCH APPEARANCES END */}
              {/* USEFUL LINKS START */}
              <Box
                mt={1}
                className={`${Style.card} useful-links`}
                sx={{ marginBottom: { xs: '30px' }, padding: '10px', maxHeight: { sm: 'none', md: '175px' }, marginTop: '35px' }}
              >
                <Typography mb={2} className={Style.title}>
                  Useful Links
                </Typography>
                <Grid container sx={{ justifyContent: 'space-evenly', pB: '25px' }}>
                  <Grid item xs={6} md={2} sx={{ textAlign: 'center' }}>
                    <a href="https://cardanoaim.io/" target="_blank" rel="noopener noreferrer">
                      <img className={Style.logo} src={AimLogo} alt="Link for Cardano Aim" />
                      <Typography className={Style.logoTitle}>CARDANO AIM</Typography>
                    </a>
                  </Grid>
                  <Grid item xs={6} md={2} sx={{ textAlign: 'center' }}>
                    <a href="https://cardanocataly.st/" target="_blank" rel="noopener noreferrer">
                      <img className={Style.logo} src={CatalystLogo} alt="Link for Cardano Catalyst" />
                      <Typography className={Style.logoTitle}>CATALYST</Typography>
                    </a>
                  </Grid>
                  <Grid item xs={6} md={2} sx={{ textAlign: 'center' }}>
                    <a href="https://cardano.org/" target="_blank" rel="noopener noreferrer">
                      <img className={Style.logo} src={CardanoLogo} alt="Link for Cardano" />
                      <Typography className={Style.logoTitle}>CARDANO</Typography>
                    </a>
                  </Grid>
                  {/* <Grid item xs={6} md={2} sx={{ textAlign: 'center' }}>
                    <a href="" target="_blank" rel="noopener noreferrer">
                      <img className={Style.logo} src={DiscordLogo} alt="Link for PMM Discord" />
                      <Typography className={Style.logoTitle}>DISCORD</Typography>
                    </a>
                  </Grid>
                  <Grid item xs={6} md={2} sx={{ textAlign: 'center' }}>
                    <a href="" target="_blank" rel="noopener noreferrer">
                      <img className={Style.logo} src={TelegramLogo} alt="Link for PMM Telegram" />
                      <Typography className={Style.logoTitle}>TELEGRAM</Typography>
                    </a>
                  </Grid> */}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default LandingAuth;
