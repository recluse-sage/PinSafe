import { Box } from '@chakra-ui/react';

const LocationCard = ({ children }) => (
  <Box
    bg="white"
    borderRadius="xl"
    boxShadow="lg"
    p={8}
    w="100%"
    maxW="400px"
    mx="auto"
  >
    {children}
  </Box>
);

export default LocationCard; 