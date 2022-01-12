const path = require('path')
const webpack = require('webpack')
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const LoadablePlugin = require('@loadable/webpack-plugin')

const appName = require('./package.json').name.replace('/', '_')

module.exports = {
  options: {
    verbose: true,
    // enableTargetBabelrc: true,
    disableWebpackbar: true,
  },
  plugins: [
    {
      name: 'typescript',
      options: {
        useBabel: true,
      },
    },
  ],
  modifyWebpackConfig({
    env: {
      target, // 'node' | 'web'
      dev,
    },
    webpackConfig, // the created webpack config
    options: {
      _razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      _webpackOptions, // the modified options that will be used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    webpackConfig.plugins = [
      ...webpackConfig.plugins,
      target === 'web' &&
        new LoadablePlugin({
          outputAsset: false,
          writeToDisk: { filename: path.resolve(__dirname, 'build') },
        }),
      new webpack.NormalModuleReplacementPlugin(/(.*)-APP_TARGET(\.*)/, function (resource) {
        resource.request = resource.request.replace(/-APP_TARGET/, `-${target === 'web' ? 'client' : 'server'}`)
      }),
      !dev &&
        target === 'web' &&
        new StatoscopeWebpackPlugin({
          saveTo: path.resolve(paths.appBuild, `reports/statocscope-[name]-[hash].html`),
          saveStatsTo: path.resolve(paths.appBuild, `reports/stats-[name]-[hash].json`),
          watchMode: false,
          name: appName,
          compressor: 'gzip',
        }),
      !dev &&
        target === 'web' &&
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          analyzerPort: 8888,
          reportFilename: path.resolve(paths.appBuild, `reports/${appName}-${+new Date()}.html`),
          defaultSizes: 'gzip',
          generateStatsFile: false,
          statsFilename: 'stats.json',
          statsOptions: null,
          logLevel: 'info',
        }),
    ].filter(Boolean)

    return webpackConfig
  },
}
