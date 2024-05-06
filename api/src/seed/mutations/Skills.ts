import { gql } from '@apollo/client';

export const variables = {
  data: [
    {
      id: 'skill-html',
      name: 'HTML',
      isActive: true,
    },
    {
      id: 'skill-css',
      name: 'CSS',
      isActive: true,
    },
    {
      id: 'skill-javascript',
      name: 'JavaScript',
      isActive: true,
    },
    {
      id: 'skill-java',
      name: 'Java',
      isActive: true,
    },
    {
      id: 'skill-design',
      name: 'Design',
      isActive: true,
    },
    {
      id: 'skill-management',
      name: 'Management',
      isActive: true,
    },
    {
      id: 'skill-accounting',
      name: 'Accounting',
      isActive: true,
    },
  ],
};

// MUTATION SKILLS
export const mutation = gql`
  mutation ($data: _SkillCreate!) {
    CreateSkill(data: $data) {
      id
      name
      isActive
    }
  }
`;
