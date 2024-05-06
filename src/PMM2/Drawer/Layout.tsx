import { Box, useMediaQuery, useTheme } from '@mui/material';
import DesktopDrawer from './DesktopDrawer';
import React from 'react';
import MobileDrawer from './MobileDrawer';

interface LayoutI {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutI) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {isMobile ? (
        <Box>
          <MobileDrawer />

          {children}
        </Box>
      ) : (
        <DesktopDrawer>{children}</DesktopDrawer>
      )}
    </>
  );
};

export default Layout;
