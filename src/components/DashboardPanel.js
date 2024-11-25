import React from 'react';
import { Paper, Typography } from '@mui/material';

const DashboardPanel = ({ title, data }) => {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <pre style={{ overflow: 'auto', maxHeight: '300px' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </Paper>
  );
};

export default DashboardPanel;