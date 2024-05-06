import Grid from '@mui/material/Grid';

const Cards = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid container sx={{ width: '100%' }}>
      {children}
    </Grid>
  );
};

export default Cards;
//container sm={6} columnSpacing={{ sm: 1, lg: 1, xl: 1 }} sx={{ width: '100%' }}
