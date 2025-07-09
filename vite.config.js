import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite'

function noJekyllPlugin() {
    return {
        name: 'nojekyll',
        closeBundle: () => {
            fs.writeFileSync(resolve(__dirname, 'dist/.nojekyll'), '');
        }
    };
}

export default defineConfig({
    base: "/",
    plugins: [
      react(),
      noJekyllPlugin(),
      tailwindcss(),
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    closeBundle() {
        const filePath = path.resolve(__dirname, 'dist', '.nojekyll');
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '');
            console.log('✅ .nojekyll file created');
        }
    },
});