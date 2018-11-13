const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
var path = require('path');
    function root(__path) {
        return path.join(__dirname, __path);
    }

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';
//const ExportEntryDir = 'LLQnl'; 
const ExportEntryDir = 'LLQcom';
//const ExportEntryDir = 'LLQelectron';

module.exports = {
  //devtool: 'source-map',
  entry: {
      'polyfills': './src/polyfills.ts',
      'styles':  './src/styles.scss',
      ExportEntryDir: './src/'+ ExportEntryDir +'/main.ts'
   },
    output: {
      path: root('./distdev'),
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: '[id].chunk.js'
    },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  //see: https://github.com/webpack-contrib/css-loader/issues/447
  node: {  fs: 'empty' },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.(docx)$/,
        loader: 'file-loader?name=templates/[name].[ext]'
      },
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: '@ngtools/webpack'
      }, 
      {
        // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
        // Removing this will cause deprecation warnings to appear.
        test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
        parser: { system: true },
      },
      {
        test: /\.css$/,
        exclude: root('./src'),
        loader: 'null-loader'
      },
      {
        test: /\.css$/,
        include: root('./src'),
        loader: ['to-string-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        include: root('./src'), //for component stylesurl's...
        //use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'sass-loader'] })
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          "css-loader","sass-loader"
        ]

      },

    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new AngularCompilerPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: './src/'+ ExportEntryDir +'/app.module#AppModule',
      sourceMap: true
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional naam kan ook "[name].[hash].css"
      filename: "[name].css",
      chunkFilename: "[id].css"
    })


  ],

  mode: 'development',

  devServer: {
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    contentBase: './dist',
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 250
    },
    stats: {
      assets: true,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false
    },
  }
}