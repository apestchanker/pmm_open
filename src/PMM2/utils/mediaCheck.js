import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const mediaCheck = (breakpointValue, type) => {
  const theme = useTheme();
  const isMediaC = useMediaQuery(theme.breakpoints[type](breakpointValue));
  return isMediaC;
};

export default mediaCheck;
