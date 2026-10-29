# Cómo ejecutar las pruebas (Vitest + Coverage V8)

1. Instalar dependencias de pruebas (una sola vez):

   npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

2. Ejecutar:

   npm test                 # modo watch (se re-ejecuta al guardar)
   npm run test:run         # una sola vez
   npm run test:coverage    # genera el informe de cobertura

3. Informe: tabla en consola + carpeta coverage/ (abrir coverage/index.html en el navegador).
