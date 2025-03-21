export default {
  base: '/timer',
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
  },
};
