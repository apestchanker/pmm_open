import { Grid, Typography } from '@mui/material';

function ContactUs() {
  return (
    <>
      <Grid container sx={{ width: '80%', margin: 'auto', mt: 7 }}>
        <Grid item xs={12}>
          <Typography variant="h5">Red Flags</Typography>
        </Grid>
        <Grid item xs={12} mt={5}>
          <Typography variant="h5">Business Inquiries</Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default ContactUs;
