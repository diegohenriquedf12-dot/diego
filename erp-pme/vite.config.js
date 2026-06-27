import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base relativa ('./') no build: o site funciona em QUALQUER caminho do
// GitHub Pages (ex.: /diego/ ou /gestao-siqueira/). Assim, ao renomear o
// repositório, a URL muda sozinha sem precisar reconstruir com outro base.
// Em desenvolvimento mantém a raiz (http://localhost:5173/).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [react()],
}));
