import React from 'react';
import { Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardPanel = ({ title, data, unit }) => {
  const formatValue = (value) => {
    if (typeof value === 'number') {
      return `${value.toFixed(2)} ${unit || ''}`;
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
          <p>{`Time: ${label}`}</p>
          <p>{`Value: ${formatValue(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis tickFormatter={formatValue} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="value" stroke="#0f172a" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DashboardPanel;
