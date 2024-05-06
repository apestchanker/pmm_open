import { Grid, Typography } from '@mui/material';
import img1 from '../../Assets/landing-img1.svg';
import img2 from '../../Assets/landing-img2.svg';
import img3 from '../../Assets/landing-img3.svg';

import React from 'react';
import Style from './Landing.module.css';
import HeaderComponent from 'Components/Header';

function LandingNoAuth() {
  return (
    <div className={Style['landing-container']}>
      <HeaderComponent />
      <div className={Style.mainContainer}>
        {/* <div style={{ width: '100%', display: 'flex', alignItems: 'start', marginTop: '56px' }}>
          <img src={Logo} alt="PMM" className={Style.mainLogo} />
        </div> */}

        <Grid container spacing={3} sx={{ backgroundColor: 'white', borderRadius: '20px', p: 4, pb: 5, mt: 3, mb: 2 }}>
          {/* FIRST IMAGE */}
          <Grid item xs={12} md={4} className={Style.individualGrid}>
            <Typography variant="h6" component="h2" sx={{ textAlign: 'center', fontSize: '36px' }}>
              1
            </Typography>
            <img src={img1} alt="" className={Style.cardImg} style={{ width: '292px' }} />
            <Typography variant="h6" component="h2" className={Style.bottomText}>
              Set your profile and preferences
            </Typography>
          </Grid>
          {/* SECOND IMAGE */}
          <Grid item xs={12} md={4} className={Style.individualGrid}>
            <Typography variant="h6" component="h2" sx={{ textAlign: 'center', fontSize: '36px' }}>
              2
            </Typography>
            <img src={img2} alt="" className={Style.cardImg} style={{ width: '262px' }} />
            <Typography variant="h6" component="h2" className={Style.bottomText}>
              Get to know our mentors and proposers community
            </Typography>
          </Grid>
          {/* THIRD IMAGE */}
          <Grid item xs={12} md={4} className={Style.individualGrid}>
            <Typography variant="h6" component="h2" sx={{ textAlign: 'center', fontSize: '36px' }}>
              3
            </Typography>
            <img src={img3} alt="" className={Style.cardImg} style={{ width: '298px' }} />
            <Typography variant="h6" component="h2" className={Style.bottomText}>
              Work together to develop stronger proposals within Project Catalyst
            </Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default LandingNoAuth;
