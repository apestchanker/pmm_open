import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../../Assets/Logo.svg';
import Modal from '@mui/material/Modal';
import React, { useState, useEffect } from 'react';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { Link, useNavigate } from 'react-router-dom';
import Style from './Header.module.css';
import { Badge, Collapse, List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { ExpandLess, ExpandMore, Logout, Settings } from '@mui/icons-material';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS, UPDATE_NOTIFICATIONS } from 'Queries';
import moment from 'moment';
import { GET_USER_ROLES } from 'Queries/index';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import ArticleIcon from '@mui/icons-material/Article';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import DvrIcon from '@mui/icons-material/Dvr';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useAuth0 } from '@auth0/auth0-react';

const routes = [
  { id: 'home', display: 'Home', to: '/home' },
  { id: 'marketplace', display: 'Marketplace', to: '/marketplace' },
  { id: 'myProjects', display: 'My Projects', to: '/projects' },
];

const baseURL: string = process.env.REACT_APP_BASE_URL || '';

export default function HeaderComponent() {
  const pathname = window.location.pathname;

  // const { logout } = useNetworkAuth();
  const { user, logout, loginWithPopup, isAuthenticated } = useAuth0();
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(isAuthenticated);
  }, [isAuthenticated, setLogged]);
  const username = user?.nickname;
  const email = user?.email;

  const { data, refetch, loading } = useQuery(GET_NOTIFICATIONS, {
    pollInterval: 10000,
    variables: {
      username: username,
    },
  });

  const { data: userLabelsData } = useQuery(GET_USER_ROLES, {
    variables: { username: user?.nickname || '' },
    // const { data: userLabelsData, loading: labelsLoading } = useQuery(GET_USER_ROLES, {
    //   variables: { username: username || '' },
  });
  const [updateNotifications, { data: notificationsUpdateResponse }] = useMutation(UPDATE_NOTIFICATIONS);
  const [isAdmin, setIsAdmin] = useState(false);
  const userRoles = userLabelsData?.User[0]?.roles;

  useEffect(() => {
    if (userRoles) {
      userRoles.forEach((role: any) => {
        if (role?.name?.includes('Admin')) {
          setIsAdmin(true);
        }
      });
    }
  });

  // useEffect(() => {
  //   refetchUserData();
  // }, [user]);

  const [notificationsState, setNotificationsState] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(false);

  useEffect(() => {
    if (data !== undefined && !loading) {
      setNotificationsState(data?.UserNotification);
      const unreadExists = data?.UserNotification.some((notification: any) => notification.read == false);
      setUnreadNotifications(unreadExists);
    }
  }, [data, loading, unreadNotifications]);

  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [show, setShow] = useState(false);
  const [openDrawerSettings, setOpenDrawerSettings] = React.useState(false);

  const [openDrawerContent, setOpenDrawerContent] = React.useState(false);

  const handleClickDrawerSettings = () => {
    setOpenDrawerSettings(!openDrawerSettings);
  };

  const handleClickDrawerContent = () => {
    setOpenDrawerContent(!openDrawerContent);
  };
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);

    const notificationsIds: any = [];

    notificationsState.forEach((notification: any) => {
      if (notification.read == false) {
        notificationsIds.push(notification.id);
      }
    });

    const response = await updateNotifications({
      variables: {
        ids: notificationsIds,
      },
    });
    setUnreadNotifications(false);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleAdminDropdown = () => {
    setShow((prev) => !prev);
  };

  const handleClickAway = () => {
    setShow(false);
    setOpenDrawerContent(false);
    setOpenDrawerSettings(false);
  };

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
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openNotificationsDesk, setOpenNotificationsDesk] = useState(false);
  const handleOpenNotificationsDesk = async () => {
    const notificationsIds: any = [];
    setOpenNotificationsDesk(openNotificationsDesk ? false : true);
    notificationsState.forEach((notification: any) => {
      if (notification.read == false) {
        notificationsIds.push(notification.id);
      }
    });
    const response = await updateNotifications({
      variables: {
        ids: notificationsIds,
      },
    });
    setUnreadNotifications(false);
  };
  const handleOpenNotifications = async () => {
    const notificationsIds: any = [];
    setOpenNotifications(openNotifications ? false : true);
    notificationsState.forEach((notification: any) => {
      if (notification.read == false) {
        notificationsIds.push(notification.id);
      }
    });
    const response = await updateNotifications({
      variables: {
        ids: notificationsIds,
      },
    });
    setUnreadNotifications(false);
  };

  const handleLogOut = () => {
    localStorage.clear();
    handleCloseNavMenu();
    handleClose();
    logout();
    // navigate(baseURL + '/v2/logout?federated');
    // localStorage.clear();
    // navigate('/');
    // window.location.reload();
  };

  return (
    <AppBar position="static" id={Style.header}>
      <Container className={Style.containerMain} maxWidth="xl">
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
        {/* MODAL END */}
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {logged ? (
            <>
              {/* MOBILE BURGER */}
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  <MenuItem
                    key={'home'}
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate('/home');
                    }}
                  >
                    <ListItemIcon>
                      <HomeRoundedIcon />
                    </ListItemIcon>
                    <Typography textAlign="center">{'Home'}</Typography>
                  </MenuItem>

                  <MenuItem
                    key={'marketplace'}
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate('/marketplace');
                    }}
                  >
                    <ListItemIcon>
                      <StoreRoundedIcon />
                    </ListItemIcon>
                    <Typography textAlign="center">{'Marketplace'}</Typography>
                  </MenuItem>

                  <MenuItem
                    key={'projects'}
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate('/projects');
                    }}
                  >
                    <ListItemIcon>
                      <FolderOpenRoundedIcon />
                    </ListItemIcon>
                    <Typography textAlign="center">{'Relationships'}</Typography>
                  </MenuItem>

                  <MenuItem
                    key="profile"
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate('/profile');
                    }}
                  >
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>

                  <MenuItem key="logout" value="logout" onClick={handleOpen}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
              {/* LOGO */}
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <img
                  src={Logo}
                  alt=""
                  onClick={() => {
                    navigate('/home');
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </Typography>
              <ClickAwayListener onClickAway={() => setOpenNotifications(false)}>
                <Box className={Style.notificationBox} sx={{ display: { sx: 'flex', md: 'none' } }}>
                  <Tooltip title="Open Notifications">
                    <IconButton id="notifications-btn" onClick={handleOpenNotifications} sx={{ p: 0 }}>
                      {unreadNotifications ? (
                        <Badge
                          color="error"
                          aria-label={`100 new notifications`}
                          badgeContent={1}
                          overlap="circular"
                          max={99}
                          variant="dot"
                        >
                          <NotificationsNoneIcon sx={{ fontSize: '32px', color: 'white' }} />
                        </Badge>
                      ) : (
                        <NotificationsNoneIcon sx={{ fontSize: '32px', color: 'white' }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  {openNotifications && (
                    <Paper className={Style.notificationModal}>
                      {notificationsState.length > 0 ? (
                        notificationsState.map((notification: any, index) => {
                          //const dateToShow = moment(notification.createdOn.toDate()).fromNow();
                          const dateToShow = moment(notification.createdOn.formatted.toLocaleString()).fromNow();
                          return (
                            <Box
                              sx={
                                notification.hasnotification.length > 2 ? { color: 'white', backgroundColor: '#0a669dd1  !important' } : {}
                              }
                              className={Style.eachNotif}
                              key={index}
                              onClick={() => navigate(notification.link)}
                            >
                              <Typography variant="body1" sx={{ fontWeight: 600, width: '80%' }}>
                                {notification.message}
                              </Typography>
                              <Box
                                sx={{
                                  position: 'absolute',
                                  right: '5px',
                                  bottom: '0',
                                }}
                              >
                                <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '12px', color: 'var(--primaryGray)' }}>
                                  {dateToShow}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })
                      ) : (
                        <Typography variant="body1" sx={{ color: 'var(--primaryBlue)' }}>
                          No new notifications
                        </Typography>
                      )}
                    </Paper>
                  )}
                </Box>
              </ClickAwayListener>
              {/* MOBILE END */}
              <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, minWidth: 'max-content' }}
                >
                  <img
                    src={Logo}
                    alt=""
                    onClick={() => {
                      navigate('/');
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    underline: 'none',
                    fontFamily: 'Roboto',
                    textDecoration: 'none',
                  }}
                >
                  {pathname.includes('/profile') ? (
                    <Link className={Style.boldlinks} to="/profile">
                      Profile
                    </Link>
                  ) : (
                    <Link className={Style.links} to="/profile">
                      Profile
                    </Link>
                  )}
                  {pathname.includes('/marketplace') ? (
                    <Link className={Style.boldlinks} to="/marketplace">
                      Marketplace
                    </Link>
                  ) : (
                    <Link className={Style.links} to="/marketplace">
                      Marketplace
                    </Link>
                  )}
                  {pathname.includes('/projects') ? (
                    <Link className={Style.boldlinks} to="/projects">
                      Relationships
                    </Link>
                  ) : (
                    <Link className={Style.links} to="/projects">
                      Relationships
                    </Link>
                  )}
                  {pathname.includes('/help') ? (
                    <Link className={Style.boldlinks} to="/help">
                      Help
                    </Link>
                  ) : (
                    <Link className={Style.links} to="/help">
                      Help
                    </Link>
                  )}
                  {isAdmin && (
                    <Button variant="contained" color="error" onClick={handleAdminDropdown}>
                      Admin Options
                    </Button>
                  )}
                  {show && (
                    <ClickAwayListener onClickAway={handleClickAway}>
                      <Paper
                        elevation={5}
                        sx={{ position: 'absolute', width: '200px', zIndex: 5, ml: 49, mt: 34, maxHeight: '200px', overflow: 'scroll' }}
                      >
                        <ListItemButton onClick={handleClickDrawerSettings}>
                          <ListItemText primary="Settings" />
                          {openDrawerSettings ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openDrawerSettings} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            <ListItemButton
                              sx={{ pl: 2, pr: 2 }}
                              onClick={() => {
                                navigate('/admin/tags');
                              }}
                            >
                              <ListItemIcon>
                                <LocalOfferIcon />
                              </ListItemIcon>
                              <ListItemText primary="Tags" />
                            </ListItemButton>
                            <ListItemButton
                              sx={{ pl: 2, pr: 2 }}
                              onClick={() => {
                                navigate('/admin/challenges');
                              }}
                            >
                              <ListItemIcon>
                                <SmartButtonIcon />
                              </ListItemIcon>
                              <ListItemText primary="Challenges" />
                            </ListItemButton>
                            <ListItemButton
                              sx={{ pl: 2, pr: 2 }}
                              onClick={() => {
                                navigate('/admin/skills');
                              }}
                            >
                              <ListItemIcon>
                                <BubbleChartIcon />
                              </ListItemIcon>
                              <ListItemText primary="Skills" />
                            </ListItemButton>
                          </List>
                        </Collapse>
                        <ListItemButton
                          onClick={() => {
                            navigate('/admin/users');
                          }}
                        >
                          <ListItemText primary="Users" />
                        </ListItemButton>
                        <ListItemButton
                          onClick={() => {
                            navigate('/admin/flags');
                          }}
                        >
                          <ListItemText primary="Flags" />
                        </ListItemButton>
                        <ListItemButton>
                          <ListItemText primary="Statistics" />
                        </ListItemButton>
                        <ListItemButton onClick={handleClickDrawerContent}>
                          <ListItemText primary="Content" />
                          {openDrawerContent ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={openDrawerContent} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            <ListItemButton
                              sx={{ pl: 2, pr: 2 }}
                              onClick={() => {
                                navigate('/admin/notifications');
                              }}
                            >
                              <ListItemIcon>
                                <NotificationsNoneIcon />
                              </ListItemIcon>
                              <ListItemText primary="Notifications" />
                            </ListItemButton>
                            <ListItemButton
                              sx={{ pl: 2, pr: 2 }}
                              onClick={() => {
                                navigate('/admin/templates');
                              }}
                            >
                              <ListItemIcon>
                                <ArticleIcon />
                              </ListItemIcon>
                              <ListItemText primary="Templates" />
                            </ListItemButton>
                            <ListItemButton
                              sx={{ pl: 2, pr: 2 }}
                              onClick={() => {
                                navigate('/admin/smart-tips');
                              }}
                            >
                              <ListItemIcon>
                                <TipsAndUpdatesIcon />
                              </ListItemIcon>
                              <ListItemText primary="Smart Tips" />
                            </ListItemButton>
                            <ListItemButton
                              sx={{ pl: 2, pr: 2 }}
                              key="8768hjkg87"
                              onClick={() => {
                                navigate('/admin/console');
                              }}
                            >
                              <ListItemIcon>
                                <DvrIcon />
                              </ListItemIcon>
                              <ListItemText primary="DB Queries" />
                            </ListItemButton>
                          </List>
                        </Collapse>
                      </Paper>
                    </ClickAwayListener>
                  )}
                </Box>
              </Box>
              <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                <ClickAwayListener onClickAway={() => setOpenNotificationsDesk(false)}>
                  <Box className={Style.notificationBox}>
                    <Tooltip title="Open Notifications">
                      <IconButton id="notifications-btn" onClick={handleOpenNotificationsDesk} sx={{ p: 0 }}>
                        {unreadNotifications ? (
                          <Badge
                            color="error"
                            aria-label={`100 new notifications`}
                            badgeContent={1}
                            overlap="circular"
                            max={99}
                            variant="dot"
                          >
                            <NotificationsNoneIcon sx={{ fontSize: '32px', color: 'white' }} />
                          </Badge>
                        ) : (
                          <NotificationsNoneIcon sx={{ fontSize: '32px', color: 'white' }} />
                        )}
                      </IconButton>
                    </Tooltip>
                    {openNotificationsDesk && (
                      <Paper className={Style.notificationModal}>
                        {notificationsState.length > 0 ? (
                          notificationsState.map((notification: any, index) => {
                            //const dateToShow = moment(notification.createdOn.toDate()).fromNow();
                            const dateToShow = moment(notification.createdOn.formatted.toLocaleString()).fromNow();
                            return (
                              <Box
                                sx={
                                  notification.hasnotification.length > 2
                                    ? { color: 'white', backgroundColor: '#0a669dd1  !important' }
                                    : {}
                                }
                                className={Style.eachNotif}
                                key={index}
                                onClick={() => navigate(notification.link)}
                              >
                                <Typography variant="body1" sx={{ fontWeight: 600, width: '80%' }}>
                                  {notification.message}
                                </Typography>
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    right: '5px',
                                    bottom: '0',
                                  }}
                                >
                                  <Typography variant="body1" sx={{ fontWeight: 400, fontSize: '12px', color: 'var(--primaryGray)' }}>
                                    {dateToShow}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })
                        ) : (
                          <Typography variant="body1" sx={{ color: 'var(--primaryBlue)' }}>
                            No new notifications
                          </Typography>
                        )}
                      </Paper>
                    )}
                  </Box>
                </ClickAwayListener>
                <Button
                  sx={{
                    width: 'max-content',
                    padding: '10px',
                    marginLeft: '10px',
                  }}
                  variant="text"
                  color="primary"
                  className={Style.inUpBtn}
                  onClick={handleOpen}
                >
                  Sign Out
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'flex' }, minWidth: 'max-content' }}>
                <img
                  src={Logo}
                  alt=""
                  onClick={() => {
                    //logout();
                    navigate('/');
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </Typography>
              <Box
                sx={{
                  flexGrow: { xs: 0, md: 1 },
                  display: { xs: 'flex' },
                  flexDirection: { xs: 'row', md: 'row' },
                  width: 'fit-content',
                  justifyContent: 'flex-end',
                  marginBottom: '8px',
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  className={Style.inUpBtn}
                  onClick={() => {
                    loginWithPopup();
                    //navigate('/login');
                  }}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  className={Style.inUpBtn}
                  onClick={() => {
                    loginWithPopup();
                    //navigate('/sign-in');
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
