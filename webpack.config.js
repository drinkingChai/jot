const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /jsx?$/,
        exclude: /node_modules/,
        query: {
          plugins: ['transform-decorators-legacy'],
          presets: [ 'env', 'react', 'stage-2' ]
        }
      }
    ]
  },
  node: {
    net: 'empty',
    dns: 'empty'
  }
}
