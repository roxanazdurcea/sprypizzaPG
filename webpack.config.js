var path = require('path');
var webpack = require('webpack');
var CommonChunkPlugin = require('./node_modules/webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
    entry: {
        'commons': './src/js/commons.js',
        'login': './src/js/login.js',
        'menu': './src/js/menu.js',
        'checkout': './src/js/checkout.js',
        'orders': './src/js/orders.js',
        'account': './src/js/checkout.js',
        'register': './src/js/orders.js',
        'app': './src/js/app.js',
        'vendor': ['vue', 'vuex', 'underscore', 'framework7-vue', 'framework7']
    },
    output: {
        path: path.join(__dirname, './www/js/'),
        publicPath: './www/js/',
        filename: '[name].min.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {}
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {loader: 'css-loader', options: {importLoaders: 1}},
                    'less-loader'
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    plugins: [
        new CommonChunkPlugin({name: 'vendor', filename: 'vendor.min.js'})
    ]
}

if (process.env.NODE_ENV === 'production') {
    //module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
