import { defineConfig } from 'vite';
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

/**
 * Base path:
 * - Dev: "/"
 * - GH Pages: "/<repo>/"  (set with VITE_BASE_PATH in .env.production)
 *   e.g. VITE_BASE_PATH=/rebecca-begis-site/
 */
const BASE = process.env.VITE_BASE_PATH || '/RebeccaBegis/'; // ← replace <repo> or set env

export default defineConfig(({ mode }) => {
    const isProd = mode === 'production';
    const base = isProd ? BASE : '/';

    return {
        base,
        plugins: [
            react(),
            tailwindcss(),
// vite.config.js (only the VitePWA part shown)
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
                    start_url: `${base}`,   // keep base here
                    scope: `${base}`,       // keep base here
                    icons: [
                        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                        { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' }
                    ]
                },
                workbox: {
                    // ❗ Use relative path so it matches the precache entry
                    navigateFallback: 'index.html',
                    // optional: avoid picking SPA assets as navigations
                    navigateFallbackDenylist: [/^\/assets\//],
                },
                devOptions: { enabled: true }
            }),
            noJekyllPlugin()
        ],
        build: {
            outDir: 'dist',
            emptyOutDir: true
        }
    };
});
