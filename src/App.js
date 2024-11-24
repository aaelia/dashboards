import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Grid } from '@mui/material';
import Sidebar from './components/Sidebar';
import DashboardPanel from './components/DashboardPanel';
import { fetchMetrics, getMetricQueries } from './services/prometheusService';

function App() {
  const [selectedPanel, setSelectedPanel] = useState('overview');
  const [metricsData, setMetricsData] = useState({
    cpu: [],
    memory: [],
    network: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const end = Math.floor(Date.now() / 1000);
      const start = end - 3600; // Last hour

      try {
        const [cpuData, memoryData, networkData] = await Promise.all([
          fetchMetrics(getMetricQueries.cpu, start, end),
          fetchMetrics(getMetricQueries.memory, start, end),
          fetchMetrics(getMetricQueries.network, start, end),
        ]);

        setMetricsData({
          cpu: cpuData[0]?.values.map(([timestamp, value]) => ({
            timestamp: new Date(timestamp * 1000).toLocaleTimeString(),
            value: parseFloat(value),
          })) || [],
          memory: memoryData[0]?.values.map(([timestamp, value]) => ({
            timestamp: new Date(timestamp * 1000).toLocaleTimeString(),
            value: parseFloat(value) / (1024 * 1024 * 1024), // Convert to GB
          })) || [],
          network: networkData[0]?.values.map(([timestamp, value]) => ({
            timestamp: new Date(timestamp * 1000).toLocaleTimeString(),
            value: parseFloat(value) / (1024 * 1024), // Convert to MB/s
          })) || [],
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const renderPanels = () => {
    if (selectedPanel === 'overview') {
      return (
        <>
          <Grid item xs={12} md={4}>
            <DashboardPanel title="CPU Usage" data={metricsData.cpu} dataKey="value" />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardPanel title="Memory Usage (GB)" data={metricsData.memory} dataKey="value" />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardPanel title="Network Traffic (MB/s)" data={metricsData.network} dataKey="value" />
          </Grid>
        </>
      );
    }

    const panelData = {
      cpu: { title: 'CPU Usage', data: metricsData.cpu },
      memory: { title: 'Memory Usage (GB)', data: metricsData.memory },
      network: { title: 'Network Traffic (MB/s)', data: metricsData.network },
    }[selectedPanel];

    return (
      <Grid item xs={12}>
        <DashboardPanel title={panelData.title} data={panelData.data} dataKey="value" />
      </Grid>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar onMenuSelect={setSelectedPanel} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
        }}
      >
        <Grid container spacing={3}>
          {renderPanels()}
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
