import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Dashboard, Memory, Storage, NetworkCheck } from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ onMenuSelect }) => {
  const menuItems = [
    { text: 'Overview', icon: <Dashboard />, id: 'overview' },
    { text: 'CPU Metrics', icon: <Memory />, id: 'cpu' },
    { text: 'Memory Usage', icon: <Storage />, id: 'memory' },
    { text: 'Network Stats', icon: <NetworkCheck />, id: 'network' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <div style={{ padding: '20px' }}>
        <Typography variant="h6">Prometheus Dashboard</Typography>
      </div>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.id}
            onClick={() => onMenuSelect(item.id)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;