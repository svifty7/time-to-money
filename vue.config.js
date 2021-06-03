module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/time-to-money/'
        : '/',
    outputDir: 'public_html',
    filenameHashing: true,
    runtimeCompiler: true,
    productionSourceMap: false
}
