const variables = require('./variables');

module.exports = Object.assign(variables, {
  NODE_ENV: 'development',
  API_ENDPOINT: 'http://192.168.101.25:10024/',
  // API_ENDPOINT: 'http://192.168.129.14:10024/',
});
