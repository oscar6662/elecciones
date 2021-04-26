const { createProxyMiddleware } = require('http-proxy-middleware');
console.log("hlasdda");
module.exports = function(app) {
  console.log("holka");
  app.use(
    '**',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};