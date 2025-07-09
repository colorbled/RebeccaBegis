import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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
    base: "/RebeccaBegis/",
    plugins: [
      react(),
      noJekyllPlugin(),
      tailwindcss(),
    ],
})