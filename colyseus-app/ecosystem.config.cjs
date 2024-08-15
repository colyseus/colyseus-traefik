const os = require('os');

/**
 * COLYSEUS CLOUD WARNING:
 * ----------------------
 * PLEASE DO NOT UPDATE THIS FILE MANUALLY AS IT MAY CAUSE DEPLOYMENT ISSUES
 */

module.exports = {
  apps : [{
    name: "colyseus-app",
    script: 'build/index.js',
    time: true,
    watch: false,
    // instances: 1,
    instances: 2,
    exec_mode: 'fork',
    wait_ready: true,
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};

