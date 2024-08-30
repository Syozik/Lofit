const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'scalextric.js',
    library: 'Scalextric',
    libraryTarget: 'umd',
    globalObject: `typeof self !== 'undefined' ? self : this`,
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true,
  },
};