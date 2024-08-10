import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";

const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

const config = defineConfig({
	entry: {
		main: "./src/main.js"
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset"
			},
			{
				test: /\.js$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "ecmascript"
								}
							},
							env: { targets }
						}
					}
				]
			}
		]
	},
	plugins: [
		new rspack.ProgressPlugin({}),
		new rspack.HtmlRspackPlugin({
			template: "./index.html"
		})
	],
	experiments: {
		css: true
	}
});

/**
 * @param {Env | undefined} env
 * @param {Record<string, any> & { env: Env }} argv
 * @returns {import("@rspack/core").RspackOptions}
 */
export default (env, argv) => {
	return config;
}

/**
 * @typedef Env
 * @property {boolean} [RSPACK_BUNDLE]
 * @property {boolean} [RSPACK_BUILD]
 * @property {boolean} [RSPACK_WATCH]
 */
