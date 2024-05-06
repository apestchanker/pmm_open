import { gql } from '@apollo/client';

export const variables = {
  data: [
    {
      id: 'language-english',
      name: 'English',
    },
    {
      id: 'language-mandarin',
      name: 'Mandarin',
    },
    {
      id: 'language-hindi',
      name: 'Hindi',
    },
    {
      id: 'language-spanish',
      name: 'Spanish',
    },
    {
      id: 'language-french',
      name: 'French',
    },
    {
      id: 'language-arabic',
      name: 'Arabic',
    },
    {
      id: 'language-bengali',
      name: 'Bengali',
    },
    {
      id: 'language-russian',
      name: 'Russian',
    },
    {
      id: 'language-portugese',
      name: 'Portugese',
    },
    {
      id: 'language-indonesian',
      name: 'Indonesian',
    },
  ],
};

// MUTATION LANGUAGES
export const mutation = gql`
  mutation ($data: _LanguageCreate!) {
    CreateLanguage(data: $data) {
      id
      name
    }
  }
`;
