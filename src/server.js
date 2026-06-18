/**
 * Ponto de entrada do servidor.
 *
 * Sobe o aplicativo Express (definido em app.js) na porta configurada.
 */

import app from './app.js';
import { PORT } from './config/env.js';

app.listen(PORT, () => {
  console.log('==========================================');
  console.log('  AppRecife API rodando!');
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Health:  http://localhost:${PORT}/api/health`);
  console.log('==========================================');
});
