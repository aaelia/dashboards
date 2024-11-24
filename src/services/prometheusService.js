import axios from 'axios';

const PROMETHEUS_URL = process.env.REACT_APP_PROMETHEUS_URL || 'http://localhost:9090';

export const fetchMetrics = async (query, start, end, step = '15s') => {
  try {
    const response = await axios.get(`${PROMETHEUS_URL}/api/v1/query_range`, {
      params: {
        query,
        start,
        end,
        step,
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

export const getMetricQueries = {
  cpu: 'rate(node_cpu_seconds_total{mode="user"}[5m])',
  memory: 'node_memory_MemUsed_bytes',
  network: 'rate(node_network_receive_bytes_total[5m])',
};