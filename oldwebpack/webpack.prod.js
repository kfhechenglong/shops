const merge = require('webpack-merge');
const common = require('./webpack.common.js');
// 删除export文件中未被引用的 模块
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// bulid 之前先删除旧的打包文件
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common,{
	devtool:'source-map',
	plugins:[
		new UglifyJSPlugin({
			sourceMap:true
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV':JSON.stringify('production')
		}),
		new CleanWebpackPlugin(['dist']),
	]
});