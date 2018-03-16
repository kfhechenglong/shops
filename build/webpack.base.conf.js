var path = require('path')
var config = require('../config')
var utils = require('./utils')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
var extractTextPlugin = require('extract-text-webpack-plugin');
var projectRoot = path.resolve(__dirname, '../')

var env = process.env.NODE_ENV
// check env & config/index.js to decide whether to enable CSS source maps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

var extractCss = new extractTextPlugin(utils.assetsPath('css/[name].css'));

function assetsPath(_path) {
  return path.posix.join(utils.assetsPath(''), _path)
}
function assetsPathFont(_path) {
  return path.posix.join(utils.assetsPath('css'), _path)
}
// const pageArr = ['index', 'employee', 'store', 'customer','order','login']
// pageArr.forEach((page) => {
//   const htmlPlugin = new HtmlWebpackPlugin({
//     filename: `./src/html/page.html`,
//     template: path.resolve(dirVars.pagesDir, `./${page}/html.js`),
//     chunks: [page, 'commons'],
//     hash: true, // 为静态资源生成hash值
//     minify: true,
//     xhtml: true,
//   });
//   configPlugins.push(htmlPlugin);
// });
module.exports = {
  entry: {
    index: './src/js/index.js',
    login: './src/js/login.js',
  },
  plugins: [
    extractCss,
    new HtmlWebpackPlugin({
      title: 'index',
      filename: 'index.html',
      template: './src/html/index.html',
      excludeChunks: ['login'],
      favicon:'com.ico'
    }),
    new HtmlWebpackPlugin({
      title: 'login',
      filename: 'login.html',
      template: './src/html/login.html',
      excludeChunks: ['index'],
      favicon: 'com.ico'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "windows.jQuery": "jquery"
    })
  ],
  // resolve: {
    // extensions: ['', '.js', '.vue', '.json'],
    // fallback: [path.join(__dirname, '../node_modules')],
    // alias: {
    //   'vue': 'vue/dist/vue.common.js',
    // }
  // },
  // resolveLoader: {
  //   fallback: [path.join(__dirname, '../node_modules')]
  // },
  module: {
    // preLoaders: [
    //   {
    //     test: /\.vue$/,
    //     loader: 'eslint',
    //     include: [
    //       path.join(projectRoot, 'src')
    //     ],
    //     exclude: /node_modules/
    //   },
    //   {
    //     test: /\.js$/,
    //     loader: 'eslint',
    //     include: [
    //       path.join(projectRoot, 'src')
    //     ],
    //     exclude: /node_modules/
    //   }
    // ],
    loaders: [
      // {
      //   test: /\.vue$/,
      //   loader: 'vue'
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.less$/,
        use: extractCss.extract(['css-loader', 'less-loader'])
      },
      {
        test: /\.css$/,
        use: extractCss.extract(['css-loader'])
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: assetsPathFont('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  // eslint: {
  //   formatter: require('eslint-friendly-formatter')
  // },
  // vue: {
  //   loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
  //   postcss: [
  //     require('autoprefixer')({
  //       browsers: ['last 2 versions']
  //     })
  //   ]
  // }
}
