import Box from '@mui/material/Box';

interface MarketplaceContainerProps {
  children: React.ReactNode;
}

const MarketplaceContainer = ({ children }: MarketplaceContainerProps) => {
  return (
    <Box sx={{ bgcolor: '#FFFFFF', marginBottom: '55px' }}>
      {/* We don't know what children is, it could be a Card or a div or something */}
      {children}
    </Box>
  );
};

export default MarketplaceContainer;
