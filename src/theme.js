import { createTheme } from '@mui/material/styles';
import { grey, blueGrey, blue } from '@mui/material/colors';

const primaryNavy = {
  light: '#4A658E',
  main: '#1F3F6D',
  dark: '#0F1E3A',
  contrastText: '#ffffff',
};

const secondaryTeal = {
  light: '#6DD5ED',
  main: '#2196F3',
  dark: '#0B7CD6',
  contrastText: '#ffffff',
};

export const lightTheme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Tajawal, sans-serif',
  },
  palette: {
    mode: 'light',
    primary: primaryNavy,
    secondary: secondaryTeal,
    background: {
      default: grey[100],
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: grey[700],
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(to right, ${primaryNavy.main}, ${blue[700]})`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Tajawal, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: primaryNavy.light,
      light: primaryNavy.light,
      dark: primaryNavy.dark,
      contrastText: '#ffffff',
    },
    secondary: secondaryTeal,
    background: {
      default: primaryNavy.dark,
      paper: primaryNavy.main,
    },
    text: {
      primary: '#ffffff',
      secondary: grey[400],
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(to right, ${primaryNavy.dark}, ${blueGrey[900]})`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});
