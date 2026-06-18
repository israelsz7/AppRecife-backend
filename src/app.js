/**
 * Configuracao do aplicativo Express.
 *
 * Aqui montamos os middlewares (CORS, parser de JSON), registramos as rotas
 * e definimos o tratamento de erros. O arquivo `server.js` apenas importa
 * este app e o coloca para escutar numa porta.
 */

import express from 'express';
import cors from 'cors';
import registrosRoutes from './routes/registrosRoutes.js';

const app = express();

// CORS liberado: o app React Native (em outro host/porta) precisa acessar a API.
app.use(cors());

// Faz o parse automatico de corpos JSON nas requisicoes.
app.use(express.json());

// Rota raiz: pequena pagina de "boas-vindas" descrevendo a API.
app.get('/', (req, res) => {
  res.json({
    nome: 'AppRecife API',
    descricao:
      'Persiste o relacionamento entre a localizacao do usuario e os medicamentos consultados no Portal de Dados Abertos do Recife.',
    rotas: {
      'GET /api/health': 'Verifica se a API esta no ar',
      'GET /api/registros': 'Lista os registros salvos',
      'GET /api/registros/:id': 'Detalha um registro',
      'POST /api/registros': 'Cria um registro (localizacao + medicamento)',
      'DELETE /api/registros/:id': 'Remove um registro',
    },
  });
});

// Health check simples (usado pelo app para testar a conexao com o backend).
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', horario: new Date().toISOString() });
});

// Rotas de negocio.
app.use('/api/registros', registrosRoutes);

// 404 para qualquer rota nao mapeada.
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota nao encontrada.' });
});

// Tratamento centralizado de erros inesperados.
// eslint-disable-next-line no-unused-vars
app.use((erro, req, res, next) => {
  console.error('Erro inesperado:', erro);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

export default app;
