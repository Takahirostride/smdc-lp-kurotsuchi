const packageJson = require('./package.json');
const version = packageJson.version;
const DataJson = require('./src/json/data.json');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoPrefixer = require('autoprefixer');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

module.exports = (env, argv) => {

    const conf = {
        mode: 'development',
        devServer: {
            open: true,
            openPage: 'index.html',
            contentBase: path.join(__dirname, 'public'),
            watchContentBase: true,
            port: 8080,
            host: argv.mode === 'production' ? `localhost` : `localhost`,// 0.0.0.0
            disableHostCheck: true,
        },
        entry: {app: './src/index.js'},
        output: {
            path: path.join(__dirname, 'dist'),
            publicPath: '/',
            filename: argv.mode === 'production' ? `js/[name].js?[hash]` : `js/[name].js?[hash]`,  //`[name].min.js`
        },

        optimization: {
            minimizer: [new TerserPlugin({
                //extractComments: true,
                //cache: true,
                //parallel: true,
                //sourceMap: true,
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                }

            })],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    '@babel/env'
                                ]
                            }
                        }
                    ],
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: process.env.NODE_ENV === 'development',
                            },
                        },
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    AutoPrefixer(
                                        {
                                            grid: 'autoplace'
                                        },
                                    ),
                                ],
                            },
                        },
                        {
                            loader: 'sass-loader',
                        }
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'},
                    ]
                },
                {
                    test: /\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/i,
                    use: [
                        {loader: 'url-loader'},
                    ]
                },
                {
                    test: /\.ejs$/,
                    use: {
                        loader: 'ejs-compiled-loader',
                        options: {
                            htmlmin: false,
                            htmlminOptions: {
                                removeComments: true
                            }
                        }
                    }
                },
            ],
        },
        resolve: {
            alias: {}
        },
        plugins: [
            new webpack.BannerPlugin(`[name] v${version} Copyright (c) 2020 Takahiro Sawada`),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery'
            }),
            new MiniCssExtractPlugin({
                filename: argv.mode === 'production' ? `css/[name].css?[hash]` : `css/[name].css?[hash]`,  //`[name].min.js`
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './src/components/template.ejs',
                templateParameters:DataJson,
                hash: true,
                inject: true,
            }),
        ],

    };

    if (argv.mode !== 'production') {
        conf.devtool = 'inline-source-map';
    }

    return conf;

};
