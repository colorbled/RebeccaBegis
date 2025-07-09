import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';

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

export default defineConfig({
    base: "/",
    plugins: [
        react(),
        tailwindcss(),
        noJekyllPlugin(), // ← include the plugin here
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
});
