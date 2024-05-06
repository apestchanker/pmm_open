import { Box, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Style from './MyProjectsComponent.module.css';
import InteractionsTable from './InteractionsTable';
import ModalSendRequests from 'Components/ModalSendRequests';
import Swal from 'sweetalert2';
import Joyride from 'react-joyride';
import { Step } from 'Types';

function MyProjectsComponent() {
  //TOUR VARIABLES
  const stopInteractionsTour = localStorage.getItem('stopInteractionsTour');
  const stopAllTours = localStorage.getItem('stopAllTours');

  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    //SHOW TOUR?
    if (stopInteractionsTour == null && stopAllTours == null) {
      setSteps([
        {
          target: '[data-step="1"]',
          content: `Inside Interactions you'll find information related to any person you sent a request, also you can contact, flag bad behaviors, or delete.
          If you want more information try clicking on the person's user. In addition to that, you have the feedback tab, 
          there you'll find both, received and given feedback within the community`,
        },
      ]);
    }
  }, []);

  const handleJoyrideEnd = (data: any) => {
    const { action, index, status, type } = data;

    if (status === 'finished') {
      localStorage.setItem('stopInteractionsTour', 'true');
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
          localStorage.setItem('stopInteractionsTour', 'true');
        } else if (result.isDenied) {
          localStorage.setItem('stopAllTours', 'true');
        }
      });
    }
    return;
  };

  return (
    <Box className={`${Style.mainContainer}`} data-step="1">
      {/* <Joyride
        steps={steps}
        callback={handleJoyrideEnd}
        floaterProps={{
          placement: 'top',
          disableFlip: true,
        }}
        showProgress
        continuous
        showSkipButton
        styles={{
          buttonBack: {
            backgroundColor: 'var(--textDark)',
            color: 'white',
          },
          buttonNext: {
            backgroundColor: 'var(--primaryBlue)',
          },
          tooltipContent: {
            fontFamily: 'inherit',
          },
          tooltip: {
            fontFamily: 'inherit',
          },
          options: {
            zIndex: 1000,
          },
        }}
      /> */}
      <Grid container>
        {/* SORT AND FILTER START */}
        <Grid item xs={10}>
          <ModalSendRequests />
        </Grid>
        <Grid item xs={2}>
          {/* <MyProjectsSortModal /> */}
          {/* FILTER BUTTON DISABLED UNTIL IT IS DETERMINED NEEDED */}
          {/* <MyProjectsFilterModal /> */}
        </Grid>
        {/* SORT AND FILTER END */}
        {/* TABLE START */}
        <Grid item xs={12}>
          {/* <ContactsTable /> */}
          <InteractionsTable />
        </Grid>
        {/* TABLE END */}
      </Grid>
    </Box>
  );
}

export default MyProjectsComponent;
