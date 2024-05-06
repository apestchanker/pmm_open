import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
// import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
// import LogoutButton from 'components/Auth0Components/LogoutButton'
// import earthtrustLogo from 'svgComponents/horizontal-logo.png'
import { Button, Modal, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { Logout } from '@mui/icons-material';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const drawerWidth = 230;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  backgroundColor: 'white',
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface DesktopDrawerProps {
  children: React.ReactNode;
}

export default function DesktopDrawer({ children }: DesktopDrawerProps) {
  const modalStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    maxWidth: '80%',
    bgcolor: 'background.paper',
    border: '2px solid transparent',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    px: 7,
  };
  const navigate = useNavigate();
  const path = location.pathname;
  const [pathState, setPathState] = React.useState('');
  const { logout } = useAuth0();

  React.useEffect(() => {
    setPathState(path);
  }, [path]);

  // const [open, setOpen] = React.useState(true)
  const open = true;

  // const [snackOpen, setSnackOpen] = React.useState(false);

  // const address = 'addr_test1qqsyfgvffgrm75w77uqx7e8qz39nf0vrh9vk0x26favqz4tzpxa4hmv0zsh7ueh3p5vffw8y2tn97yfy30y6s64jnmus04xz8q';

  // const copyToCC = () => {
  //   const handleClick = () => {
  //     navigator.clipboard.writeText(address).then(() => {
  //       setSnackOpen(true);
  //     });
  //   };

  //   return (
  //     <IconButton onClick={handleClick}>
  //       <ContentCopyIcon />
  //     </IconButton>
  //   );
  // };

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleLogOut = () => {
    localStorage.clear();
    handleClose();
    logout();
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
    return direction.split('/')[1] === pathState.split('/')[1];
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Modal open={openModal} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={modalStyle}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', padding: '35px', marginLeft: '0px', width: 'fit-content' }}
            >
              <Logout />
              Sign Out
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
              Just in case: You’re leaving. <br /> Are you sure?
            </Typography>
            <Button sx={{ color: 'white', backgroundColor: 'var(--primaryBlue)', width: '100%', py: 2, mt: 5 }} onClick={handleClose}>
              Oh no! My mistake
            </Button>
            <Button fullWidth sx={{ color: 'var(--primaryBlue)', width: '100% !important', mt: 3 }} onClick={handleLogOut}>
              Yes, log me out
            </Button>
          </Box>
        </Modal>
        <DrawerHeader
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: '35px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <Typography fontSize={40} fontWeight={600} color="#263560">
            PMM
          </Typography>
        </DrawerHeader>

        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <span>
            {items.map((item) => {
              return (
                <ListItem
                  disablePadding
                  key={item.name}
                  sx={{
                    color: itemSelected(item.direction) ? '#263560' : '#69728DA8',
                    '&:hover': {
                      color: '#263560',
                    },
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
                              fontSize: '24px',
                              LineWeight: '28.13px',
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
          </span>
          <Box>
            <ListItemButton onClick={handleOpen}>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      sx={{
                        fontFamily: 'Roboto',
                        fontWeight: '700',
                        fontSize: '24px',
                        LineWeight: '28.13px',
                      }}
                      color="error"
                      component="span"
                    >
                      Sign Out
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItemButton>
          </Box>
        </List>
      </Drawer>
      <Main open={open}>{children}</Main>
    </Box>
  );
}
