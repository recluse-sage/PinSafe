import { useEffect, useState, Dispatch, SetStateAction, useRef } from 'react';
import { VStack, Input, Textarea, Button, Menu, MenuButton, MenuList, MenuItem, InputGroup, InputRightElement, IconButton, Box } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface EmailFormProps {
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  location: GeolocationCoordinates | null;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  formSize?: 'sm' | 'md' | 'lg';
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
}

const EmailForm = ({ isLoading, onSubmit, email, setEmail, message, setMessage, location, name, setName, formSize = 'md', buttonSize = 'lg' }: EmailFormProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prev = JSON.parse(localStorage.getItem('pinsafe_emails') || '[]');
    setSuggestions(prev);
  }, []);

  const handleSuggestion = (suggested: string) => {
    setEmail(suggested);
    setShowMenu(false);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Debug: Log location data
    console.log('Location data being sent:', location);
    console.log('Location coordinates:', location ? { lat: location.latitude, lng: location.longitude } : 'No location');
    
    // Use the deployed API endpoint
    const endpoint = (window as any).pinsafeEndpoint || import.meta.env.VITE_API_ENDPOINT || 'https://location-api-backend.onrender.com/api/location';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          message,
          location: location,
          name,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('Location sent successfully');
    } catch (err) {
      // Optionally handle error
      console.error('Error sending location:', err);
    }
    if (typeof (window as any).pinsafeOnSent === 'function') (window as any).pinsafeOnSent();
  };

  return (
    <form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch" w="100%">
        {/* Name Field */}
        <Input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          bg="white"
          color="text"
          _placeholder={{ color: 'gray.500' }}
          autoComplete="off"
          size={formSize}
          h={formSize === 'lg' ? 14 : undefined}
          fontSize={formSize === 'lg' ? 'xl' : undefined}
          w="100%"
        />
        {/* Email Field and Suggestions */}
        <Box position="relative" w="100%">
          <InputGroup>
            <Input
              ref={inputRef}
              type="email"
              placeholder="Recipient's Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              bg="white"
              color="text"
              _placeholder={{ color: 'gray.500' }}
              autoComplete="off"
              onFocus={() => setShowMenu(true)}
              onBlur={() => setTimeout(() => setShowMenu(false), 150)}
              size={formSize}
              h={formSize === 'lg' ? 14 : undefined}
              fontSize={formSize === 'lg' ? 'xl' : undefined}
              w="100%"
            />
            {suggestions.length > 0 && (
              <InputRightElement width="3rem">
                <IconButton
                  aria-label="Show suggestions"
                  icon={<ChevronDownIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowMenu((v) => !v)}
                  tabIndex={-1}
                />
              </InputRightElement>
            )}
          </InputGroup>
          {/* Suggestion Dropdown */}
          {showMenu && suggestions.length > 0 && (
            <Box
              position="absolute"
              top="100%"
              left={0}
              w="100%"
              zIndex={10}
              bg="white"
              borderRadius="md"
              boxShadow="md"
              mt={1}
              overflow="hidden"
            >
              {suggestions.map((s, i) => (
                <Box
                  key={i}
                  px={4}
                  py={2}
                  _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                  onMouseDown={() => handleSuggestion(s)}
                  fontSize={{ base: 'md', md: 'lg' }}
                >
                  {s}
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Textarea
          placeholder="Optional Message (e.g., 'I'm in a blue car')"
          value={message}
          onChange={e => setMessage(e.target.value)}
          bg="white"
          color="text"
          _placeholder={{ color: 'gray.500' }}
          size={formSize}
          h={formSize === 'lg' ? 32 : undefined}
          fontSize={formSize === 'lg' ? 'xl' : undefined}
          w="100%"
        />
        <Button
          type="submit"
          colorScheme="trustBlue"
          isLoading={isLoading}
          loadingText="Sending..."
          w="100%"
          size={buttonSize}
          fontWeight="bold"
          h={buttonSize === 'xl' ? 16 : undefined}
          fontSize={buttonSize === 'xl' ? '2xl' : undefined}
        >
          Send My Location
        </Button>
      </VStack>
    </form>
  );
};

export default EmailForm; 