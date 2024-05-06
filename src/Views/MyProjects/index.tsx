import React, { useState, SyntheticEvent, useEffect } from 'react';
import CenteredTabs from 'Components/Tabs';
import MyProject from './MyProject';
import Feedback from './Feedback';
import MyProjectContainer from './../../Components/MyProjectsContainer/index';
import { useNavigate, useParams } from 'react-router-dom';
export default function MyProjects() {
  const [value, setValue] = useState(0);
  const { myProjectsTab } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (myProjectsTab === 'interactions') {
      setValue(0);
    } else if (myProjectsTab === 'feedback') {
      setValue(1);
    }
  }, []);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(`/projects/${newValue === 0 ? 'interactions' : newValue === 1 ? 'feedback' : 'feedback'}`);
  };

  const tabs = [
    { label: 'Interactions', ariaAttribute: 0 },
    { label: 'Feedback', ariaAttribute: 1 },
  ];

  return (
    <MyProjectContainer>
      <CenteredTabs tabs={tabs} handleChange={handleChange} tabValue={value} />
      {value == 0 && <MyProject />}
      {value == 1 && <Feedback />}
    </MyProjectContainer>
  );
}
