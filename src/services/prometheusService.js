import axios from 'axios';

const PROMETHEUS_URL = process.env.REACT_APP_PROMETHEUS_URL || 'http://localhost:9090';

export const fetchMetrics = async (query, start, end, step = '15s') => {
  try {
    const response = await axios.get(`${PROMETHEUS_URL}`, {
      params: {
        'g0.expr': 'rate(prometheus_tsdb_head_chunks_created_total[1m])',
        'g0.tab': 'graph',
        'g0.show_exemplars': false,
        'g0.range_input': '1h',
        'g1.expr': 'count(prometheus_target_interval_length_seconds)',
        'g1.tab': 'graph',
        'g1.show_exemplars': false,
        'g1.range_input': '1h',
        'g2.expr': 'prometheus_target_interval_length_seconds{quantile="0.99"}',
        'g2.tab': 'graph',
        'g2.show_exemplars': false,
        'g2.range_input': '15m'
      }
    });

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
  chunks: 'g0',
  targetCount: 'g1',
  targetLatency: 'g2'
};
