'use client';
import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function AppBarHeader({ isLoggedIn, role, logout, setAuthModalOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, bgcolor: '#591814' }}>
      <Toolbar>
        <Typography
          variant="h5"
          sx={{ flexGrow: 1 }}
          style={{ fontFamily: 'Butler, Playfair Display, serif' }}
        >
          Pantry Tracker
        </Typography>

        
        <Button
          color="inherit"
          onClick={handleMenuClick}
          sx={{ textTransform: 'none' }}
        >
           Menu
        </Button>
        
        

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          {isLoggedIn && role === 'Admin' && (
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push('/admin');
              }}
            >
              Admin Dashboard
            </MenuItem>
          )}
          {isLoggedIn && (
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push('/');
              }}
            >
              My Pantry
            </MenuItem>
          )}
          {isLoggedIn ? (
            <MenuItem
              onClick={() => {
                handleMenuClose();
                logout();
              }}
            >
              Logout
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                handleMenuClose();
                setAuthModalOpen(true);
              }}
            >
              Login / Register
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
