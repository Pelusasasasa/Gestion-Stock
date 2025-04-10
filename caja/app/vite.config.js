import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig({
  base: './', //Se utiliza para el archivo dist
  plugins: [
    tailwindcss(),
  ],
  define: {
    'import.meta.env.VITE_API_GESTIONURL': JSON.stringify(process.env.GESTIONURL),
  },
})
