const path = require("path");

module.exports = {
    mode : "production",
    entry : { "mediaquery-events" : "./src/build.js" },
    output : {
        filename : "[name].min.js",
        path : path.resolve( __dirname, "build/" ),
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};
