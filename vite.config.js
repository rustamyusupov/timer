export default {
  base: '/timer',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    port: 3000,
  },
};
