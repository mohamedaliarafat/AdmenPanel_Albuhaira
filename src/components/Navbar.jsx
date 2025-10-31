import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">لوحة تحكم الادمن</Typography>
        <Button color="inherit" onClick={handleLogout}>تسجيل الخروج</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
