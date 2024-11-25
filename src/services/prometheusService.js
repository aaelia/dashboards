import axios from 'axios';

const PROMETHEUS_URL = process.env.REACT_APP_PROMETHEUS_URL || 'http://localhost:9090';

export const fetchMetrics = async (query, timeRange) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const params = {
      query,
      start: now - timeRange,
      end: now,
      step: '15s'
    };

    const response = await axios.get(`${PROMETHEUS_URL}/api/v1/query_range`, { params });

    if (response.data) {
      return response.data;
    }
    throw new Error('Failed to fetch metrics');
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
};

export const getMetricQueries = {
  chunks: {
    query: 'rate(prometheus_tsdb_head_chunks_created_total[1m])',
    timeRange: 30 * 60  // 30 minutes
  },
  targetCount: {
    query: 'count(prometheus_target_interval_length_seconds)',
    timeRange: 60 * 60  // 1 hour
  },
  targetLatency: {
    query: 'prometheus_target_interval_length_seconds{quantile="0.99"}',
    timeRange: 5 * 60   // 5 minutes
  }
};
