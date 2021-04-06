module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    lintOnSave: false,
    runtimeCompiler: false,
    productionSourceMap: true,
	configureWebpack:{
		plugins:[],
		externals:{
			'vue': 'Vue',
			'axios':'axios',
			'vue-router':'VueRouter',
			'element-ui':'ELEMENT'
		}
	},
    devServer: {
        host: '0.0.0.0',
        port: '8080',
        proxy: {
            '/design': {
                target: 'https://rigel.dev.langmeta.com',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/design': '/design'
                }
            }
        }
    }
};