const merge = require('webpack-merge');
const common = require('./webpack.common.js')
const webpack = require('webpack');


module.exports = merge(common,{
	devtool:'inline-source-map',
	devServer:{
		contentBase:'./dist',
		// hot: true,
		port: 3030,
		proxy: {
			"/api": { 
				target: 'https://nx.smsc.net.cn/wxopen/app/shop/admin.php' ,
				pathRewrite: {
					'^/api': '/'
				},
				changeOrigin: true
			},
		},
	},
	plugins:[
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('dev')
		})
	],
});