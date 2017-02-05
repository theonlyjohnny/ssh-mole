const path = require('path');

module.exports = {
  babelrc: false,
  presets: [
    require.resolve('babel-preset-latest'),
    'es2015'
  ],
  plugins: [
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'), [require.resolve('babel-plugin-transform-regenerator'), {
      async: false
    }],
    [require.resolve('babel-plugin-transform-runtime'), {
      helpers: false,
      polyfill: false,
      regenerator: true,
      moduleName: path.dirname(require.resolve('babel-runtime/package'))
    }],
  ]
};
