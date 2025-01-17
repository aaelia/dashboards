import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Grid } from '@mui/material';
import Sidebar from './components/Sidebar';
import DashboardPanel from './components/DashboardPanel';
import SpaceshipLoader from './components/SpaceshipLoader';
import { fetchMetrics, getPanelConfig } from './services/prometheusService';

function App() {
  const [selectedPanel, setSelectedPanel] = useState('overview');
  const [metricsData, setMetricsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadStartTime, setLoadStartTime] = useState(Date.now());
  const [panels, setPanels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setLoadStartTime(Date.now());
      try {
        const panelConfig = await getPanelConfig();
        if (!Array.isArray(panelConfig)) {
          console.error('Invalid panel configuration received:', panelConfig);
          return;
        }

        setPanels(panelConfig);
        
        const results = await Promise.all(
          panelConfig.map(async panel => {
            try {
              return await fetchMetrics(panel.id);
            } catch (error) {
              console.error(`Error fetching metrics for panel ${panel.id}:`, error);
              return null;
            }
          })
        );

        const newData = {};
        results.forEach((result, index) => {
          if (result) {
            newData[panelConfig[index].id] = result;
          }
        });

        setMetricsData(newData);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        // Ensure loader stays visible for at least 5 seconds
        const elapsedTime = Date.now() - loadStartTime;
        const remainingTime = Math.max(0, 5000 - elapsedTime);
        
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
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
        <Grid container spacing={0.625}> {/* 5px spacing */}
          {renderPanels()}
        </Grid>
      </Box>
      {isLoading && <SpaceshipLoader />}
    </Box>
  );
}

export default App;
