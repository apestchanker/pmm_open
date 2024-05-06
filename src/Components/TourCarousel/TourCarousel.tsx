import { Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar } from 'swiper';
import tourImg1 from '../../Assets/tour1.png';
import tourImg2 from '../../Assets/tour2.png';
import tourImg3 from '../../Assets/tour3.png';
import tourImg4 from '../../Assets/tour4.png';
import tourImg5 from '../../Assets/tour5.png';
import tourImg6 from '../../Assets/tour6.png';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function TourCarousel({ handleNext, activeStep, stepLength }: any) {
  const svgArray: any = [
    {
      img: tourImg1,
      text: 'While in profile you can change all your personal settings and preferences',
    },
    {
      img: tourImg2,
      text: `Inside Marketplace you will find your proposals, tasks, our search engine
    “find your match” to look up for Proposers and mentors, collaborators and tasks or advanced search for an specific result.`,
    },
    {
      img: tourImg3,
      text: `Our search engine will show results this way and will let you contact or
        send a request to any proposal/proposers/mentor of your interest according toyour profile settings.`,
    },
    {
      img: tourImg4,
      text: `Our search engine will show results this way and will let you contact or
        send a request to any task or collaborator of your interest according to
        your profile settings.`,
    },
    {
      img: tourImg5,
      text: `Inside Relationships you’ll find Interactions, information related to any person you sent or received a request, also you can contact, set agreements,  send messages give feedback flag bad behaviors, or delete.`,
    },
    {
      img: tourImg6,
      text: `Within Feedback you’ll be able o check given and received feedback from
        people in the platform with who you have already interacted with! This will 
        help others to get to know what to expect from others experience.`,
    },
  ];
  return (
    <Box>
      <Swiper modules={[Navigation, Pagination, Scrollbar]} spaceBetween={50} slidesPerView={1} navigation pagination={{ clickable: true }}>
        {svgArray.map((x: any, i: number) => {
          return (
            <SwiperSlide key={`Swiper ${i}`}>
              {/* <Button onClick={handleNext}>{activeStep === stepLength - 1 ? 'Finish' : 'Next'}</Button> */}
              <Paper
                elevation={3}
                sx={{
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px',
                  margin: '10px',
                  textAlign: 'center',
                }}
              >
                <Box sx={{ backgroundColor: '#D0E2E4', width: '50%', padding: '25px' }}>
                  <Typography variant="body1">{x.text}</Typography>
                </Box>
                <Box sx={{ padding: '35px', flexDirection: 'column', height: '650px', overflow: 'hidden', width: '100%' }}>
                  <img style={{ maxHeight: '650px', border: '2px solid black' }} src={x.img} alt="" />
                </Box>
              </Paper>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
}

export default TourCarousel;
