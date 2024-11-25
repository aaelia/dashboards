import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Grid } from '@mui/material';
import Sidebar from './components/Sidebar';
import DashboardPanel from './components/DashboardPanel';
import { fetchMetrics, getMetricQueries } from './services/prometheusService';

function App() {
  const [selectedPanel, setSelectedPanel] = useState('overview');
  const [metricsData, setMetricsData] = useState({
    chunks: [],
    targetCount: [],
    targetLatency: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chunksData, targetCountData, targetLatencyData] = await Promise.all([
          fetchMetrics(getMetricQueries.chunks.query, getMetricQueries.chunks.timeRange),
          fetchMetrics(getMetricQueries.targetCount.query, getMetricQueries.targetCount.timeRange),
          fetchMetrics(getMetricQueries.targetLatency.query, getMetricQueries.targetLatency.timeRange),
        ]);

        setMetricsData({
          chunks: chunksData[0]?.values.map(([timestamp, value]) => ({
            timestamp: new Date(timestamp * 1000).toLocaleTimeString(),
            value: parseFloat(value),
          })) || [],
          targetCount: targetCountData[0]?.values.map(([timestamp, value]) => ({
            timestamp: new Date(timestamp * 1000).toLocaleTimeString(),
            value: parseFloat(value),
          })) || [],
          targetLatency: targetLatencyData[0]?.values.map(([timestamp, value]) => ({
            timestamp: new Date(timestamp * 1000).toLocaleTimeString(),
            value: parseFloat(value) * 1000, // Convert to milliseconds
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
            <DashboardPanel title="TSDB Chunks Creation Rate" data={metricsData.chunks} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardPanel title="Target Count" data={metricsData.targetCount} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DashboardPanel title="Target Latency (ms)" data={metricsData.targetLatency} />
          </Grid>
        </>
      );
    }

    const panelData = {
      chunks: { title: 'TSDB Chunks Creation Rate', data: metricsData.chunks },
      targetCount: { title: 'Target Count', data: metricsData.targetCount },
      targetLatency: { title: 'Target Latency (ms)', data: metricsData.targetLatency },
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
