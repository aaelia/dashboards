const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy for Prometheus
  app.use(
    '/prometheus',
    createProxyMiddleware({
      target: 'http://localhost:9090',
      changeOrigin: true,
      pathRewrite: {
        '^/prometheus': ''
      }
    })
  );

  // Proxy for Firebase
  app.use(
    '/firebase',
    createProxyMiddleware({
      target: 'https://firestore.googleapis.com',
      changeOrigin: true,
      pathRewrite: {
        '^/firebase': ''
      }
    })
  );
};