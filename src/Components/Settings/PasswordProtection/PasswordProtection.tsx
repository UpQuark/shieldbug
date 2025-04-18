import * as React from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    Grid,
    Alert,
    Snackbar,
    Divider,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const PasswordProtection: React.FC = () => {
    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [passwordHash, setPasswordHash] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [isResetting, setIsResetting] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Load state from Chrome storage
    useEffect(() => {
        chrome.storage.sync.get(['passwordProtection', 'passwordHash'], (data) => {
            setIsEnabled(data.passwordProtection || false);
            setPasswordHash(data.passwordHash || null);
        });
    }, []);

    // Toggle password protection
    const handleToggleEnabled = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setIsEnabled(newValue);
        
        // Save to Chrome storage
        chrome.storage.sync.set({ passwordProtection: newValue }, () => {
            showSnackbar(`Password protection ${newValue ? 'enabled' : 'disabled'}`, 'success');
        });
    };

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

    // Function to verify password
    const verifyPassword = async (input: string, storedHash: string): Promise<boolean> => {
        const inputHash = await hashPassword(input);
        return inputHash === storedHash;
    };

    // Set new password
    const handleSetPassword = async () => {
        // Validate inputs
        if (!password) {
            showSnackbar('Please enter a password', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showSnackbar('Passwords do not match', 'error');
            return;
        }

        // Hash and save the password
        const hash = await hashPassword(password);
        chrome.storage.sync.set({ passwordHash: hash }, () => {
            setPasswordHash(hash);
            setPassword('');
            setConfirmPassword('');
            showSnackbar('Password set successfully', 'success');
        });
    };

    // Start password reset process
    const handleStartReset = () => {
        setIsResetting(true);
    };

    // Reset password
    const handleResetPassword = async () => {
        // Verify current password if one exists
        if (passwordHash) {
            const isValid = await verifyPassword(currentPassword, passwordHash);
            if (!isValid) {
                showSnackbar('Current password is incorrect', 'error');
                return;
            }
        }

        // Validate new password
        if (!password) {
            showSnackbar('Please enter a new password', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showSnackbar('New passwords do not match', 'error');
            return;
        }

        // Hash and save the new password
        const hash = await hashPassword(password);
        chrome.storage.sync.set({ passwordHash: hash }, () => {
            setPasswordHash(hash);
            setPassword('');
            setConfirmPassword('');
            setCurrentPassword('');
            setIsResetting(false);
            showSnackbar('Password reset successfully', 'success');
        });
    };

    // Cancel reset process
    const handleCancelReset = () => {
        setIsResetting(false);
        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
    };

    // Show snackbar message
    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    // Close snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Toggle password visibility
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Toggle confirm password visibility
    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Toggle current password visibility
    const handleToggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Password Protection
            </Typography>
            <Typography variant="body1" paragraph>
                Enable password protection for your ShieldBug settings.
            </Typography>

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isEnabled}
                            onChange={handleToggleEnabled}
                            color="primary"
                        />
                    }
                    label={
                        <Typography variant="h6">
                            {isEnabled ? 'Password Protection Enabled' : 'Password Protection Disabled'}
                        </Typography>
                    }
                />
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {isResetting ? 'Reset Password' : (passwordHash ? 'Change Password' : 'Set Password')}
                </Typography>

                {isResetting && passwordHash && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body1" gutterBottom>
                            Enter your current password to continue
                        </Typography>
                        <TextField
                            label="Current Password"
                            type={showCurrentPassword ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleToggleCurrentPasswordVisibility} edge="end">
                                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                )}

                <Divider sx={{ my: 2, display: isResetting ? 'block' : 'none' }} />

                <Box>
                    <Typography variant="body1" gutterBottom>
                        {isResetting ? 'Enter your new password' : 'Enter a password to protect your settings'}
                    </Typography>
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleToggleConfirmPasswordVisibility} edge="end">
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    {!isResetting ? (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSetPassword}
                                disabled={!password || !confirmPassword}
                            >
                                {passwordHash ? 'Change Password' : 'Set Password'}
                            </Button>
                            {passwordHash && (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleStartReset}
                                >
                                    Reset Password
                                </Button>
                            )}
                        </>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleResetPassword}
                                disabled={
                                    (!password || !confirmPassword) || 
                                    (passwordHash !== null && !currentPassword)
                                }
                            >
                                Save New Password
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCancelReset}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PasswordProtection; 