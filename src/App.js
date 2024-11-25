import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Grid } from '@mui/material';
import Sidebar from './components/Sidebar';
import DashboardPanel from './components/DashboardPanel';
import { fetchMetrics, getPanelConfig } from './services/prometheusService';

function App() {
  const [selectedPanel, setSelectedPanel] = useState('overview');
  const [metricsData, setMetricsData] = useState({});
  const panels = getPanelConfig();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.all(
          panels.map(panel => fetchMetrics(panel.id))
        );

        const newData = {};
        results.forEach((result, index) => {
          newData[panels[index].id] = result;
        });

        setMetricsData(newData);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, [panels]);

  const renderPanels = () => {
    if (selectedPanel === 'overview') {
      return (
        <>
          {panels.map(panel => (
            <Grid item xs={12} md={4} key={panel.id}>
              <DashboardPanel
                title={metricsData[panel.id]?.title || panel.title}
                data={metricsData[panel.id]?.data || []}
                unit={metricsData[panel.id]?.unit || panel.unit}
              />
            </Grid>
          ))}
        </>
      );
    }

    const panel = panels.find(p => p.id === selectedPanel);
    if (!panel) return null;

    return (
      <Grid item xs={12}>
        <DashboardPanel
          title={metricsData[panel.id]?.title || panel.title}
          data={metricsData[panel.id]?.data || []}
          unit={metricsData[panel.id]?.unit || panel.unit}
        />
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
