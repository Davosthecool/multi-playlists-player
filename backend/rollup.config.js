import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/backend.ts',
  output: {
    file: 'dist/backend.js',
    format: 'iife',  // Format pour usage direct dans un navigateur
    name: 'ServiceWorker',  // Nom global
  },
  plugins: [typescript()],
};