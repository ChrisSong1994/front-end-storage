const path = require('path');
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin');// html 模版插件
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');// 拆分css样式的插件
const CleanWebpackPlugin = require('clean-webpack-plugin');// 清理模块

const argv = require('yargs-parser')(process.argv.slice(2));  //  yargs-parser 模块用来获取命令行参数
const pro = argv.mode == 'production' ? true : false;  //  区别是生产环境和开发环境

let plu = [];
if (pro) {
    //  线上环境
    plu.push(
        new HtmlWebpackPlugin({
            template: './src/index.html',
            hash: true, // 会在打包好的bundle.js后面加上hash串
            chunks: ['vendor', 'index']  //  引入需要的chunk
        }),
        // 拆分后会把css文件放到dist目录下的css/style.css
        new ExtractTextWebpackPlugin('css/[name].[chunkhash].css'),
        new CleanWebpackPlugin('dist'),
    )
} else {
    //  开发环境
    plu.push(
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['vendor', 'index']  //  引入需要的chunk
        }),
        // 拆分后会把css文件放到dist目录下的css/style.css
        new ExtractTextWebpackPlugin('css/[name].[chunkhash].css'),
        new webpack.HotModuleReplacementPlugin(),  // 热更新，热更新不是刷新
    )
}

module.exports = {
    entry: {
        index: './src/index.js',    // 入口文件
    },
    output: {
        filename: pro ? '[name].[chunkhash].js' : '[name].js', // 打包后的文件名称
        path: path.resolve('dist'), // 打包后的目录，必须是绝对路径
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader', 'less-loader'] // 从右向左解析
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader']
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                            outputPath: 'images/', // 图片打包后存放的目录
                        },
                    },
                ],
            },
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader', // 打包页面img引用图片
            },
            {
                test: /\.(eot|ttf|woff|svg)$/,  //字体图标和svg图片都可以通过file-loader来解析
                use: 'file-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: /src/,          // 只转化src目录下的js
                exclude: /node_modules/  // 排除掉node_modules，优化打包速度
            }
        ]
    },
    plugins: plu,
    resolve: {
        // 别名
        alias: {
            assets: path.join(__dirname, 'src/assets'),
            api: path.join(__dirname, 'src/api'),
        },
        // 省略后缀
        extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.less']
    },
    devServer: {
        port: 7000,             // 端口
        open: true,             // 自动打开浏览器
        hot: true,               // 开启热更新
        overlay: true, // 浏览器页面上显示错误
        historyApiFallback: true,
        proxy: { //通过代理解决本地跨域
            '/api': {
                target: 'http://localhost:4000', // 服务端
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            },
            '/files': {    // 静态文件图片等
                target: 'http://localhost:4000', // 服务端
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/files': '/files'
                }
            }
        }
    },
    //  提取公共代码
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: { // 抽离第三方插件
                    test: /node_modules/, // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor', // 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10,
                }
            }
        }
    },
    //srouce里面能看到我们写的代码，也能打断点调试代码
    devtool: pro ? '' : 'inline-source-map'
}
