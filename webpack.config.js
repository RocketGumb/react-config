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
	: `bundle.[hash:8].${ext}`;

const tsLoader = () => {
	const loaders = [
		{
			loader: 'awesome-typescript-loader',
		},
	];

	if (isDev) {
		loaders.push({loader: 'eslint-loader'});
	}

	return loaders;
};

const config = {
	mode: mode,
	devtool: isDev ? 'inline-source-map' : false,
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.jsx', '*'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@style': path.resolve(__dirname, 'src/style'),
			'@media': path.resolve(__dirname, 'src/media'),
			'@components': path.resolve(__dirname, 'src/components'),
		},
	},
	entry: './src/index',
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.ts?x$/,
				use: tsLoader(),
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
									autoprefixer,
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
				test: /\.(png|jpe?g|svg)$/,
				loader: 'file-loader',
				options: {
					name: 'media/[name].[hash:8].[ext]',
				},
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, 'src/index.html'),
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

module.exports = () => {
	if (isProd) {
		config.plugins.push(new CleanWebpackPlugin());
	}
	return config;
};
