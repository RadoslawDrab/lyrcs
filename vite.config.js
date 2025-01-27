import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tsconfigPaths from 'vite-tsconfig-paths'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tsconfigPaths({ loose: true }),
        vue(),
        vueDevTools(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'inline',
            devOptions: {
                enabled: process.env.NODE_ENV !== 'production'
            },
            manifest: {
                name: 'Lyrcs',
                short_name: 'Lyrcs',
                description: 'Simple app for creating LRC files for a given audio file',
                icons: [
                    {
                        src: "/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any"
                    },
                    {
                        src: "/pwa-maskable-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/pwa-maskable-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable"
                    }
                ],
                start_url: "/",
                display: "standalone",
                background_color: "#f4f4f5",
                theme_color: "#f4f4f5"
            }
        })
    ],
    resolve: {}
})
