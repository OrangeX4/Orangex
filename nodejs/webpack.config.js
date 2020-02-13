'use strict';
const NodemonPlugin = require('nodemon-webpack-plugin');
module.exports = (env = {}) => {
//   const config = {
//     entry: ['./src/index.js'],
//     mode: env.development ? 'development' : 'production',
//     target: 'node',
//     devtool: env.development ? 'cheap-eval-source-map' : false,  
//     resolve: { // tells Webpack what files to watch.
//       modules: ['node_modules', 'src', 'package.json'],
//     },   
//     plugins: [] // required for config.plugins.push(...);
//   };
const config = {
    entry: ['./src/index.ts'],
    mode: env.production ? 'development' : 'production',
    target: 'node',
    devtool: env.production ? 'cheap-eval-source-map' : false,
    resolve: {
      // Tells Webpack what files to watch      
      extensions: ['.ts', '.js'],
      modules: ['node_modules', 'src', 'package.json'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
        },
      ],
    },
    plugins: [], // Required for config.plugins.push(...);
  };
  if (env.nodemon) {
    config.watch = true;
    config.plugins.push(new NodemonPlugin());
  }
  return config;
};
