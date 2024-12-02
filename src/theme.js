import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0f172a',
    },
    background: {
      default: '#1a1a1a',
      paper: '#262626',
    },
  },
  typography: {
    fontFamily: '"Roboto Condensed", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@import': 'url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap")',
      },
    },
  },
});