/**
 * REPORTS: https://chrisbateman.github.io/webpack-visualizer/
 */

const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const RobotstxtPlugin = require("robotstxt-webpack-plugin").default;
const WebpackPwaManifest = require('webpack-pwa-manifest');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
//const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CompressionWebpackPlugin = require("compression-webpack-plugin")
//var ImageminPlugin = require('imagemin-webpack-plugin').default;
const path = require('path');
    function root(__path) {
        return path.join(__dirname, __path);
    }
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
//const PUBLIC_PATH = 'https://www.legallinq.com/20181106/'; const ExportEntryDir = 'LLQcom'  // webpack needs the trailing slash for output.publicPath
const PUBLIC_PATH = 'https://www.legallinq.nl/20181123/';  const ExportEntryDir = 'LLQnl'// webpack needs the trailing slash for output.publicPath
//const PUBLIC_PATH = '';

module.exports = {
  devtool: false, //instead of 'source-map'
  stats: 'normal', //ALT: 'errors-only' of 'normal' of 'verbose' (is maximaal)
  output: {
    path: root('/dist'),
    publicPath: PUBLIC_PATH,
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  entry: {
    'polyfills': './src/polyfills.ts',
    'styles':  './src/styles.scss',
    ExportEntryDir: './src/'+ ExportEntryDir +'/main.ts'
    },
  //see: https://github.com/webpack-contrib/css-loader/issues/447
  node: {  fs: 'empty' },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|ico)$/,
        use: [
          'file-loader?name=assets/[name].[hash].[ext]',
          {
            //opties image loader: https://www.npmjs.com/package/image-webpack-loader
            loader: 'image-webpack-loader',
            options: {
              disable: false, // webpack@2.x and 
              mozjpeg: {progressive: false,  quality: 100  },
              // optipng.enabled: false will disable optipng
              optipng: {enabled: false,},
              pngquant: {quality: '65-90', speed: 4},
              gifsicle: {interlaced: false, },
              // the webp option will enable WEBP, maar nauwelijke compatiability: https://caniuse.com/#search=webp
              //webp: { quality: 75}
            },
          },
        ],
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot)$/,
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
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
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
            options: {  }
          },
            'css-loader',
            'postcss-loader',
            'sass-loader'
        ]
      },
    ]
  },

  optimization: {
    //minimize: false,
    //https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production
    minimizer: [
      //new UglifyJsPlugin(),
      new MinifyPlugin({"mangle": true}), //zet "false" bij te weinig memory/timeout van build:extra-memory
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
        chunks: "all",// include all types of chunks
        maxSize: 1100000,
    }
  },

  plugins: [
    //IK DENK EEN ENV PLUGIN TE VEEL, MAAR WEET NIET ZEKER 
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
 
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    }),

    new AngularCompilerPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: './src/'+ ExportEntryDir +'/app.module#AppModule',
      sourceMap: false
    }),
    
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional naam kan ook "[name].[hash].css"
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    // Make sure that the plugin is after any plugins that add images
    //NU EEN LOADER GENOMEN, HIER NOG EVEN HOUDEN VOORAL ALS IK TERUG WIL NAAR DEZE PLUGIN
   /* new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production', // Disable during development
      pngquant: {
        quality: '95-100'
      }
    }),
    */
    new RobotstxtPlugin({
      policy: [
        {
          userAgent: "*",
          allow: "/",
        },
      ],
      //sitemap: "http://example.com/sitemap.xml",
    }),
    
    //https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: 'index.html',
      favicon: "favicon.ico",
      //template: 'index.forOffline.html'
    }),

    new WebpackPwaManifest({
      name: 'Legal LinQ',
      short_name: 'LLQ',
      ios: true,
      description: 'Legal LinQ advisor app',
      theme_color: "#000000",
      background_color: '#ffffff',
      icons: [
          {
          src:  root('./assets/img/llq_logo_large_icons.png'),
          sizes: [96, 128, 192, 256, 384, 512] // multiple sizes 
          },
          {
          src:  root('./assets/img/llq_logo_large_icons.png'),
          size: '1024x1024' // you can also use the specifications pattern 
          }
        ]
    }),
    
    new SWPrecacheWebpackPlugin(
      {
        cacheId: ExportEntryDir+ '-Main',
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true,
        navigateFallback: PUBLIC_PATH + 'index.html',
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      }
    ),

    // GZIP the files
    new CompressionWebpackPlugin({
      test: /\.js/,
      threshold: 10240,
      minRatio: 0.8
    }),
  ]
}