import { readFileSync } from "node:fs";
import { resolve as pathResolve } from "node:path";
import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";

const resolve = pathResolve.bind(undefined, import.meta.dirname);

const targets = readFileSync(resolve(".browserslistrc"), "utf8").split(/\r?\n|\r(?!\n)/g).filter(line => line.trim() !== "");
const SwcConfig = JSON.parse(readFileSync(resolve(".swcrc"), "utf8"));

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
							...SwcConfig,
							env: {
								...SwcConfig.env,
								targets
							}
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
