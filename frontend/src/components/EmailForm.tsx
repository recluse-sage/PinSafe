import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { VStack, Input, Textarea, Button, Menu, MenuButton, MenuList, MenuItem, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface EmailFormProps {
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  formSize?: 'sm' | 'md' | 'lg';
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
}

const EmailForm = ({ isLoading, onSubmit, email, setEmail, message, setMessage, formSize = 'md', buttonSize = 'lg' }: EmailFormProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);

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
    // Use the real web app URL if provided, otherwise fallback
    const endpoint = (window as any).pinsafeEndpoint || 'https://your-serverless-form-endpoint.com/send';
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          message,
          location: (window as any).pinsafeLocation || null,
        }),
      });
    } catch (err) {
      // Optionally handle error
    }
    if (typeof (window as any).pinsafeOnSent === 'function') (window as any).pinsafeOnSent();
  };

  return (
    <form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
      <VStack spacing={6} align="stretch">
        <InputGroup>
          <Input
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
          {showMenu && suggestions.length > 0 && (
            <Menu isOpen={showMenu} placement="bottom-start">
              <MenuList minW="0" p={0} mt={1} borderRadius="md" boxShadow="md">
                {suggestions.map((s, i) => (
                  <MenuItem key={i} onClick={() => handleSuggestion(s)}>{s}</MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
        </InputGroup>
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