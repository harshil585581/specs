const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.output = {
        ...webpackConfig.output,
        module: true,
      };
      webpackConfig.experiments = {
        ...webpackConfig.experiments,
        outputModule: true,
      };

      // Find the HtmlWebpackPlugin and modify its options
      const htmlWebpackPlugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof HtmlWebpackPlugin
      );

      if (htmlWebpackPlugin) {
        htmlWebpackPlugin.options = {
          ...htmlWebpackPlugin.options,
          scriptLoading: 'module',
        };
      } else {
        // If HtmlWebpackPlugin is not found, add it with scriptLoading: 'module'
        webpackConfig.plugins.push(
          new HtmlWebpackPlugin({
            template: paths.appHtml,
            scriptLoading: 'module',
          })
        );
      }

      return webpackConfig;
    },
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  targets: {
                    esmodules: true,
                  },
                },
              ],
              '@babel/preset-react',
            ],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
          },
        },
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: require('path').join(__dirname, 'public'),
    },
  },
};