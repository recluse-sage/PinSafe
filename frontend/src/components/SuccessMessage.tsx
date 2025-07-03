import { VStack, Text, Icon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const SuccessMessage = ({ recipient }) => (
  <VStack spacing={6} align="center" justify="center" h="100%">
    <Icon as={CheckCircleIcon} boxSize={16} color="safetyGreen.500" />
    <Text fontSize="2xl" fontWeight="bold" color="text">
      Location Sent Successfully!
    </Text>
    {recipient && (
      <Text fontSize="md" color="gray.600">
        ✅ Location sent to {recipient}!
      </Text>
    )}
  </VStack>
);

export default SuccessMessage; 