const path = require('path')
const {EnvironmentPlugin, DefinePlugin} = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin') 
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require("copy-webpack-plugin");
require('dotenv').config()

const appTitle = 'VUE3 WEBPACK5 BOILERPLATE'

const srcDirName = 'src' // src files dir default: src
const publicDirName = 'public'

const distDirName = 'dist' // location index.html file
const assetsDirName = 'assets' // location js, css, fonts etc directories 


const devServerPort = process.env.FRONT_DEV_PORT || 8080

module.exports = (env, argv) => ({
  entry: {
    main: path.resolve(__dirname, srcDirName, 'main.js')
  },
  output: {
    filename:  path.join(assetsDirName, 'js', '[name].[contenthash:8].js'),
    path: path.resolve(__dirname, distDirName),
  },
  plugins: [
    new DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(false),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
    }),
    new EnvironmentPlugin({
      NODE_ENV: argv.mode,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, publicDirName, assetsDirName),
          to: assetsDirName
        }
      ]
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: path.join(assetsDirName, 'css', '[name].[contenthash:8].css')
    }),
    new HtmlWebpackPlugin({
      title: appTitle,
      favicon: path.resolve(__dirname, publicDirName, 'favicon.ico'),
      template: path.resolve(__dirname, publicDirName, 'index.html'),
    })
  ],
  resolve: {
    alias: {
      'vue$': path.join('vue', 'dist',  argv.mode === 'development'?  'vue.esm-bundler.js' : 'vue.runtime.esm-bundler.js'),
      '@': path.resolve(__dirname, srcDirName, 'components'),
      '~': path.resolve(__dirname, srcDirName),
    },
    extensions: ['.js', '.vue']
  },
  module: {  
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
            ],
          }
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.s?css$/,
        use: [
          'vue-style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false
            }
          },
          {
            loader: 'css-loader',
            options: {
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer'
                ],
            
              },
            }
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: path.join(assetsDirName, 'fonts', '[name].[contenthash:8][ext]')
        }
      },
      {
        test: /\.(gif|jpe?g|bmp|png)$/,
        type: 'asset/resource',
        generator: {
          filename: path.join(assetsDirName, 'images', '[name].[contenthash:8][ext]')
        }
      }
    ]
  },
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "multiple",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10,
          reuseExistingChunk: true,
          chunks: "all",
        },
      },
      chunks: 'all'    
    },
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, distDirName),
    },
    port: devServerPort,
    historyApiFallback: true,
  },
})