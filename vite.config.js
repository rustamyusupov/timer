export default {
  build: {
    assetsDir: '',
    rollupOptions: {
      output: {
        assetFileNames: '[name].[hash].[ext]',
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    port: 3000,
    proxy: {
      '/strava': {
        target: 'https://www.strava.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/strava/, ''),
      },
    },
  },
};
