const package = require("./package.json")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const EnvironmentVariablesPlugin = require("./webpack/plugins/environment-variables-plugin")

module.exports = (env, argv) => {
  let smp
  if (argv.mode === "production") {
    smp = {
      wrap: data => data,
    }
  } else {
    const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
    smp = new SpeedMeasurePlugin()
  }
  return smp.wrap({
    cache: {
      type: "memory",
    },
    output: {
      filename: "bundle.[contenthash].js",
      path: path.resolve(__dirname, "dist/"),
    },
    entry: [path.join(__dirname, "src", "index.tsx")],
    target: "web",
    devServer: {
      compress: true,
      port: 8000,
      proxy: {},
    },
    plugins: [
      EnvironmentVariablesPlugin(env),
      new CleanWebpackPlugin({
        // We don't want to remove the "index.html" file
        // after the incremental build triggered by watch.
        cleanStaleWebpackAssets: false,
      }),
      new CopyPlugin({
        patterns: [
          {
            noErrorOnMissing: true,
            from: path.resolve(__dirname, "public"),
            filter: async path => {
              return !path.endsWith("index.html")
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: "public/index.html",
        filename: "index.html",
        version: package.version,
        title: "VeeOne Spectacle",
      }),
    ],
    optimization: {
      // minimize: true,
      // runtimeChunk: "single",
      // splitChunks: {
      //   cacheGroups: {
      //     vendor: {
      //       test: /[\\/]node_modules[\\/]/,
      //       name: "libs",
      //       chunks: "all",
      //     },
      //   },
      // },
      // Prevent "libs.[contenthash].js" from changing its hash if not needed.
      moduleIds: "deterministic",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(png|svg|jpe?g|gif|webp)$/,
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "img/[name].[contenthash].[ext]",
          },
        },
        {
          test: /\.(otf|ttf)$/,
          use: "url-loader",
        },
        {
          test: /\.(frag|vert)$/,
          loader: "raw-loader",
        },
        {
          test: /\.ya?ml$/,
          type: "json",
          use: "yaml-loader",
        },
        {
          test: /\.(scss|css)$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx", ".wasm"],
      enforceExtension: false,
      alias: {},
    },
  })
}
