const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var extractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack')

function assetsPath(_path) {
	return path.posix.join('static', _path)
}
function assetsPathFont(_path) {
	return path.posix.join('assets/css/fonts', _path)
}
//将css提取出来保存为单独的文件
var extractCss = new extractTextPlugin('assets/css/[name].css');
module.exports = {
	entry: {
		index: './src/main.js',
		login: './src/login.js',
	},
	output: {
		filename: 'assets/js/[name].[chunkhash].js',
		chunkFilename:'assets/js/chunks/[name].js',
		path: path.resolve(__dirname, 'dist'),
		// publicPath:'/'
	},
	plugins: [
		extractCss,
		new HtmlWebpackPlugin({
			title: 'Production',
			filename: 'index.html',
			template: './src/index.html',
			// minify: {
			// 	removeComments: true,
			// 	collapseWhitespace: true,
			// 	removeAttributeQuotes: true
			// },
			excludeChunks: ['login'],
		}),
		new HtmlWebpackPlugin({
			title: 'login',
			filename: 'login.html',
			template: './src/login.html',
			// minify: {
			// 	removeComments: true,
			// 	collapseWhitespace: true,
			// 	removeAttributeQuotes: true
			// },
			excludeChunks: ['index'],
		}),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name:'vendor'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name:'manifest'
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"windows.jQuery": "jquery"
		})
	],
	module: {
		rules: [
			{
				test: /\.less$/,
				use: extractCss.extract(['css-loader', 'less-loader'])
			},
			{
				test: /\.css$/,
				use: extractCss.extract(['css-loader'])
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				loader: 'file-loader',
				options: {
					limit: 1000,
					name: assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				loader: 'file-loader',
				options: {
					limit: 10000,
					name: assetsPathFont('[name].[hash:7].[ext]')
				}
			}
		]
	}

};