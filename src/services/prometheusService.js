import axios from 'axios';

const PROMETHEUS_URL = process.env.REACT_APP_PROMETHEUS_URL || 'http://localhost:9090';

export const fetchMetrics = async (query, start, end, step = '15s') => {
  try {
    // Convert the time range to match Prometheus API requirements
    const now = Math.floor(Date.now() / 1000);
    const timeRange = {
      start: now - 3600, // 1 hour ago
      end: now,
      step: '15s'
    };

    // Use the Prometheus HTTP API endpoint
    const response = await axios.get(`${PROMETHEUS_URL}/api/v1/query_range`, {
      params: {
        query,
        start: timeRange.start,
        end: timeRange.end,
        step: timeRange.step,
      },
    });

    if (response.data.status === 'success') {
      return response.data.data.result;
    }
    throw new Error('Failed to fetch metrics');
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
};

// These queries match the ones from your Prometheus URL
export const getMetricQueries = {
  chunks: 'rate(prometheus_tsdb_head_chunks_created_total[1m])',
  targetCount: 'count(prometheus_target_interval_length_seconds)',
  targetLatency: 'prometheus_target_interval_length_seconds{quantile="0.99"}',
};