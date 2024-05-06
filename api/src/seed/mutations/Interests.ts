import { gql } from '@apollo/client';

export const variables = {
  data: [
    {
      id: 'interest-open-source',
      name: 'Open Source',
      isActive: true,
    },
    {
      id: 'interest-sustainability',
      name: 'Sustainability',
      isActive: true,
    },
    {
      id: 'interest-gaming',
      name: 'Gaming',
      isActive: true,
    },
    {
      id: 'interest-politics',
      name: 'Politics',
      isActive: true,
    },
    {
      id: 'interest-agriculture',
      name: 'Agriculture',
      isActive: true,
    },
    {
      id: 'interest-machine-learning',
      name: 'Machine Learning',
      isActive: true,
    },
    {
      id: 'interest-mobile-apps',
      name: 'Mobile Apps',
      isActive: true,
    },
    {
      id: 'interest-education',
      name: 'Education',
      isActive: true,
    },
    {
      id: 'interest-accessibility',
      name: 'Accessibility',
      isActive: true,
    },
    {
      id: 'interest-climate',
      name: 'Climate',
      isActive: true,
    },
    {
      id: 'interest-defi',
      name: 'DeFi',
      isActive: true,
    },
    {
      id: 'interest-social-impact',
      name: 'Social Impact',
      isActive: true,
    },
    {
      id: 'interest-development',
      name: 'Development',
      isActive: true,
    },
    {
      id: 'interest-ai',
      name: 'AI',
      isActive: true,
    },
    {
      id: 'interest-economics',
      name: 'Economics',
      isActive: true,
    },
    {
      id: 'interest-forums',
      name: 'Forums',
      isActive: true,
    },
    {
      id: 'interest-cardano',
      name: 'Cardano',
      isActive: true,
    },
    {
      id: 'interest-society',
      name: 'Society',
      isActive: true,
    },
    {
      id: 'interest-equity',
      name: 'Equity',
      isActive: true,
    },
    {
      id: 'interest-javascript',
      name: 'JavaScript',
      isActive: true,
    },
    {
      id: 'interest-latin-america',
      name: 'Latin America',
      isActive: true,
    },
    {
      id: 'interest-empowering-women',
      name: 'Empowering Women',
      isActive: true,
    },
    {
      id: 'interest-react',
      name: 'React',
      isActive: true,
    },
    {
      id: 'interest-angular',
      name: 'Angular',
      isActive: true,
    },
    {
      id: 'interest-social-media',
      name: 'Social Media',
      isActive: true,
    },
    {
      id: 'interest-social-networks',
      name: 'Social Networks',
      isActive: true,
    },
    {
      id: 'interest-flutter',
      name: 'Flutter',
      isActive: true,
    },
    {
      id: 'interest-news',
      name: 'News',
      isActive: true,
    },
    {
      id: 'interest-identity',
      name: 'Identity',
      isActive: true,
    },
    {
      id: 'interest-design',
      name: 'Design',
      isActive: true,
    },
    {
      id: 'interest-backend',
      name: 'Backend',
      isActive: true,
    },
    {
      id: 'interest-frontend',
      name: 'Frontend',
      isActive: true,
    },
    {
      id: 'interest-usability',
      name: 'Usability',
      isActive: true,
    },
    {
      id: 'interest-ux',
      name: 'UX',
      isActive: true,
    },
    {
      id: 'interest-crypto',
      name: 'Crypto',
      isActive: true,
    },
    {
      id: 'interest-blockchain',
      name: 'Blockchain',
      isActive: true,
    },
    {
      id: 'interest-smart-contracts',
      name: 'Smart Contract',
      isActive: true,
    },
    {
      id: 'interest-finance',
      name: 'Finance',
      isActive: true,
    },
    {
      id: 'interest-java',
      name: 'Java',
      isActive: true,
    },
    {
      id: 'interest-c++',
      name: 'C++',
      isActive: true,
    },
    {
      id: 'interest-haskell',
      name: 'Haskell',
      isActive: true,
    },
    {
      id: 'interest-plutus',
      name: 'Plutus',
      isActive: true,
    },
    {
      id: 'interest-scala',
      name: 'Scala',
      isActive: true,
    },
    {
      id: 'interest-go',
      name: 'Go',
      isActive: true,
    },
    {
      id: 'interest-python',
      name: 'Python',
      isActive: true,
    },
    {
      id: 'interest-rust',
      name: 'Rust',
      isActive: true,
    },
    {
      id: 'interest-social-work',
      name: 'Social Work',
      isActive: true,
    },
    {
      id: 'interest-regional',
      name: 'Regional',
      isActive: true,
    },
    {
      id: 'interest-leadership',
      name: 'Leadership',
      isActive: true,
    },
    {
      id: 'interest-africa',
      name: 'Africa',
      isActive: true,
    },
    {
      id: 'interest-asia',
      name: 'Asia',
      isActive: true,
    },
    {
      id: 'interest-india',
      name: 'India',
      isActive: true,
    },
    {
      id: 'interest-japan',
      name: 'Japan',
      isActive: true,
    },
    {
      id: 'interest-southeast-asia',
      name: 'Southeast Asia',
      isActive: true,
    },
    {
      id: 'interest-china',
      name: 'China',
      isActive: true,
    },
    {
      id: 'interest-phillipenes',
      name: 'Phillipenes',
      isActive: true,
    },
  ],
};

// MUTATION INTERESTS
export const mutation = gql`
  mutation ($data: _InterestCreate!) {
    CreateInterest(data: $data) {
      id
      name
      isActive
    }
  }
`;
