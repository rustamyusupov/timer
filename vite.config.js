import { VitePWA } from 'vite-plugin-pwa';

export default {
  base: '/interval-timer',
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    VitePWA({
      manifest: {
        name: 'Interval Timer',
        short_name: 'Interval Timer',
        description: 'A simple interval timer',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
      },
      registerType: 'autoUpdate',
    }),
  ],
  server: {
    port: 3000,
  },
};
