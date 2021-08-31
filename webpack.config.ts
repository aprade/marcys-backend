import path from 'path';
import webpack from "webpack";
import nodemonPlugon from "nodemon-webpack-plugin";

interface Argv {
	mode?: 'production' | 'development';
}

const proxy = (_env: unknown, argv: Argv): webpack.Configuration => {
	const mode = argv.mode || 'development';

	return {
		entry: './src/index.ts',
		devtool: 'source-map',
		mode,
		cache: {
			type: 'filesystem',
		},
		performance: {
			hints: false,
		},
		target: 'node',
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: {
						loader: 'ts-loader',
						options: {
							compilerOptions: {
								noEmit: false,
								module: 'es6',
							},
						},
					},
				},
			],
		},
		plugins: [
			new nodemonPlugon(),
		],
		resolve: {
			extensions: [ '.tsx', '.ts', '.js' ],
		},
		output: {
			filename: 'main.comp.js',
			path: path.resolve(__dirname, 'dist/'),
		},
		watch: mode === 'development'
	};
}

export default [ proxy ];