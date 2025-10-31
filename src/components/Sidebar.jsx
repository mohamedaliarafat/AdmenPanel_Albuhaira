import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'المستخدمين', path: '/users' },
    { text: 'الطلبات', path: '/orders' },
    { text: 'المنتجات', path: '/products' },
    { text: 'الإشعارات', path: '/notifications' },
  ];

  return (
    <Drawer variant="permanent" anchor="left">
      <List style={{ width: 200 }}>
        {menuItems.map(item => (
          <ListItem 
            button 
            key={item.path} 
            component={Link} 
            to={item.path} 
            selected={location.pathname === item.path}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
