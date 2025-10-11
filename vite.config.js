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
    // Ensure env vars from .env.* are loaded here
    const env = loadEnv(mode, process.cwd(), '');
    // Default to "/" (custom domain). Override with VITE_BASE_PATH for project pages.
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
                    start_url: base,   // matches deployed base
                    scope: base,       // matches deployed base
                    icons: [
                        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                        { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' }
                    ]
                },
                workbox: {
                    // MUST be relative so it matches the precache key
                    navigateFallback: 'index.html',
                    navigateFallbackDenylist: [/^assets\//],
                },
                // Only enable the dev SW in development
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
