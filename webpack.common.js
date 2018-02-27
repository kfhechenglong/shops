const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack')
module.exports = {
	entry: {
		app: './src/main.js',
		vendor:[
			'lodash'
		]
	},
	output: {
		filename: '[name].[chunkhash].js',
		// chunkFilename:'[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Production',
			filename: 'index.html',
			template: './src/index.html',
		}),
		new HtmlWebpackPlugin({
			title: 'login',
			filename: 'login.html',
			template: './src/login.html',
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
				test: /\.(less|css)$/,
				use: [
					{ loader: "style-loader" },
					{ loader: "css-loader" },
					{loader:"less-loader"}
				]
			},
			
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					'file-loader'
				]
			}
		]
	}

};