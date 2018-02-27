const merge = require('webpack-merge');
const common = require('./webpack.common.js')
const webpack = require('webpack');
module.exports = merge(common,{
	devtool:'inline-source-map',
	devServer:{
		contentBase:'./dist',
		port: 3030,
		proxy: {
			// 配置代理服务器，解决前后端分离开发跨域问题
			'/api': {
				target: 'https://nx.smsc.net.cn/shop/be/wxweblogin.php',
				changOrigin: true,
				pathRewrite: {
					'^/api': '/'
				}
			}
		},
	},
	plugins:[
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('dev')
		})
	],
});