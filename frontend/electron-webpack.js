const { withExpoAdapter } = require('@expo/electron-adapter');

module.exports = withExpoAdapter({
  projectRoot: __dirname,
  "main": {
    "sourceDirectory": "src/electron",
  },
  whiteListedModules: ['react-query', 'react-use-websocket']
  // Provide any overrides for electron-webpack: https://github.com/electron-userland/electron-webpack/blob/master/docs/en/configuration.md
});
