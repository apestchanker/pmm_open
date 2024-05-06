import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export interface TabProps {
  label: string;
  ariaAttribute: number;
}
export default function CenteredTabs({
  tabs,
  tabValue,
  handleChange,
  children,
}: {
  tabs: TabProps[];
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  tabValue: number;
  children?: React.ReactNode;
}) {
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', height: '50px', pb: '5px' }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="basic tabs"
          centered
          sx={{
            width: { xs: '100%', md: '80%' },
            margin: 'auto',
            display: 'flex',
            justifyContent: { xs: 'center !important', md: 'flex-start !important' },
          }}
        >
          {tabs.map((t) => (
            <Tab
              key={t.label}
              className="tabHeader"
              sx={{ marginRight: { xs: 0, md: '130px' } }}
              label={t.label}
              {...a11yProps(t.ariaAttribute)}
            />
          ))}
        </Tabs>
        {children}
      </Box>
    </Box>
  );
}
