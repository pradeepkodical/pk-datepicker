import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { defaultTheme } from '../src/theme/defaultTheme';

export const decorators = [
  Story => (
    <React.StrictMode>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    </React.StrictMode>
  ),
];