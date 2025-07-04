import { useState, useEffect } from 'react';
import { Flex, Box, Heading, Text, VStack, HStack, Icon, Divider, Badge } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import LocationCard from './components/LocationCard';
import EmailForm from './components/EmailForm';
import SuccessMessage from './components/SuccessMessage';

interface Feature {
  icon: any;
  text: string;
}

const featureList: Feature[] = [
  {
    icon: FaMapMarkerAlt,
    text: 'We find your current location.',
  },
  {
    icon: EmailIcon,
    text: "You provide a recipient's email.",
  },
  {
    icon: FaShieldAlt,
    text: 'We send it securely. No accounts needed.',
  },
];

function App() {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (!location) {
      console.log('Requesting location...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          console.log('Location obtained:', pos.coords);
          setLocation(pos.coords);
        },
        (err) => {
          console.error('Location error:', err);
          setLocationError('Location permission denied or unavailable.');
        }
      );
    }
    // Handle successful location sharing
    const handleLocationSent = () => {
      setIsLoading(false);
      setIsSent(true);
      setRecipient(email);
      let prev = JSON.parse(localStorage.getItem('pinsafe_emails') || '[]');
      prev = [email, ...prev.filter((em: string) => em !== email)].slice(0, 3);
      localStorage.setItem('pinsafe_emails', JSON.stringify(prev));
    };
    
    // Expose onSent handler for EmailForm
    (window as any).pinsafeOnSent = handleLocationSent;
  }, [location, email]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Placeholder for sending logic
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      setRecipient(email);
      // Save email to localStorage (memory of last 2-3 emails)
      let prev = JSON.parse(localStorage.getItem('pinsafe_emails') || '[]');
      prev = [email, ...prev.filter((em: string) => em !== email)].slice(0, 3);
      localStorage.setItem('pinsafe_emails', JSON.stringify(prev));
    }, 1200);
  };

  return (
    <Box minH="100vh" w="100vw" bgGradient="linear(to-br, background 60%, trustBlue.50 100%)" fontFamily="Montserrat, Inter, system-ui, sans-serif">
      {/* Navbar */}
      <Flex as="nav" w="100%" px={{ base: 4, md: 10 }} py={4} align="center" boxShadow="sm" bg="white">
        <Heading as="h1" size="lg" color="trustBlue.500" letterSpacing="tight">PinSafe</Heading>
      </Flex>
      <Flex w="100vw" minH="calc(100vh - 64px)" align="center" justify="center" px={{ base: 2, sm: 4, md: 8, lg: 16 }} py={{ base: 4, md: 8, lg: 12 }}>
        <Flex
          w={{ base: '100vw', md: '92vw', lg: '80vw' }}
          maxW="1400px"
          justify="space-between"
          align="center"
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 8, md: 10, lg: 16 }}
        >
          {/* Company Details Card */}
          <Box
            w={{ base: '100%', md: '48%', lg: '44%' }}
            minW="0"
            maxW={{ base: '100%', md: '500px', lg: '600px' }}
            bg="white"
            borderRadius="2xl"
            boxShadow="2xl"
            p={{ base: 6, md: 10, lg: 12 }}
            borderWidth={2}
            borderColor="trustBlue.100"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Heading as="h1" size={{ base: 'lg', md: '2xl' }} color="trustBlue.500" mb={2} fontWeight="bold" letterSpacing="tight">
              PinSafe
            </Heading>
            <Text fontSize={{ base: 'md', md: 'xl' }} color="text" mb={4} fontWeight="medium">
              Instantly Share Your Location. Stay Safe and Connected.
            </Text>
            <Box mb={6}><Divider /></Box>
            <VStack align="start" spacing={6} mt={4} mb={4}>
              {featureList.map((f, i) => (
                <HStack key={i} spacing={4}>
                  <Icon as={f.icon} boxSize={8} color="trustBlue.500" />
                  <Text fontSize={{ base: 'md', md: 'lg' }} color="text">{f.text}</Text>
                </HStack>
              ))}
            </VStack>
            <Box mt={4}><Divider /></Box>
            <Text fontSize="sm" color="gray.500" mt={4}>
              <Icon as={FaShieldAlt} color="trustBlue.500" mr={1} /> Your privacy is protected. No data is stored.
            </Text>
          </Box>
          {/* Email Form */}
          <Box
            w={{ base: '100%', md: '48%', lg: '44%' }}
            minW="0"
            maxW={{ base: '100%', md: '500px', lg: '600px' }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            {!isSent ? (
              <>
                <Heading as="h2" size={{ base: 'md', md: 'lg' }} mb={6} color="trustBlue.500" fontWeight="semibold" letterSpacing="tight">
                  Share Your Location
                </Heading>
                {locationError && (
                  <Text color="red.500" mb={4}>{locationError}</Text>
                )}
                <EmailForm
                  isLoading={isLoading}
                  onSubmit={() => {}}
                  email={email}
                  setEmail={setEmail}
                  message={message}
                  setMessage={setMessage}
                  location={location}
                  name={name}
                  setName={setName}
                  formSize="lg"
                  buttonSize="xl"
                />
              </>
            ) : (
              <SuccessMessage recipient={recipient} />
            )}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

export default App;
