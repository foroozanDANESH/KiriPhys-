const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: { index: './src/index.js' },
    output: {
        path: path.join(__dirname, '/dist/assets'),
        filename: '[name].bundle.js',
        publicPath: '/assets/'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.woff(\d+)?$/, use: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff' },
            { test: /\.ttf$/, use: 'file-loader?prefix=font/' },
            { test: /\.eot$/, use: 'file-loader?prefix=font/' },
            { test: /\.svg$/, use: 'file-loader?prefix=font/' },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=10000&minetype=application/font-woff' },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'file-loader' },
            {
                test: require.resolve('jquery'),
                use: [
                  { loader: 'expose-loader', options: { exposes: ['jQuery', '$'] } }
                ]
              }
                      ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            'jquery': 'jquery'
        })
    ]
};
