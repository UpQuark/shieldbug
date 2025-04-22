import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Alert,
    InputAdornment,
    IconButton,
    Dialog,
    Fade
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

interface PasswordOverlayProps {
    children: React.ReactNode;
    isPopup?: boolean;
}

const PasswordOverlay: React.FC<PasswordOverlayProps> = ({ children, isPopup = false }) => {
    const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);
    const [passwordHash, setPasswordHash] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    
    // Get current route to exempt password protection page
    // In popup context, there's no router, so we use the isPopup prop
    let isPasswordProtectionPage = false;
    try {
        const location = useLocation();
        isPasswordProtectionPage = location.pathname === '/password-protection';
    } catch (e) {
        // useLocation hook will throw in popup context where there's no Router
        // Do nothing, isPasswordProtectionPage remains false
    }

    useEffect(() => {
        // Check if password protection is enabled and a password is set
        chrome.storage.sync.get(['passwordProtection', 'passwordHash'], (data) => {
            setIsProtectionEnabled(data.passwordProtection || false);
            setPasswordHash(data.passwordHash || null);
            
            // If password protection is not enabled, no password set, or on the password protection page, unlock immediately
            if (!data.passwordProtection || !data.passwordHash || isPasswordProtectionPage) {
                setIsUnlocked(true);
            }
        });
    }, [isPasswordProtectionPage]);

    // Function to hash password
    const hashPassword = async (text: string): Promise<string> => {
        // Convert string to ArrayBuffer
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        
        // Hash the data
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        
        // Convert ArrayBuffer to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    };

    // Handle password verification
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!password) {
            setError('Please enter a password');
            return;
        }
        
        setIsVerifying(true);
        setError('');
        
        try {
            // Hash the entered password and compare with stored hash
            const hash = await hashPassword(password);
            
            if (hash === passwordHash) {
                setIsUnlocked(true);
            } else {
                setError('Incorrect password');
            }
        } catch (err) {
            setError('An error occurred while verifying the password');
            console.error(err);
        } finally {
            setIsVerifying(false);
        }
    };

    // If protection is not enabled or already unlocked or on password protection page, show children
    if (!isProtectionEnabled || isUnlocked || isPasswordProtectionPage) {
        return <>{children}</>;
    }

    return (
        <Fade in={true}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    width: '100%',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 9999,
                    p: 2,
                    ...(isPopup && {
                        height: '100%',
                        position: 'absolute',
                        boxSizing: 'border-box'
                    })
                }}
            >
                <Paper
                    elevation={5}
                    sx={{
                        p: isPopup ? 2 : 4,
                        width: '100%',
                        maxWidth: isPopup ? 350 : 400,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Lock sx={{ fontSize: isPopup ? 36 : 48, color: 'primary.main', mb: isPopup ? 1 : 2 }} />
                    <Typography variant={isPopup ? "h6" : "h5"} component="h2" gutterBottom align="center">
                        Enter Password
                    </Typography>
                    <Typography 
                        variant="body2" 
                        color="textSecondary" 
                        paragraph 
                        align="center"
                        sx={{ mb: isPopup ? 1 : 2 }}
                    >
                        Settings are protected. Please enter your password to continue.
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: isPopup ? 1 : 2 }}>
                            {error}
                        </Alert>
                    )}
                    
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            size={isPopup ? "small" : "medium"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            size={isPopup ? "small" : "medium"}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size={isPopup ? "medium" : "large"}
                            disabled={isVerifying}
                            sx={{ mt: isPopup ? 1 : 2 }}
                        >
                            {isVerifying ? <CircularProgress size={isPopup ? 20 : 24} /> : 'Unlock'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Fade>
    );
};

export default PasswordOverlay; 