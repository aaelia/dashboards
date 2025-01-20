import axios from 'axios';
import { getDashboardsConfig } from './dashboardService';

const PROMETHEUS_URL = process.env.REACT_APP_PROMETHEUS_URL || 'http://localhost:51440';
let dashboardConfig = { panels: [] };

export const fetchMetrics = async (panelId) => {
  try {
    // Get the latest configuration
    const config = await getDashboardsConfig();
    console.log('Config for fetchMetrics:', config);
    const panel = config.panels.find(p => p.id === panelId);
    if (!panel) {
      console.error(`Panel ${panelId} not found in configuration`);
      return {
        data: [],
        title: 'Error: Panel not found',
        unit: ''
      };
    }

    const now = Math.floor(Date.now() / 1000);
    const params = {
      query: panel.query,
      start: now - panel.timeRange,
      end: now,
      step: '15s'
    };

    console.log('Fetching metrics with params:', params);
    console.log('Prometheus URL:', PROMETHEUS_URL);

    try {
      const response = await axios.get(`${PROMETHEUS_URL}/api/v1/query_range`, { params });
      console.log('Prometheus response:', response.data);

      if (response.data.status === 'success') {
        const result = response.data.data.result[0]?.values.map(([timestamp, value]) => ({
          timestamp: new Date(timestamp * 1000).toLocaleTimeString(),
          value: parseFloat(value) * (panel.valueMultiplier || 1),
        })) || [];

        return {
          data: result,
          title: `${panel.title} (${panel.timeRange / 60}m)`,
          unit: panel.unit
        };
      }
      console.error('Prometheus returned non-success status:', response.data);
      return {
        data: [],
        title: `${panel.title} (Error)`,
        unit: panel.unit
      };
    } catch (error) {
      console.error('Error fetching from Prometheus:', error.message);
      return {
        data: [],
        title: `${panel.title} (Connection Error)`,
        unit: panel.unit
      };
    }
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
};

export const getPanelConfig = async () => {
  dashboardConfig = await getDashboardsConfig();
  console.log('Dashboard config:', dashboardConfig);
  console.log('Panels:', dashboardConfig.panels);
  return dashboardConfig.panels;
};
