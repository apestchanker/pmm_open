import ContactUs from 'Components/HelpViewComponents/ContactUs';
import SmartTips from 'Components/HelpViewComponents/SmartTips';
import Templates from 'Components/HelpViewComponents/Templates';
import CenteredTabs from 'Components/Tabs';
import React, { useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Help() {
  const [value, setValue] = useState(0);
  const { helpTab } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (helpTab === 'contact') {
      setValue(0);
    } else if (helpTab === 'templates') {
      setValue(1);
    } else if (helpTab === 'smart-tips') {
      setValue(2);
    }
  }, []);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(`/help/${newValue === 0 ? 'contact' : newValue === 1 ? 'templates' : 'smart-tips'}`);
  };

  const tabs = [
    { label: 'Contact Us', ariaAttribute: 0 },
    { label: 'Templates', ariaAttribute: 1 },
    { label: 'Smart Tips', ariaAttribute: 2 },
  ];

  return (
    <>
      <CenteredTabs tabs={tabs} handleChange={handleChange} tabValue={value} />
      {value == 0 && <ContactUs />}
      {value == 1 && <Templates />}
      {value == 2 && <SmartTips />}
    </>
  );
}

export default Help;
