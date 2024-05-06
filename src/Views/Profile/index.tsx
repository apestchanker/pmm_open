import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AboutMe from 'Components/ProfileViewComponents/AboutMe';
import Preferences from 'Components/ProfileViewComponents/Preferences';
import CenteredTabs from 'Components/Tabs';
import { useNavigate, useParams } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function Profile({ userId }: any) {
  const { profileTab } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  useEffect(() => {
    profileTab === 'preferences' ? setValue(1) : setValue(0);
  }, []);
  const handleChange = (newValue: number) => {
    setValue(newValue);
    navigate(`/profile/${newValue === 0 ? 'about-me' : 'preferences'}`);
  };

  const tabs = [
    { label: 'About Me', ariaAttribute: 0 },
    { label: 'Preferences', ariaAttribute: 1 },
  ];

  return (
    <>
      <CenteredTabs tabs={tabs} handleChange={(_, newValue) => handleChange(newValue)} tabValue={value}>
        <TabPanel value={value} index={0}>
          <div className={'about-me'}>
            <AboutMe userId={userId} />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Preferences />
        </TabPanel>
      </CenteredTabs>
    </>
  );
}

export default Profile;
