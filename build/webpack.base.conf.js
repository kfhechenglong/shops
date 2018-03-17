var path = require('path')
var config = require('../config')
var utils = require('./utils')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
var extractTextPlugin = require('extract-text-webpack-plugin');
var projectRoot = path.resolve(__dirname, '../');

// 读取ejs文件目录
const traversdir = require('traversdir');

const test_path = path.join(__dirname, '../src/html-ejs');
const dir_object = traversdir(test_path);
const folder_list = dir_object._dirs;
// 读取js文件目录
const js_path = path.join(__dirname, '../src/js');
const js_dir_object = traversdir(js_path);
const js_list = js_dir_object._dirs;


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

const exportsObj = {
  entry: {
  },
  plugins: [
    extractCss,
    /* new HtmlWebpackPlugin({
      title: 'index',
      filename: 'index.html',
      template: './src/html/index.html',
      excludeChunks: ['login'],
      favicon: 'com.ico'
    }), */
    new HtmlWebpackPlugin({
      title: 'login',
      filename: 'login.html',
      template: './src/html/login.html',
      chunks: ['manifest', 'vendor','login'],
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
  module: {
    loaders: [
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
      { test: /\.ejs$/, loader: 'ejs-loader' },
      { test: /\.html$/, loader: 'html-loader' },
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
};
const name_js = 'common';
js_list.forEach(function (item, index) {
  if (name_js == item) {
    js_list.splice(index, 1);
    generateJs(js_list);
  }
});
function generateJs(pageArr) {
  const obj = {};
  pageArr.forEach((page) => {
    obj[page] = './src/js/' + page + '/' + page + '.js'
    
  });
  console.log(obj);
  exportsObj.entry = Object.assign(exportsObj.entry, obj);
}
// 生成html
var str = 'commonhtml';
folder_list.forEach(function (item, index, array) {
  if (str == item) {
    folder_list.splice(index, 1);
    generatehtml(folder_list);
  }
});
function generatehtml(pageArr) {
  pageArr.forEach((page) => {
    const obj = {
      title: 'modul',
      filename: page+ '.html',
      template: './src/html-ejs/' + page + '/' + page + '.js',
      chunks: ['manifest','vendor'],
      favicon: 'com.ico'
    };
    obj.chunks.push(page);
    const htmlPlugin = new HtmlWebpackPlugin(obj);
    exportsObj.plugins.push(htmlPlugin);
  });
}

module.exports = exportsObj;
