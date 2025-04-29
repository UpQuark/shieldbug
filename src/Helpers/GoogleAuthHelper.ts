import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = 'YOUR_CLIENT_ID'; // You'll need to get this from Google Cloud Console
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

export const getGoogleAuthToken = async (): Promise<string> => {
  try {
    // Check if we already have a token in storage
    const { googleAuthToken } = await chrome.storage.local.get('googleAuthToken');
    if (googleAuthToken) {
      return googleAuthToken;
    }

    // If no token, initiate OAuth flow
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${chrome.identity.getRedirectURL()}&` +
      `response_type=token&` +
      `scope=${SCOPES.join(' ')}`;

    // Launch OAuth flow
    const redirectUrl = await chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    });

    if (!redirectUrl) {
      throw new Error('OAuth flow failed');
    }

    // Extract token from redirect URL
    const token = new URL(redirectUrl).hash.split('&')[0].split('=')[1];
    
    // Store token
    await chrome.storage.local.set({ googleAuthToken: token });
    
    return token;
  } catch (error) {
    console.error('Error getting Google auth token:', error);
    throw error;
  }
};

export const clearGoogleAuthToken = async (): Promise<void> => {
  await chrome.storage.local.remove('googleAuthToken');
}; 