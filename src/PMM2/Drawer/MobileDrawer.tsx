import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
// import LogoutButton from 'components/Auth0Components/LogoutButton'
// eslint-disable-next-line

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function MobileDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  const navigate = useNavigate();
  const path = location.pathname;
  const [pathState, setPathState] = React.useState('');

  React.useEffect(() => {
    setPathState(path);
  }, [path]);

  const handleDrawerClose = () => {
    setState({ ...state, left: false });
  };

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const items = [
    {
      name: 'Profile',
      direction: '/profile',
    },
    {
      name: 'Mentoring',
      direction: '/mentoring',
    },
    {
      name: 'Marketplace',
      direction: '/marketplace',
    },
    {
      name: 'Relationships',
      direction: '/relationships',
    },
    {
      name: 'Notifications',
      direction: '/notifications',
    },
    {
      name: 'Help',
      direction: '/help',
    },
  ];

  const itemSelected = (direction: string) => {
    return direction === pathState;
  };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {items.map((item) => {
          return (
            <ListItem
              disablePadding
              key={item.name}
              sx={{
                color: itemSelected(item.direction) ? '#263560' : '#69728DA8',
              }}
            >
              <ListItemButton onClick={() => navigate(item.direction)}>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        sx={{
                          fontFamily: 'Roboto',
                          fontWeight: '700',
                          fontSize: '18px',
                          LineWeight: '18.13px',
                          color: 'inherit',
                        }}
                        component="span"
                      >
                        {item.name}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}

        {/* <ListItem disablePadding>
            <Box
              sx={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
              }}
            >
              <LogoutButton />
            </Box>
          </ListItem> */}
      </List>
    </Box>
  );

  return (
    <Box>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <AppBar
            position="static"
            sx={{
              backgroundColor: '#fff',
            }}
          >
            <Toolbar
              sx={{
                justifyContent: 'space-between',
              }}
            >
              <IconButton
                size="large"
                edge="start"
                // color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(anchor, true)}
              >
                <MenuIcon />
              </IconButton>
              {/* <Button
                onClick={() => {
                  navigate('/newproject');
                }}
                sx={{
                  display: 'flex',
                  backgroundColor: 'rgba(217, 217, 217, 1)',
                  color: 'rgba(0, 0, 0, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                    color: 'rgba(255, 255, 255, 1)',
                  },
                  borderRadius: '1rem',
                  textTransform: 'none',
                  fontSize: '13px',
                  width: '150px',
                }}
                variant="contained"
              >
                New Project
              </Button> */}
            </Toolbar>
          </AppBar>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </DrawerHeader>
            <Divider
              sx={{
                marginBottom: '-10px',
              }}
            />
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </Box>
  );
}
