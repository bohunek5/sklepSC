import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/sklepSC/' : '/',
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        shop: resolve(__dirname, 'shop.html'),
        product: resolve(__dirname, 'product.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        cart: resolve(__dirname, 'cart.html'),
        blog: resolve(__dirname, 'blog.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        admin: resolve(__dirname, 'admin.html'),
      }
    }
  }
});
