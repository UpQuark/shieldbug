import * as React from 'react';
import UrlBlocker from '../Settings/BlockedSites/UrlBlocker';
import CategoryBlocker from '../Settings/BlockedCategories/CategoryBlocker';
import {
  Backdrop, Box, CircularProgress,
  Container,
  Grid,
  IconButton, ThemeProvider, useTheme,
  Toolbar,
  Typography,
  Paper,
  CssBaseline,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {Settings, PowerSettingsNew} from '@mui/icons-material';
import { createTheme, Theme } from '@mui/material/styles';
import {useEffect, useState} from "react";
import {BlockList} from '../Settings/BlockedSites/BlockedSitesTypes';
import { getDesignTokens } from "../../../styles/MuiTheme";
import PasswordOverlay from '../Settings/PasswordProtection/PasswordOverlay';

const PopupApp = () => {
  const [deepBreathsEnabled, setDeepBreathsEnabled] = useState(false);
  const [deepBreathLength, setDeepBreathLength] = useState(0); // [seconds]
  const [blockedCategories, setBlockedCategories] = useState<string[]>([]);
  const [blockedUrls, setBlockedUrls] = useState<string[]>([]);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [countdown, setCountdown] = useState(deepBreathLength);
  const [blockLists, setBlockLists] = React.useState<BlockList[]>([{ id: 'main', name: 'Main', urls: [], active: true }]);
  const [blockingEnabled, setBlockingEnabled] = React.useState(true);
  
  // Track theme mode
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  // Create theme dynamically
  const theme = React.useMemo(() => {
    return createTheme(getDesignTokens(mode));
  }, [mode]);

  // Load theme preference on mount
  useEffect(() => {
    chrome.storage.sync.get(['themeMode', 'blockingEnabled'], (data) => {
      if (data.themeMode === 'light' || data.themeMode === 'dark') {
        setMode(data.themeMode);
      } else if (data.themeMode === 'system' || !data.themeMode) {
        // Use system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setMode(prefersDarkMode ? 'dark' : 'light');
      }
      
      // Load blocking enabled state
      setBlockingEnabled(data.blockingEnabled !== false);
    });
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      chrome.storage.sync.get(['themeMode'], (data) => {
        if (data.themeMode === 'system' || !data.themeMode) {
          setMode(e.matches ? 'dark' : 'light');
        }
      });
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);
  
  // Listen for storage changes (e.g. when theme is changed in settings)
  useEffect(() => {
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'sync' && changes.themeMode) {
        const newThemeMode = changes.themeMode.newValue;
        if (newThemeMode === 'system') {
          const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setMode(prefersDarkMode ? 'dark' : 'light');
        } else if (newThemeMode === 'light' || newThemeMode === 'dark') {
          setMode(newThemeMode);
        }
      }
    };
    
    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  /**
   * Load 'deep breath' settings from storage
   * Load blocked categories and URLs from storage so we can show deep breaths conditional on their existence
   */
  useEffect(() => {
    chrome.storage.sync.get([
      'features/deepBreath/enabled',
      'features/deepBreath/length',
      'blockedCategories',
      'blockedUrls',
      'blockLists',
    ], (data) => {
      setDeepBreathsEnabled(data['features/deepBreath/enabled'] || false);
      setDeepBreathLength(data['features/deepBreath/length'] || 0);
      setCountdown(data['features/deepBreath/length']);
      setBlockedCategories(data.blockedCategories || []);
      setBlockedUrls(data.blockedUrls || []);
      if (data.blockLists) {
        setBlockLists(data.blockLists);
      }
    });
  }, []);

  /**
   * Set a visible countdown timer locking out settings based on the deep breath timeout
   * Show only if any filters are enabled (aka don't time out turning the filter back on, just time out turning it off)
   */
  useEffect(() => {
    let timer: any;
    if (deepBreathsEnabled &&
      deepBreathLength > 0 &&
      // Show only if there are blocks enabled, so you aren't blocked from turning them ON
      (blockedUrls?.length > 0 ||
        blockedCategories?.length > 0)
    ) {
      setBackdropOpen(true);
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          const newCountdown = prevCountdown - 1;
          if (newCountdown <= 0) {
            clearInterval(timer);
            setBackdropOpen(false);
            return deepBreathLength;
          }
          return newCountdown;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [deepBreathsEnabled, deepBreathLength]);

  const handleCategoryToggle = (category: string, checked: boolean) => {
    let updatedBlockedCategories: string[];

    if (checked) {
      updatedBlockedCategories = [...blockedCategories, category];
    } else {
      updatedBlockedCategories = blockedCategories.filter((c) => c !== category);
    }

    chrome.storage.sync.set({ blockedCategories: updatedBlockedCategories }, () => {
      setBlockedCategories(updatedBlockedCategories);
    });
  };

  const openSettingsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  const updateBlockLists = (updatedBlockLists: BlockList[]) => {
    chrome.storage.sync.set({ blockLists: updatedBlockLists }, () => {
      setBlockLists(updatedBlockLists);
    });
  };

  // Handle blocking toggle
  const handleBlockingToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setBlockingEnabled(newValue);
    chrome.storage.sync.set({ blockingEnabled: newValue }, () => {
      console.log("Popup: blocking toggled to", newValue);
      
      // Send a message to the background script to update rules immediately
      chrome.runtime.sendMessage({ 
        action: "blockingToggled", 
        enabled: newValue 
      });
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} sx={{width: 400, padding: 0}}>
        <Toolbar sx={{ 
          backgroundColor: mode === 'dark' ? 'custom.sidebar' : 'primary.main',
          paddingRight: 0,
          zIndex: 10000, // Keep the toolbar above the password overlay
          position: 'relative'
        }}>
          <img
            src={chrome.runtime.getURL('assets/icon-128.png')}
            alt="Shieldbug"
            style={{
              height: 35,
              marginRight: 8,
              filter: "drop-shadow(0px 0px 7px rgba(0, 0, 0, 0.6))"
            }}
          />
          <Typography 
            variant="h5" 
            sx={{
              marginTop: 0,
              flexGrow: 1,
              fontWeight: 'bold',
              color: mode === 'dark' ? 'primary.main' : 'white'
            }}
          >
            ShieldBug
          </Typography>
          
          {/* Blocking Toggle Switch */}
          <FormControlLabel
            control={
              <Switch
                checked={blockingEnabled}
                onChange={handleBlockingToggle}
                size="small"
                color="default"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PowerSettingsNew sx={{ fontSize: '1.2rem', color: 'white' }} />
              </Box>
            }
            sx={{
              mr: 1,
              '.MuiFormControlLabel-label': { 
                display: 'flex',
                alignItems: 'center',
                marginLeft: '4px'
              }
            }}
          />
          
          <IconButton
            onClick={openSettingsPage}
            color="inherit"
            sx={{ color: 'white' }}
          >
            <Settings/>
          </IconButton>
        </Toolbar>

        <Box sx={{position: 'relative', bgcolor: 'background.default'}}>
          {/* Apply password protection to the content */}
          <PasswordOverlay isPopup={true}>
            <Grid container spacing={1} sx={{padding: 1.5}}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Blocked Sites
                  </Typography>
                  <UrlBlocker 
                    blockLists={blockLists}
                    onBlockListsChange={updateBlockLists}
                    collapsible={true}
                    defaultCollapsed={true}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <CategoryBlocker 
                  blockedCategories={blockedCategories}
                  onCategoryToggle={handleCategoryToggle}
                  title="Blocked Categories"
                />
              </Grid>

              <Backdrop
                sx={{
                  color: '#fff',
                  position: 'absolute',
                  marginTop: '8px',
                  height: '100%',
                  zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={backdropOpen}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <CircularProgress color="primary"/>
                  <Typography variant="h4">
                    Take a deep breath.
                  </Typography>
                  <Typography variant="h6">
                    {countdown} {countdown === 1 ? 'second' : 'seconds'}
                  </Typography>
                </Box>
              </Backdrop>
            </Grid>
          </PasswordOverlay>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PopupApp;
