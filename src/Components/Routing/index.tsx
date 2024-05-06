import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress } from '@mui/material';
import { useLazyQuery } from '@apollo/client';

import { GET_USER_BY_ID_FOR_LOGIN } from 'Queries';
import Landing from 'Views/Landing';
import LandingMentor from 'PMM2/Mentor/LandingMentor';
import HomeView from 'Views/Home';
import Marketplace from 'Views/Marketplace';
import MyProjects from 'Views/MyProjects';
import Profile from 'Views/Profile';
import EditProposalForm from 'Components/EditProposalForm';
import MyMessages from 'Views/MyProjects/MyMessages';
import ProposalDetail from 'Views/ProposalDetail';
import UserProfile from 'Views/UserProfile';
import Help from 'Views/Help';
import FlagView from 'Views/MyProjects/FlagView';
import EditTaskForm from 'Components/TaskComponents/EditTaskForm';
import SkillsView from 'Components/Admin/Views/SkillsView/SkillsView';
import ChallengesView from 'Components/Admin/Views/ChallengesView/ChallengesView';
import UsersView from 'Components/Admin/Views/UsersView/UsersView';
import TagsView from 'Components/Admin/Views/TagsView/TagsView';
import FlagsView from 'Components/Admin/Views/FlagsView/FlagsView';
import TemplatesView from 'Components/Admin/Views/Templates/TemplatesView';
import AddTemplateProposalForm from 'Components/Admin/Views/Templates/TemplateProposal';
import AddTemplateAgreement from 'Components/Admin/Views/Templates/TemplateAgreements';
import SmartTipsView from 'Components/Admin/Views/SmartTips/SmartTipsView';
import SmartTipProposal from 'Components/Admin/Views/SmartTips/SmartTipProposal';
/* import { io } from 'socket.io-client';
import { useEffect } from 'react';
 */
import FeedbackView from 'Views/MyProjects/FeedbackView';
import TaskDetail from 'Views/TaskDetail';
import { QuickChat } from 'Components/QuickChat/QuickChat';
import NotificationsView from 'Views/Admin/NotificationsView';
import QueriesConsoleView from 'Views/Admin/QueriesConsoleView';
import AddTaskFormByID from 'Components/TaskComponents/AddTaskFormByID';
import Tour from 'Views/Tour/Tour';
import LandingAuth from 'Components/LandingAuth/LandingAuth';
import MentoringSpaces from 'PMM2/MentoringSpaces/MentoringSpaces';
import MentoringPath from 'PMM2/Both/MentoringPath';
import LinkAssociation from 'PMM2/LinkAssociation/LinkAssociation';
import Layout from 'PMM2/Drawer/Layout';

// import { useNetworkAuth } from 'Providers/NetworkAuth'
export default function RoutingComponent() {
  // const { username } = useNetworkAuth()
  const { isAuthenticated, isLoading, user } = useAuth0();
  const [getUserById] = useLazyQuery(GET_USER_BY_ID_FOR_LOGIN);

  interface UserRolesI {
    name: string;
    __typename: string;
  }

  const [userRoles, setUserRoles] = useState<string[] | null>(null);
  const [userId, setUserId] = useState<string | null | undefined>(null);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setUserId(user?.sub);
      getUserById({
        variables: {
          id: user?.sub,
        },
      }).then((data) => {
        if (data?.data?.User?.length === 0) {
          setLoggedUser(false);
          setUserRoles([]);
        } else {
          setLoggedUser(true);
          setUserRoles(data?.data?.User[0]?.roles?.map((item: UserRolesI) => item?.name));
        }
      });
    }
  }, [isLoading]);
  if (!isLoading && !user) {
    return (
      <Routes>
        <Route path="/*" element={<Landing />} />
        <Route path="/linkassociation/:refurl" element={<LinkAssociation userId={null} />} />
      </Routes>
    );
  }

  if (isLoading || userRoles === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '75vh',
        }}
      >
        <CircularProgress sx={{ color: '#000' }} size={100} />
      </Box>
    );
  }
  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '75vh',
          }}
        >
          <CircularProgress sx={{ color: '#000' }} size={100} />
        </Box>
      ) : isAuthenticated && userRoles !== null ? (
        <Layout>
          <QuickChat />
          <Routes>
            <Route path="/" element={userRoles?.includes('Mentor') ? <LandingMentor /> : <LandingAuth />} />
            <Route path="/linkassociation/:refurl" element={<LinkAssociation userId={userId} />} />
            <Route path="/admin/tags" element={<TagsView />} />
            <Route path="/admin/skills" element={<SkillsView />} />
            <Route path="/admin/challenges" element={<ChallengesView />} />
            <Route path="/admin/users" element={<UsersView />} />
            <Route path="/admin/flags" element={<FlagsView />} />
            <Route path="/admin/notifications" element={<NotificationsView />} />
            <Route path="/admin/templates" element={<TemplatesView />} />
            <Route path="/admin/templates/proposal" element={<AddTemplateProposalForm />} />
            <Route path="/admin/templates/agreement" element={<AddTemplateAgreement />} />
            <Route path="/admin/smart-tips" element={<SmartTipsView />} />
            <Route path="/admin/smart-tips/proposal" element={<SmartTipProposal />} />
            <Route path="/admin/console" element={<QueriesConsoleView />} />
            <Route path="/profile" element={<Profile userId={userId} />} />
            <Route path="/profile/:profileTab" element={<Profile />} />
            <Route path="/home" element={<HomeView />} />
            <Route path="/help" element={<Help />} />
            <Route path="/help/:helpTab" element={<Help />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:marketplaceTab" element={<Marketplace />} />
            <Route path="/myProposals/:id" element={<EditProposalForm />} />
            <Route path="/myTasks/:id" element={<EditTaskForm />} />
            <Route path="/proposals/details/:id" element={<ProposalDetail />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/projects" element={<MyProjects />} />
            <Route path="/projects/:myProjectsTab" element={<MyProjects />} />
            <Route path="/flag/:toUser" element={<FlagView />} />
            <Route path="/feedback" element={<FeedbackView />} />
            <Route path="/projects/myMessages/:username" element={<MyMessages />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/marketplace/tasks/addTask/:id" element={<AddTaskFormByID />} />
            <Route path="/tour" element={<Tour />} />
            <Route path="/mentoring" element={<MentoringSpaces roles={userRoles} userId={userId} />} />
            <Route path="/mentoring/path/:id" element={<MentoringPath userId={userId} />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          {/* <Route path="/*" element={isAuthenticated ? <App id={user.sub} /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} /> */}
        </Routes>
      )}
    </>
  );
}
