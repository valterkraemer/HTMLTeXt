const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const autoprefixer = require('autoprefixer')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer({
                browsers: ['last 3 versions', '> 1%']
              })
            ]
          }
        }, {
          loader: 'sass-loader'
        }]
      }
    ]
  }
})
