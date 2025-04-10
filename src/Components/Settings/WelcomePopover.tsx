import * as React from 'react';
import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const WelcomePopover: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if the welcome dialog has been displayed before
    chrome.storage.sync.get(['welcomeDialogDisplayed'], (result) => {
      if (!result.welcomeDialogDisplayed) {
        setOpen(true);
      }
    });
  }, []);

  const handleClose = () => {
    // Set the flag to true and close the dialog
    chrome.storage.sync.set({ 'welcomeDialogDisplayed': true }, () => {
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Welcome to ShieldBug!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ShieldBug is a browser extension that helps you avoid distractions by letting you block distracting websites
          and categories.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default WelcomePopover;
