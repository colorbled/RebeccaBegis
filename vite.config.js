import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// ----- Create .nojekyll so GH Pages serves everything
function noJekyllPlugin() {
    return {
        name: 'no-jekyll',
        closeBundle() {
            const nojekyllPath = path.resolve('dist', '.nojekyll');
            fs.writeFileSync(nojekyllPath, '');
            console.log('✅ .nojekyll file created');
        }
    };
}

export default defineConfig(({ mode }) => {
    // Load env (so VITE_BASE_PATH works from .env.*)
    const env = loadEnv(mode, process.cwd(), '');
    // Default to "/" (custom domain). Override with VITE_BASE_PATH for project pages if needed.
    let base = env.VITE_BASE_PATH || '/';
    if (!base.endsWith('/')) base += '/';

    return {
        base,
        plugins: [
            react(),
            tailwindcss(),
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: [
                    'icons/icon-192.png',
                    'icons/icon-512.png',
                    'icons/maskable-512.png',
                    'favicon.png',
                    'apple-touch-icon.png'
                ],
                manifest: {
                    name: 'Rebecca Begis',
                    short_name: 'Rebecca',
                    description: 'The official portfolio and shop of artist Rebecca Begis.',
                    theme_color: '#0b0b0c',
                    background_color: '#0b0b0c',
                    display: 'standalone',
                    start_url: base,
                    scope: base,
                    icons: [
                        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                        { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' }
                    ]
                },
                workbox: {
                    // Keep relative so it matches the precache entry
                    navigateFallback: 'index.html',
                    navigateFallbackDenylist: [/^assets\//],

                    // ✅ Runtime caching for images that are served from YOUR app (same-origin).
                    // This covers images in /public and any built assets requested at runtime.
                    runtimeCaching: [
                        {
                            urlPattern: ({ sameOrigin, request }) =>
                                sameOrigin && request.destination === 'image',
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'images-same-origin',
                                expiration: {
                                    maxEntries: 300,
                                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                                },
                                cacheableResponse: { statuses: [200] }
                            }
                        }
                    ]
                },
                // Dev SW only in development
                devOptions: { enabled: mode === 'development' }
            }),
            noJekyllPlugin(),
        ],
        build: {
            outDir: 'dist',
            emptyOutDir: true,
        },
    };
});
