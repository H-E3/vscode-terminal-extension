const path = require('path');

module.exports = {
    entry: './src/webview/webview.ts',
    output: {
        filename: 'webview.js',
        path: path.resolve(__dirname, 'out', 'webview')
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    mode: 'production',
    optimization: {
        minimize: true
    }
};
