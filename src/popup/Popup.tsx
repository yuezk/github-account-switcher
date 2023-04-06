import { Box, CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material'
import { useMemo } from 'react'
import Header from './components/Header'
import Settings from './components/Settings'

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  )

  return (
    <ThemeProvider theme={theme}>
      <Box component="main" width={600}>
        <CssBaseline />
        <Header />
        <Settings />
      </Box>
    </ThemeProvider>
  )
}

export default App
