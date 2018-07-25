const path = require('path');

module.exports = {
	mode: 'development',
	devtool: "inline-source-map",
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'build')
	},

	watch: true
};