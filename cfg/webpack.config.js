const webpack = require("webpack");

const mode = process.env.MODE || 'build'

const plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    },
    mangle: false
  })
]

module.exports = {
  entry: `./index.js`,
  bail: true,
  target: 'node',
  watch: false,
  devtool: 'source-map',
  debug: true,
  eslint: {
    configFile: 'cfg/.eslintrc'
  },
  output: {
    path: './dist',
    filename: `bundle.js`,
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      query: require("./babel.js")
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "eslint-loader"
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  plugins: plugins,
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
}
