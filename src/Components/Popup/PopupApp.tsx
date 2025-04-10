import * as React from 'react';
import UrlBlocker from '../Settings/BlockedSites/UrlBlocker';
import CategoryBlocker from '../Settings/BlockedCategories/CategoryBlocker';
import {
  Backdrop, Box, CircularProgress,
  Container,
  Grid,
  IconButton, ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import {Settings} from '@mui/icons-material';
import {makeStyles} from '@mui/styles';
import theme, {colors} from "../../../styles/MuiTheme";
import {useEffect, useState} from "react";

const useStyles = makeStyles((theme) => ({
  icon: {
    height: 35,
    marginRight: 0
  },
  title: {
    marginTop: 0,
    flexGrow: 1,
    fontWeight: 'bold',
  },
  toolbar: {
    paddingRight: 0,
  },
}));

const PopupApp = () => {
  const [deepBreathsEnabled, setDeepBreathsEnabled] = useState(false);
  const [deepBreathLength, setDeepBreathLength] = useState(0); // [seconds

  const [blockedCategories, setBlockedCategories] = useState<string[]>([]);
  const [blockedUrls, setBlockedUrls] = useState<string[]>([]);

  const [backdropOpen, setBackdropOpen] = useState(false);
  const [countdown, setCountdown] = useState(deepBreathLength);

  const classes = useStyles();

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
    ], (data) => {
      setDeepBreathsEnabled(data['features/deepBreath/enabled'] || false);
      setDeepBreathLength(data['features/deepBreath/length'] || 0);
      setCountdown(data['features/deepBreath/length']);
      setBlockedCategories(data.blockedCategories || []);
      setBlockedUrls(data.blockedUrls || []);
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


  const openSettingsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} sx={{width: 400, padding: 0}}>
        <Toolbar className={classes.toolbar} style={{backgroundColor: colors.primary}}>
          <img
            src={chrome.runtime.getURL('assets/icon-128.png')}
            alt="Shieldbug"
            className={`${classes.icon}`}
            style={{
              filter: "drop-shadow(0px 0px 7px rgba(0, 0, 0, 0.6))",
              marginRight: 8
            }}
          />
          <Typography variant="h5" className={classes.title} style={{color: "white"}}>
            ShieldBug
          </Typography>
          <IconButton
            onClick={openSettingsPage}
            color="inherit"
            style={{color: "white"}}
          >
            <Settings/>
          </IconButton>
        </Toolbar>

        <Box sx={{position: 'relative'}}>
          <Grid container spacing={1} sx={{padding: 1.5}}>
            <Grid item xs={12}>
              <UrlBlocker/>
            </Grid>
            <Grid item xs={12}>
              <CategoryBlocker/>
            </Grid>

            <Backdrop
              sx={{
                color: '#fff',
                position: 'absolute',
                marginTop: '8px',
                height: '100%',
                zIndex: (theme) => theme.zIndex.drawer + 1
              }
              }
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
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PopupApp;
