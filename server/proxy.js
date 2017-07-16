const proxy = require('http-proxy-middleware');
const config = require('./config');

const nodeEnv = process.env.node_env || 'development';

const ounassProxy = proxy({
    target: config.ounass,
    changeOrigin: true,
    xfwd: true,
    pathRewrite: {
        '/search/' : '/full/'
    }
}),
mamasProxy = proxy({
    target: config.mamasandpapas,
    changeOrigin: true,
    xfwd: true,
    pathRewrite: {
        '/search/' : '/full/'
    }
});

module.exports = {
	ounassProxy: ounassProxy,
	mamasProxy: mamasProxy
};