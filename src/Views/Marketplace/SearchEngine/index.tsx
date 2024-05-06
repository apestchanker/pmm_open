import { FormHelperText, Grid, FormControl, TextField, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NoResultsModal from 'Components/SearchNoResultModal';
import { useCallback, useEffect, useState } from 'react';
import {
  GET_USER_INTERESTS,
  GET_USER_PREFERENCES_LABEL,
  GET_USERS_BY_SEARCH,
  GET_PROPOSALS_BY_SEARCH,
  GET_USER_ROLES,
  GET_FILTERED_PROPOSALS,
  GET_USER_FILTERED,
} from 'Queries';
import ToggleButton, { Choice } from 'Components/ToggleButton';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { useNetworkAuth } from 'Providers/NetworkAuth';
import { useSearch } from 'Providers/Search';
import FilterModal from 'Components/Modal';
import { Challenge, Interest, Preference, Proposal, Role, Skill, User } from 'Types';
import Swal from 'sweetalert2';
import { Proposals } from 'Components/SearchEngigeComponents/Proposals';
import { Proposers } from 'Components/SearchEngigeComponents/Proposers';
import { Mentors } from 'Components/SearchEngigeComponents/Mentors';
import { Tasks } from 'Components/SearchEngigeComponents/Tasks';
import { GET_USER_SKILLS, GET_TASKS_BY_SEARCH, GET_SKILLS, GET_COLLABORATORS_BY_SEARCH } from 'Queries/collaboratorQueries';
import { GET_FILTERED_TASKS } from 'Queries/tasksQueries';
import { Collaborators } from 'Components/SearchEngigeComponents/Collaborators';

const index = () => {
  // ROLE EVALUATION
  const { username } = useNetworkAuth();
  const { data: userLabelsData, loading: labelsLoading } = useQuery(GET_USER_ROLES, {
    variables: { username: username },
  });
  const [userRoles, setUserRoles] = useState<string[]>([]);
  useEffect(() => {
    if (!labelsLoading) {
      setUserRoles(userLabelsData?.User[0]?.roles?.map((role: Role) => role?.name) || []);
    }
  }, [labelsLoading]);
  const isProposer = userRoles?.includes('Proposer');
  const isMentor = userRoles?.includes('Mentor');
  const isCollaborator = userRoles?.includes('Collaborator');
  const [activeSelectedRender, setActiveSelectedRender] = useState('Proposals');
  const [selectedRender, setSelectedRender] = useState('Proposals');

  // useEffect(() => {
  //   if (isProposer && !isMentor && !isCollaborator) {
  //     setActiveSelectedRender('Mentors');
  //     setSelectedRender('Mentors');
  //   }
  // }, [activeSelectedRender, selectedRender, setActiveSelectedRender, setSelectedRender, isProposer]);

  const choicesToRender = () => {
    if (isProposer && isMentor && isCollaborator) {
      return [
        { label: 'Proposals', value: 'Proposals' },
        { label: 'Proposers', value: 'Proposers' },
        { label: 'Mentors', value: 'Mentors' },
        { label: 'Tasks', value: 'Tasks' },
        { label: 'Collaborators', value: 'Collaborators' },
      ];
    } else if (isCollaborator && isMentor) {
      return [
        { label: 'Proposals', value: 'Proposals' },
        { label: 'Proposers', value: 'Proposers' },
        { label: 'Tasks', value: 'Tasks' },
        { label: 'Collaborators', value: 'Collaborators' },
      ];
    } else if (isProposer && isMentor) {
      return [
        { label: 'Proposals', value: 'Proposals' },
        { label: 'Mentors', value: 'Mentors' },
        { label: 'Proposers', value: 'Proposers' },
        { label: 'Tasks', value: 'Tasks' },
        { label: 'Collaborators', value: 'Collaborators' },
      ];
    } else if (isMentor) {
      return [
        { label: 'Proposals', value: 'Proposals' },
        { label: 'Proposers', value: 'Proposers' },
      ];
    } else if (isProposer) {
      return [
        { label: 'Mentors', value: 'Mentors' },
        { label: 'Proposals', value: 'Proposals' },
        { label: 'Tasks', value: 'Tasks' },
        { label: 'Collaborators', value: 'Collaborators' },
      ];
    } else if (isCollaborator) {
      return [
        { label: 'Tasks', value: 'Tasks' },
        { label: 'Collaborators', value: 'Collaborators' },
      ];
    } else {
      return [{ label: 'Proposals', value: 'Proposals' }];
    }
  };

  const renderChoices: Choice[] = choicesToRender();
  const { findProposals } = useSearch();

  //Queries for the search input
  const [getUsersBySearch, { data: searchResultsUsers }] = useLazyQuery(GET_USERS_BY_SEARCH);
  const [getProposalsBySearch, { data: searchResultsProposals }] = useLazyQuery(GET_PROPOSALS_BY_SEARCH);
  const [getTasksBySearch, { data: searchResultTasks }] = useLazyQuery(GET_TASKS_BY_SEARCH);
  const [getCollaboratorsBySearch, { data: searchResultCollaborators }] = useLazyQuery(GET_COLLABORATORS_BY_SEARCH);
  const { data: interestsData } = useQuery(GET_USER_INTERESTS);
  const { data: allSkills } = useQuery(GET_SKILLS);
  const { data: skillsData } = useQuery(GET_USER_SKILLS, {
    variables: { username: username },
  });

  //! State for the filters
  const [selectedPreferences, setSelectedPreferences] = useState<Preference[]>([]);
  const [selectedTimeZone, setSelectedTimeZone] = useState('');
  const [selectedInterest, setSelectedInterest] = useState<Interest[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [challenge, setChallenge] = useState('');
  const [availability, setAvailability] = useState('');
  //!

  //!Queries for the filters
  const [getFilteredTasks, { data: filteredTasks, loading: loadingFilteredTasks }] = useLazyQuery(GET_FILTERED_TASKS);
  const [getFilteredProposals, { data: filteredProposals, loading: loadingFilteredProposals }] = useLazyQuery(GET_FILTERED_PROPOSALS);
  const [getFilteredMentors, { data: filteredMentors, loading: loadingFilteredMentors }] = useLazyQuery(GET_USER_FILTERED);
  const [getFilteredProposers, { data: filteredProposers, loading: loadingFilteredProposers }] = useLazyQuery(GET_USER_FILTERED);
  const [getFilteredCollaborators, { data: filteredCollaborators, loading: loadingFilteredCollaborators }] =
    useLazyQuery(GET_USER_FILTERED);

  const [recommendedMentors, setRecommendedMentors] = useState<User[]>([]);
  const [recommendedProposals, setRecommendedProposals] = useState<Proposal[]>([]);
  const [recommendedProposers, setRecommendedProposers] = useState<Proposal[]>([]);
  const [recommendedTasks, setRecommendedTasks] = useState<Proposal[]>([]);
  const [recommendedCollaborators, setRecommendedCollaborators] = useState<Proposal[]>([]);
  const { data: userPreferencesObj } = useQuery(GET_USER_PREFERENCES_LABEL);
  const [searchTerm, setSearchTerm] = useState('');

  // MODAL LOGIC
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  //

  // JOYRIDE
  const steps = [
    {
      target: '.find-your-match',
      content: `Our search engine will show results and will let you contact or send a request to any proposal/mentor/collaborator of your interes according to your profile preferences.`,
    },
  ];

  const handleJoyrideEnd = (data: any) => {
    const { action, index, status, type } = data;

    if (status === 'finished') {
    }
    if (status === 'skipped') {
      Swal.fire({
        title: 'Skip tour!',
        text: 'Skip all tours or just this one?',
        icon: 'info',
        confirmButtonText: 'No, just this one',
        showDenyButton: true,
        denyButtonText: 'All',
      }).then((result) => {
        if (result.isConfirmed) {
        } else if (result.isDenied) {
        }
      });
    }
    return;
  };

  // Filter states
  const [idArraysMentors, setIdArraysMentors] = useState<any[]>([]);
  const [idArraysProposers, setIdArraysProposers] = useState<any[]>([]);
  const [idArraysProposals, setIdArraysProposals] = useState<any[]>([]);
  const [idArraysTasks, setIdArraysTasks] = useState<any[]>([]);
  const [idArraysCollaborators, setIdArraysCollaborators] = useState<any[]>([]);
  //

  //! Recommended User and proposals useEffect and sort logic
  // useEffect(() => {
  //   if (!allDataLoading) {
  //     if (allData?.User.length === 1) {
  //       const mentorsMatchCount = allData?.User[0]?.mentorsWithSimilarInterests.map((mentor: any) => {
  //         let count = 0;
  //         allData?.User[0].interestedIn.forEach((interest: any) => {
  //           mentor.interestedIn.forEach((int2: any) => {
  //             if (interest.name == int2.name) {
  //               count++;
  //             }
  //           });
  //         });
  //         return {
  //           user: mentor,
  //           count,
  //         };
  //       });
  //       const proposersMatchCount = allData?.User[0]?.proposersWithSimilarInterests.map((proposer: any) => {
  //         let count = 0;
  //         allData?.User[0].interestedIn.forEach((interest: any) => {
  //           proposer.interestedIn.forEach((int2: any) => {
  //             if (interest.name == int2.name) {
  //               count++;
  //             }
  //           });
  //         });
  //         return {
  //           user: proposer,
  //           count,
  //         };
  //       });
  //       const proposalsMatchCount = allData?.User[0]?.proposalsWithSimilarInterests.map((proposal: any) => {
  //         let count = 0;
  //         allData?.User[0].interestedIn.forEach((interest: any) => {
  //           proposal.describedByInterests.forEach((int2: any) => {
  //             if (interest.name == int2.name) {
  //               count++;
  //             }
  //           });
  //         });
  //         return {
  //           proposal: proposal,
  //           count,
  //         };
  //       });

  //       const mentorsMatchCountSorted = mentorsMatchCount
  //         .sort((a: any, b: any) => {
  //           return b.count - a.count;
  //         })
  //         .map((mentor: any) => {
  //           return mentor.user;
  //         });
  //       const proposersMatchCountSorted = proposersMatchCount
  //         .sort((a: any, b: any) => {
  //           return b.count - a.count;
  //         })
  //         .map((mentor: any) => {
  //           return mentor.user;
  //         });
  //       const proposalsMatchCountSorted = proposalsMatchCount
  //         .sort((a: any, b: any) => {
  //           return b.count - a.count;
  //         })
  //         .map((prop: any) => {
  //           return prop.proposal;
  //         });
  //       setRecommendedMentors(mentorsMatchCountSorted);
  //       setRecommendedProposers(proposersMatchCountSorted);
  //       setRecommendedProposals(proposalsMatchCountSorted);
  //     } else {
  //       setRecommendedMentors(allData?.User.filter((user: any) => user.roles.some((role: any) => role.id === 'role-mentor')));
  //       setRecommendedProposers(allData?.User.filter((user: any) => user.roles.some((role: any) => role.id === 'role-proposer')));
  //       setRecommendedProposals(allData?.User.map((u: any) => u.proposals).flat());
  //     }
  //   }
  // }, [allData]);
  const [searchLoading2, setSearchLoading2] = useState(false);
  //! useEffect for the search input
  useEffect(() => {
    setSearchLoading2(true);
    setRecommendedMentors(searchResultsUsers?.User.filter((user: any) => user.roles.some((role: any) => role.id === 'role-mentor')));
    setRecommendedProposers(searchResultsUsers?.User.filter((user: any) => user.roles.some((role: any) => role.id === 'role-proposer')));
    setRecommendedProposals(searchResultsProposals?.Proposal);
    setRecommendedTasks(searchResultTasks?.Task);

    if (searchResultsUsers === undefined) {
      setRecommendedMentors([]);
      setRecommendedProposers([]);
      setSearchLoading2(false);
    } else {
      setRecommendedMentors(searchResultsUsers?.User.filter((user: any) => user.roles.some((role: any) => role.id === 'role-mentor')));
      setRecommendedProposers(searchResultsUsers?.User.filter((user: any) => user.roles.some((role: any) => role.id === 'role-proposer')));
      setSearchLoading2(false);
    }

    if (searchResultsProposals === undefined) {
      setRecommendedProposals([]);
      setSearchLoading2(false);
    } else {
      setRecommendedProposals(searchResultsProposals?.Proposal);
      setSearchLoading2(false);
    }

    if (searchResultTasks === undefined) {
      setRecommendedTasks([]);
      setSearchLoading2(false);
    } else {
      setRecommendedTasks(searchResultTasks?.Task);
      setSearchLoading2(false);
    }
    if (searchResultCollaborators === undefined) {
      setRecommendedCollaborators([]);
      setSearchLoading2(false);
    } else {
      setRecommendedCollaborators(searchResultCollaborators?.User);
      setSearchLoading2(false);
    }
  }, [searchResultsUsers, searchResultsProposals, searchResultTasks, searchResultCollaborators]);

  const handleToggleRender = useCallback(
    (choice: Choice) => {
      setActiveSelectedRender(choice.value);
      setSelectedRender(choice.value);
    },
    [username, findProposals],
  );
  const selectedInterestsIds = selectedInterest.map((s) => s.id);
  const selectedSkillsIds = selectedSkills.map((s: any) => s.id);
  const applyFilter = async () => {
    if (activeSelectedRender === 'Tasks') {
      const taskFilterFields: any = {
        id_in: idArraysTasks,
      };
      if (selectedSkillsIds.length > 0) {
        taskFilterFields.neededSkills_some = { id_in: selectedSkillsIds };
      }
      if (challenge !== '') {
        taskFilterFields.forProposal = { inChallenge: { id: challenge } };
      }
      if (selectedTimeZone !== '') {
        taskFilterFields.forProposal = { proposedBy: { inZone: { id: selectedTimeZone } } };
      }
      if (selectedPreferences.length > 0) {
        taskFilterFields.forProposal = { proposedBy: { preferences_some: { id_in: selectedPreferences } } };
      }
      await getFilteredTasks({
        variables: {
          filterFields: taskFilterFields,
        },
      });
    } else if (activeSelectedRender === 'Proposals') {
      const proposalFilterFields: any = {
        id_in: idArraysProposals,
      };
      if (selectedInterestsIds.length > 0) {
        proposalFilterFields.describedByInterests_some = { id_in: selectedInterestsIds };
      }
      if (challenge !== '') {
        proposalFilterFields.inChallenge = { id: challenge };
      }
      if (selectedTimeZone !== '') {
        proposalFilterFields.proposedBy = { inZone: { id: selectedTimeZone } };
      }
      if (selectedPreferences.length > 0) {
        proposalFilterFields.proposedBy = { preferences_some: { id_in: selectedPreferences } };
      }
      await getFilteredProposals({
        variables: { filters: proposalFilterFields },
      });
    } else if (activeSelectedRender === 'Mentors') {
      const mentorsFilterFields: any = {
        id_in: idArraysMentors,
        roles_some: { id: 'role-mentor' },
      };
      if (selectedInterestsIds.length > 0) {
        mentorsFilterFields.interestedIn_some = { id_in: selectedInterestsIds };
      }
      if (challenge !== '') {
        mentorsFilterFields.proposals_some = { inChallenge: { id: challenge } };
      }
      if (selectedTimeZone !== '') {
        mentorsFilterFields.inZone = { id: selectedTimeZone };
      }
      if (selectedPreferences.length > 0) {
        mentorsFilterFields.preferences_some = { id_in: selectedPreferences };
      }
      getFilteredMentors({
        variables: {
          filters: mentorsFilterFields,
        },
      });
    } else if (activeSelectedRender === 'Proposers') {
      const proposersFilterFields: any = {
        id_in: idArraysProposers,
        roles_some: { id: 'role-proposer' },
      };
      if (selectedInterestsIds.length > 0) {
        proposersFilterFields.interestedIn_some = { id_in: selectedInterestsIds };
      }
      if (challenge !== '') {
        proposersFilterFields.proposals_some = { inChallenge: { id: challenge } };
      }
      if (selectedTimeZone !== '') {
        proposersFilterFields.inZone = { id: selectedTimeZone };
      }
      if (selectedPreferences.length > 0) {
        proposersFilterFields.preferences_some = { id_in: selectedPreferences };
      }
      getFilteredProposers({
        variables: {
          filters: proposersFilterFields,
        },
      });
    } else if (activeSelectedRender === 'Collaborators') {
      const collaboratorFilterFields: any = {
        id_in: idArraysCollaborators,
        roles_some: { id: 'role-collaborator' },
      };
      if (selectedSkillsIds.length > 0) {
        collaboratorFilterFields.hasSkill_some = { id_in: selectedSkillsIds };
      }
      if (selectedTimeZone !== '') {
        collaboratorFilterFields.inZone = { id: selectedTimeZone };
      }
      if (availability !== '') {
        collaboratorFilterFields.availability_lte = availability;
      }
      getFilteredCollaborators({
        variables: {
          filters: collaboratorFilterFields,
        },
      });
    }
  };
  const [searchLoading, setSearchLoading] = useState(false);
  const handleSearch = async (e: any) => {
    e.preventDefault();
    setSearchLoading(true);
    await getUsersBySearch({
      variables: {
        searchTerm: `(?i).*${searchTerm}.*`,
        exclude: username,
      },
    });
    await getProposalsBySearch({
      variables: {
        searchTerm: `(?i).*${searchTerm}.*`,
        exclude: username,
      },
    });
    await getTasksBySearch({
      variables: {
        searchTerm: `(?i).*${searchTerm}.*`,
        exclude: username,
      },
    });
    await getCollaboratorsBySearch({
      variables: {
        searchTerm: `(?i).*${searchTerm}.*`,
      },
    });
    setSearchLoading(false);
  };
  const proposerProfile = activeSelectedRender === 'Mentors' || activeSelectedRender === 'Proposals' || activeSelectedRender === 'Tasks';
  const mentorProfile = activeSelectedRender === 'Proposals' || activeSelectedRender === 'Proposers';
  useEffect(() => {
    if (!searchLoading && !searchLoading2) {
      if (proposerProfile && isProposer && searchResultsUsers?.User.length === 0) {
        Swal.fire({
          title: 'Mmm... Try again!',
          text: "No results were found for your request, try another words or topics related to what you're looking for",
          icon: 'info',
          confirmButtonText: 'Got it!',
        });
      } else if (mentorProfile && isMentor && searchResultsProposals?.Proposal.length === 0 && searchResultsUsers?.User.length === 0) {
        Swal.fire({
          title: 'Mmm... Try again!',
          text: "No results were found for your request, try another words or topics related to what you're looking for",
          icon: 'info',
          confirmButtonText: 'Got it!',
        });
      } else if (
        activeSelectedRender === 'Proposer' &&
        isMentor &&
        isProposer &&
        searchResultsProposals?.Proposal.length === 0 &&
        searchResultsUsers?.User.length === 0
      ) {
        Swal.fire({
          title: 'Mmm... Try again!',
          text: "No results were found for your request, try another words or topics related to what you're looking for",
          icon: 'info',
          confirmButtonText: 'Got it!',
        });
      }
    }
  }, [searchResultsUsers, searchResultsProposals]);

  return (
    <Box className={'find-your-match'} sx={{ width: '90%', margin: 'auto', mt: 5 }}>
      <Box
      // sx={{
      //   width: 'inherit',
      // }}
      >
        <Grid container alignItems="center" width={'100%'}>
          {/* <Joyride
            steps={steps}
            callback={handleJoyrideEnd}
            showProgress
            continuous
            showSkipButton
            styles={{
              buttonBack: {
                backgroundColor: 'var(--textDark)',
                color: 'white',
              },
              buttonNext: {
                backgroundColor: 'var(--primaryBlue)',
              },
              tooltipContent: {
                fontFamily: 'inherit',
              },
              tooltip: {
                fontFamily: 'inherit',
              },
              options: {
                zIndex: 1000,
              },
            }}
          /> */}
          <Grid item xs={12}>
            <form onSubmit={handleSearch} style={{ width: '100%' }}>
              <Grid
                container
                alignItems="center"
                sx={{
                  justifyContent: 'space-between',
                }}
              >
                <Grid
                  item
                  xs={5}
                  sx={{
                    display: 'flex',
                    minWidth: '170px',
                  }}
                >
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Social impact, Development..."
                    />
                  </FormControl>
                  <IconButton aria-label="search" type="submit" sx={{ marginLeft: '20px' }}>
                    <SearchIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={1}>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                    <FilterModal
                      options={userPreferencesObj?.UserPreference || []}
                      checked={selectedPreferences}
                      setChecked={setSelectedPreferences}
                      setTimeZone={setSelectedTimeZone}
                      timeZone={selectedTimeZone}
                      setChallenge={setChallenge}
                      challenge={challenge}
                      applyFilter={applyFilter}
                      selectedInterest={selectedInterest}
                      setSelectedInterest={setSelectedInterest}
                      selectedSkills={selectedSkills}
                      setSelectedSkills={setSelectedSkills}
                      interestsData={interestsData || []}
                      skillsData={allSkills || []}
                      tab={activeSelectedRender}
                    />
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
        <NoResultsModal open={open} handleClose={handleClose} />
        <FormHelperText sx={{ marginTop: '10px', marginBottom: '10px' }}>
          Write any words related to what you are looking for
        </FormHelperText>
      </Box>
      <Box sx={{ mb: 4 }}>
        <ToggleButton
          onToggle={handleToggleRender}
          choices={renderChoices}
          selected={renderChoices.map((c) => c.label).indexOf(selectedRender)}
        />
      </Box>
      {selectedRender === 'Proposals' && (
        <Proposals
          tab={activeSelectedRender}
          user={username}
          searched={recommendedProposals}
          setIdArraysProposals={setIdArraysProposals}
          filteredProposals={filteredProposals}
          loadingFilteredProposals={loadingFilteredProposals}
        />
      )}
      {selectedRender === 'Proposers' && (
        <Proposers
          tab={activeSelectedRender}
          user={username}
          searched={recommendedProposers}
          setIdArraysUsers={setIdArraysProposers}
          filteredUsers={filteredProposers}
          loadingFilteredUsers={loadingFilteredProposers}
        />
      )}
      {selectedRender === 'Mentors' && (
        <Mentors
          tab={activeSelectedRender}
          user={username}
          searched={recommendedMentors}
          setIdArraysUsers={setIdArraysMentors}
          filteredUsers={filteredMentors}
          loadingFilteredUsers={loadingFilteredMentors}
        />
      )}
      {selectedRender === 'Tasks' && (
        <Tasks
          tab={activeSelectedRender}
          userSkills={skillsData?.User[0].hasSkill}
          searched={recommendedTasks}
          user={username}
          setIdArraysTasks={setIdArraysTasks}
          filteredTasks={filteredTasks}
          loadingFilteredTasks={loadingFilteredTasks}
        />
      )}
      {selectedRender === 'Collaborators' && (
        <Collaborators
          tab={activeSelectedRender}
          userSkills={skillsData?.User[0].hasSkill}
          user={username}
          searched={recommendedCollaborators}
          setIdArraysUsers={setIdArraysCollaborators}
          filteredUsers={filteredCollaborators}
          loadingFilteredUsers={loadingFilteredCollaborators}
          userInterest={interestsData}
        />
      )}
    </Box>
  );
};
export default index;
