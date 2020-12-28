const path = require('path')
const fs = require('fs')
const process = require('process')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const appDir = path.resolve(process.cwd(), 'app')
const nodeModuleDir = path.resolve(process.cwd(), 'node_module')
// 开发服务器配置
const ip = require('ip')
const port = 8080
const host = ip.address()
const proxy = {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  }
}
// postCss 配置
const postCssLoader = {
  loader: 'postcss-loader',
  options: { postcssOptions: { plugins: [['autoprefixer']] } }
}
// ts/js rule
const presets = [
  "@babel/preset-react",
  [
    "@babel/preset-env",
    {
      "useBuiltIns": "usage",
      "corejs": "3.0.0"
    }
  ]
]
const typeScriptRule = {
  test: /\.ts(x?)$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        "@babel/preset-typescript",
        ...presets
      ],
      plugins: [
        "@babel/plugin-proposal-class-properties"
      ]
    }
  },
  include: [appDir],
}
const javaScriptRule = {
  test: /\.js(x?)$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets,
      plugins: typeScriptRule.use.options.plugins
    }
  },
  include: [path.resolve(process.cwd(), 'node_modules/recoil')],
}
const cssModuleLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: '[local]__[hash:base64:5]'
    },
  }
}
const modulesStyleRule = {
  test: new RegExp(`^(?!.*\\.common).*\\.css`),
  use: [
    'style-loader',
    cssModuleLoader,
    postCssLoader
  ],
  include: [appDir]
}
const commonStyleRule = {
  test: new RegExp(`^(.*\\.common).*\\.css`),
  use: [
    'style-loader',
    'css-loader',
    postCssLoader
  ],
  include: [appDir]
}
const fileRule = {
  test: /\.(png|svg|jpg|gif|woff|woff2)$/,
  use: [{
    loader: 'url-loader',
    options: { limit: 2500 },
  }],
  include: [appDir],
  exclude: [nodeModuleDir]
}

module.exports = async () => {
  return {
    target: 'web',
    mode: 'development',
    entry: { 'app': [path.resolve(appDir, 'app.tsx')] },
    resolve: {
      extensions: [".ts", ".tsx", '.js']
    },
    module: {
      rules: [
        typeScriptRule,
        javaScriptRule,
        modulesStyleRule,
        commonStyleRule,
        fileRule
      ]
    },
    devServer: {
      port, host,
      compress: true,
      hot: true,
      contentBase: path.resolve(process.cwd(), 'build'),
      historyApiFallback: true,
      proxy
    },
    output: { publicPath: '/' },
    devtool: 'source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        filename: `index.html`,
        title: 'title',
        template: path.join(appDir, 'app.html'),
        inject: true,
        chunks: ['app']
      })
    ],
  }
}