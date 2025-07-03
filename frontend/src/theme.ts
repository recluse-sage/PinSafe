import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        bg: '#F8F9FA',
        color: '#212529',
        fontFamily: 'Montserrat, Inter, system-ui, sans-serif',
      },
    },
  },
  fonts: {
    heading: 'Montserrat, Inter, system-ui, sans-serif',
    body: 'Montserrat, Inter, system-ui, sans-serif',
  },
  colors: {
    background: '#F8F9FA', // Off-white
    text: '#212529', // Deep charcoal
    trustBlue: {
      500: '#005A9C', // Main blue
    },
    safetyGreen: {
      500: '#28A745', // Main green
    },
    accentGrey: '#E9ECEF', // Light grey
  },
});

export default theme; 