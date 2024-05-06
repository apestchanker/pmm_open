import React from 'react';
import { Box } from '@mui/material';

function Console() {
  // const [queryType, setQueryType] = React.useState('useLazyQuery');
  // const [query, setQuery] = React.useState(`query {
  //   User {
  //     username
  //     id
  //   }
  // }`);
  // const [mutation, setMutation] = React.useState(`mutation {
  //   User {
  //     username
  //     id
  //   }
  // }`);
  // const [variables, setVariables] = React.useState('');
  // const [queryResponse, { loading, error, data }] = useLazyQuery(gql`
  //   ${query}
  // `);
  // const [mutationResponse, { loading: mutationLoading, error: mutationError, data: mutationData }] = useMutation(
  //   gql`
  //     ${mutation}
  //   `,
  // );
  // const handleClick = () => {
  //   queryResponse();
  // };
  return (
    <Box
      sx={{
        height: '89.2vh',
        backgroundColor: '#0B1924',
      }}
    >
      <iframe
        id="inlineFrameExample"
        title="Inline Frame Example"
        /*src="https://dev--taupe-torrone-6028c8.netlify.app/.netlify/functions/graphql"*/
        src={process.env.REACT_APP_GRAPHQL_URL}
        width={'99.7%'}
        height={'90%'}
        style={{
          height: '86vh',
          border: '1px solid #0B1924',
        }}
      ></iframe>

      {/* <Typography>Console queries</Typography>
      <Select fullWidth value={queryType} onChange={(e) => setQueryType(e.target.value)}>
        <MenuItem value={'useLazyQuery'}>Query</MenuItem>
        <MenuItem value={'useMutation'}>Mutation</MenuItem>
      </Select>
      <TextField
        fullWidth
        multiline
        value={queryType === 'useLazyQuery' ? query : mutation}
        onChange={(e) => (queryType === 'useLazyQuery' ? setQuery(e.target.value) : setMutation(e.target.value))}
        label={queryType === 'useLazyQuery' ? 'Query' : 'Mutation'}
        rows={10}
      ></TextField>
      <Button onClick={handleClick} variant="contained">
        {queryType === 'useLazyQuery' ? 'Query' : 'Mutation'}
      </Button>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography>Error: {error.message}</Typography>}
      {data && <Typography>Data: {JSON.stringify(data)}</Typography>} */}
    </Box>
  );
}

export default Console;
