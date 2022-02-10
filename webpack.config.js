module.exports = [
	{
		mode: "development",
		entry: ["./src/app/main.ts"],
		target: "electron-main",
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: [{ loader: "ts-loader" }],
				},
			],
		},
		output: {
			path: __dirname + "/build",
			filename: "main.js",
		},
	},
];
