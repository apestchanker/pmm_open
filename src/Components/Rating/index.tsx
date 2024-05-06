import { Box, Typography } from '@mui/material';
import { ReactComponent as Star } from 'Assets/star.svg';

const Rating = ({ rating }: { rating: number | null }) => {
  if (rating === null) {
    return (
      <>
        <Typography>Not rated yet</Typography>
      </>
    );
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Typography fontSize="14px" fontWeight={400}>
        {rating}
      </Typography>
      <Box sx={{ paddingLeft: '5px' }}>
        <Star width={15} height={15} />
      </Box>
    </Box>
  );
};
export default Rating;
