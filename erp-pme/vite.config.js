import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Em produção (build para GitHub Pages) o site fica em /diego/.
// Em desenvolvimento mantém a raiz (http://localhost:5173/).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/diego/' : '/',
  plugins: [react()],
}));
