import axios from 'axios';

const PROMETHEUS_URL = process.env.REACT_APP_PROMETHEUS_URL || 'http://localhost:9090';

export const fetchMetrics = async () => {
  try {
    const response = await axios.get(`${PROMETHEUS_URL}/query`, {
      params: {
        'g0.expr': 'rate(prometheus_tsdb_head_chunks_created_total[1m])',
        'g0.show_tree': '0',
        'g0.tab': 'graph',
        'g0.range_input': '30m',
        'g0.res_type': 'auto',
        'g0.res_density': 'medium',
        'g0.display_mode': 'lines',
        'g0.show_exemplars': '0',
        'g1.expr': 'count(prometheus_target_interval_length_seconds)',
        'g1.show_tree': '0',
        'g1.tab': 'graph',
        'g1.range_input': '1h',
        'g1.res_type': 'auto',
        'g1.res_density': 'medium',
        'g1.display_mode': 'lines',
        'g1.show_exemplars': '0',
        'g2.expr': 'prometheus_target_interval_length_seconds{quantile="0.99"}',
        'g2.show_tree': '0',
        'g2.tab': 'graph',
        'g2.range_input': '5m',
        'g2.res_type': 'auto',
        'g2.res_density': 'medium',
        'g2.display_mode': 'lines',
        'g2.show_exemplars': '0'
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