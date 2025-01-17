import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import * as Icons from '@mui/icons-material';
import { getPanelConfig } from '../services/prometheusService';

const drawerWidth = 240;

const Sidebar = ({ onMenuSelect }) => {
  const panels = getPanelConfig();
  const menuItems = [
    { text: 'Overview', icon: 'Dashboard', id: 'overview' },
    ...panels.map(panel => ({
      text: panel.menuText,
      icon: panel.icon,
      id: panel.id
    }))
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
        <Typography variant="h6">Prometheus Metrics</Typography>
      </div>
      <List>
        {menuItems.map((item) => {
          const Icon = Icons[item.icon];
          return (
            <ListItem
              button
              key={item.id}
              onClick={() => onMenuSelect(item.id)}
            >
              <ListItemIcon>{Icon && <Icon />}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
