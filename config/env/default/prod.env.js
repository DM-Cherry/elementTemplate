const variables = require('./variables');

module.exports = Object.assign(variables, {
  NODE_ENV: 'production',
  API_ENDPOINT: 'http://192.168.101.119:10024/',
});
