import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Chip, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import Style from './ProposerProfile.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_MENTORED_PROPOSALS, GET_USER_BY_ID } from 'Queries';
import ReturnButton from 'Components/ReturnButton/ReturnButton';
import Rating from '@mui/material/Rating';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper';
import { GET_USER_ROLES } from 'Queries';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import ProposalCardLessDet from 'Components/ProposalCard/ProposalCardLessDet';
import { Role } from 'Types';

function UserProfile() {
  const { id } = useParams();
  const { username } = useNetworkAuth();
  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_USER_BY_ID, {
    variables: { id: id },
  });
  const { data: userLabelsData } = useQuery(GET_USER_ROLES, {
    variables: { username: data?.User[0]?.username },
  });

  const roles = userLabelsData?.User[0]?.roles;

  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    if (roles) {
      roles.forEach((role: Role) => {
        if (role.name === 'Mentor') {
          setIsMentor(true);
        }
      });
    }
  }, [userLabelsData]);

  const [mentoringProposals, setMentoringProposals] = useState<any>([]);
  // const [ratingValue, setRatingValue] = React.useState<number | null>(3);

  const [showProposals, setShowProposals] = React.useState(false);
  const userRoles = data?.User[0]?.roles;

  useEffect(() => {
    if (userRoles) {
      userRoles.forEach((role: Role) => {
        if (role.name === 'Proposer') {
          setShowProposals(true);
        }
      });
    }
  }, [userRoles]);

  const {
    data: mentoringProposalsData,
    loading: mentoringProposalsLoading,
    error: mentoringProposalsError,
  } = useQuery(GET_USER_MENTORED_PROPOSALS, {
    variables: { username: data?.User[0]?.username },
  });

  useEffect(() => {
    setMentoringProposals(mentoringProposalsData);
  }, [mentoringProposalsData]);

  const fundedProposals = mentoringProposals?.contracts?.filter((prop: any) => prop?.relatedProposal?.fundingStatus.name === 'Funded');
  const actuallyMentoringProposals = mentoringProposals?.contracts?.filter(
    (prop: any) => prop?.relatedProposal?.fundingStatus.name !== 'Funded',
  );

  if (loading)
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ alignSelf: 'center', mt: '10%' }} />
      </Box>
    );

  return (
    <Grid container spacing={3} style={{ margin: 'auto', width: '80%', paddingTop: '50px', position: 'relative' }}>
      <Grid container md={2} sx={{ alignItems: 'flex-start' }}>
        <ReturnButton />
      </Grid>
      <Grid container sx={{ justifyContent: 'space-between' }} md={10}>
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Avatar
              src={data?.User[0]?.picurl}
              sx={{
                width: '178px',
                height: '178px',
                borderRadius: '100px',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '25px',
              }}
            ></Avatar>
            {/* <Box
              className="user-img"
              sx={{
                width: '178px',
                height: '178px',
                background: 'red',
                borderRadius: '100px',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '25px',
              }}
            ></Box> */}
            <Box className="side-img-info">
              <Typography component="h1" variant="h6" fontWeight={700} fontSize="24px" lineHeight="16px" marginBottom={'23px'}>
                {data?.User[0].username}
              </Typography>
              {/* MAP TO ADD */}
              <Typography fontWeight={400} fontSize="16px" lineHeight="16px" marginBottom={'16px'}>
                {data?.User[0].profile || 'No profile'}
              </Typography>
              <Box marginBottom={'17px'}>
                <Rating name="proposer-rating" value={data?.User[0].avgScore} readOnly />
              </Box>
              {isMentor && (
                <Box className={Style.mentorMetricsBox}>
                  <Typography sx={{ mb: '14px' }}>Projects being mentored: {mentoringProposals?.Proposal?.length || 0}</Typography>
                  {/* <Typography sx={{ mb: '14px' }}>Projects mentored funded: {fundedProposals?.length || 0}</Typography>
                  <Typography sx={{ mb: '14px' }}>Projects mentored: {mentoringProposals?.contracts?.length || 0}</Typography> */}
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={5} md={4}>
          {/* URLS TO MAP */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', flexDirection: 'column' }}>
            {data?.User[0].URLs?.map((url: string, index: number) => {
              return (
                <Box key={index} display="flex" alignItems={'center'}>
                  <Typography className={Style.subtitles}>URL: </Typography>
                  <Typography>
                    <a
                      style={{ color: 'var(--linkBlue)', marginLeft: '5px', textDecoration: 'underline' }}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {url}
                    </a>
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Grid>
        {/* <Grid container> */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', mt: 5, alignItems: 'center' }}>
            <Typography className={Style.subtitles}>Language</Typography>
            {data?.User[0].languages.map((lang: any) => {
              return (
                <Chip sx={{ color: 'white', backgroundColor: 'var(--primaryBlue)', marginLeft: '10px' }} key={lang.id} label={lang.name} />
              );
            })}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mt: 3 }}>
            <Typography className={Style.subtitles}>Bio</Typography>
            <Box
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <Typography>{data?.User[0].bio || <Typography>No bio</Typography>}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', mt: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography className={Style.subtitles}>Tags: </Typography>
            {data?.User[0].interestedIn.map((tag: any) => {
              return (
                <Chip
                  sx={{ color: 'white', backgroundColor: 'var(--primaryBlue)', marginLeft: '10px', marginTop: '7px' }}
                  key={tag.name}
                  label={tag.name}
                />
              );
            })}
          </Box>
        </Grid>
      </Grid>
      {showProposals && (
        <Grid item xs={12} sx={{ p: 5 }}>
          <Typography sx={{ pt: 2 }} className={Style.bottomSubtitles}>
            Proposals published by {data?.User[0].username}:
          </Typography>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar]}
            spaceBetween={0}
            slidesPerView={3}
            centerInsufficientSlides
            navigation
            pagination={{ clickable: true }}
          >
            {!data?.User[0]?.proposals.length ? (
              <Typography className={Style.bottomSubtitles2}>NO PROPOSALS PUBLISHED YET</Typography>
            ) : (
              data?.User[0]?.proposals?.map((proposal: any, i: number) => {
                return (
                  <SwiperSlide key={`Swiper ${i}`}>
                    <Box sx={{ ml: 8 }}>
                      <ProposalCardLessDet
                        key={i}
                        title={proposal?.title}
                        detailedPlan={proposal?.detailedPlan}
                        id={proposal?.id}
                        challenge={proposal?.challenge}
                        fstatus={proposal?.fundingStatus}
                        fundingStatus={proposal?.fundingStatus}
                        status={proposal?.status}
                        proposedBy={proposal?.proposedBy}
                      />
                    </Box>
                  </SwiperSlide>
                );
              })
            )}
          </Swiper>
        </Grid>
      )}
      {mentoringProposals && isMentor && (
        <Grid item xs={12} sx={{ p: 5 }}>
          <Typography sx={{ pt: 2 }} className={Style.bottomSubtitles}>
            Proposals Mentored by {data?.User[0].username}:
          </Typography>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar]}
            spaceBetween={0}
            slidesPerView={3}
            centerInsufficientSlides
            navigation
            pagination={{ clickable: true }}
          >
            {mentoringProposals?.Proposal?.length ? (
              mentoringProposals?.Proposal?.map((proposal: any, i: number) => {
                return (
                  <SwiperSlide key={`Swiper ${i}`}>
                    <Box sx={{ ml: 8 }}>
                      <ProposalCardLessDet
                        key={i}
                        title={proposal?.title}
                        detailedPlan={proposal?.detailedPlan}
                        id={proposal?.id}
                        challenge={proposal?.challenge}
                        fstatus={proposal?.fundingStatus}
                        fundingStatus={proposal?.fundingStatus}
                        status={proposal?.status}
                        proposedBy={proposal?.proposedBy}
                      />
                    </Box>
                  </SwiperSlide>
                );
              })
            ) : (
              <Typography className={Style.bottomSubtitles2}>NO MENTORING PROPOSALS YET</Typography>
            )}
          </Swiper>
        </Grid>
      )}
      <Grid item xs={12} sx={{ p: 5 }}>
        <Typography className={Style.bottomSubtitles}>Users Feedback about {data?.User[0].username}:</Typography>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar]}
          spaceBetween={0}
          slidesPerView={3}
          centerInsufficientSlides
          navigation
          pagination={{ clickable: true }}
        >
          {!data?.User[0].rating.length ? (
            <Typography className={Style.bottomSubtitles2}>NO FEEDBACK RECEIVED YET</Typography>
          ) : (
            data?.User[0].rating.map((rating: any, i: number) => {
              return (
                <>
                  <SwiperSlide key={`Swiper ${i}`}>
                    <Paper
                      elevation={3}
                      sx={{
                        overflow: 'hidden',
                        display: 'flex',
                        width: '220px',
                        height: '150px',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px',
                        margin: '10px',
                        textAlign: 'center',
                        ml: 8,
                      }}
                    >
                      <Box sx={{ flexDirection: 'column' }}>
                        <Typography variant="h6">{rating.sentBy}</Typography>
                        <Typography sx={{ fontSize: '14px' }}>{rating.sentOn.formatted.slice(0, 10)}</Typography>
                      </Box>
                      <Rating name="proposer-rating" value={rating.score} readOnly />
                      <Typography variant="body2">{rating.feedback}</Typography>
                    </Paper>
                  </SwiperSlide>
                </>
              );
            })
          )}
        </Swiper>
      </Grid>

      <Grid xs={12} sx={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
        {data?.User[0].username !== username && (
          <Button
            sx={{
              padding: '10px 30px',
              marginBottom: '25px',
              color: 'white',
              backgroundColor: 'var(--primaryBlue)',
              '&:hover': { backgroundColor: 'var(--primaryBlueHover)' },
            }}
            onClick={() => navigate(`/projects/myMessages/${data?.User[0].username}`)}
          >
            CONTACT
          </Button>
        )}
      </Grid>
    </Grid>
  );
}

export default UserProfile;
