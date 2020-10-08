const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

const mode = process.env.NODE_ENV || 'development';
const isProd = mode === 'production';
const isDev = !isProd;

const filename = ext => isDev
	? `bundle.${ext}`
	: `bundle.[hash].${ext}`;

const jsLoader = () => {
	const loaders = [
		{
			loader: 'babel-loader',
			options: {
				presets: ['@babel/preset-env', '@babel/preset-react'],
				plugins: ['@babel/plugin-proposal-class-properties'],
			},
		},
	];

	if (isDev) {
		loaders.push('eslint-loader');
	}

	return loaders;
};

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: mode,
	devtool: isDev ? 'source-map' : false,
	devServer: {
		port: '3000',
		hot: isDev,
		open: true,
	},
	resolve: {
		extensions: ['.jsx', '.js', '*'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@style': path.resolve(__dirname, 'src/style'),
			'@media': path.resolve(__dirname, 'src/media'),
			'@components': path.resolve(__dirname, 'src/components'),
		},
	},
	entry: './index.jsx',
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: jsLoader(),
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: isDev,
							reloadAll: true,
						},
					},
					{
						loader: 'css-loader',
						options: {importLoaders: 1},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									'autoprefixer',
								],
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.html$/,
				use: {
					loader: 'html-loader',
				},
			},
			{
				test: [/\.jpe?g$/, /\.png$/, /\.svg$/],
				use: {
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]',
					},
				},
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HTMLWebpackPlugin({
			template: 'index.html',
			minify: {
				removeComments: isProd,
				collapseWhitespace: isProd,
			},
		}),
		new MiniCssExtractPlugin({
			filename: filename('css'),
		}),
	],
};
