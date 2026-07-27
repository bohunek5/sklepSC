import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/sklepSC/' : '/',
  server: {
    port: 3002
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        shop: resolve(__dirname, 'shop.html'),
        configurator: resolve(__dirname, 'configurator.html'),
        ledConfigurator: resolve(__dirname, 'konfigurator-led.html'),
        product: resolve(__dirname, 'product.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        cart: resolve(__dirname, 'cart.html'),
        blog: resolve(__dirname, 'blog.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        admin: resolve(__dirname, 'admin.html'),
        aishopping: resolve(__dirname, 'ai-shopping.html'),
      }
    }
  }
});
