/**
 * Controller dos registros.
 *
 * Concentra a logica de cada rota: ler o pedido, conversar com a camada de
 * banco (db.js) e devolver a resposta HTTP adequada.
 */

import * as db from '../database/db.js';
import { criarRegistro, ErroDeValidacao } from '../models/registro.js';

/**
 * GET /api/registros
 * Lista todos os registros salvos, do mais recente para o mais antigo.
 */
export async function listar(req, res, next) {
  try {
    const registros = await db.lerTodos();
    registros.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
    res.json({
      total: registros.length,
      registros,
    });
  } catch (erro) {
    next(erro);
  }
}

/**
 * GET /api/registros/:id
 * Retorna um unico registro.
 */
export async function buscarPorId(req, res, next) {
  try {
    const registro = await db.buscarPorId(req.params.id);
    if (!registro) {
      return res.status(404).json({ erro: 'Registro nao encontrado.' });
    }
    res.json(registro);
  } catch (erro) {
    next(erro);
  }
}

/**
 * POST /api/registros
 * Cria um novo registro relacionando localizacao do usuario + medicamento.
 */
export async function criar(req, res, next) {
  try {
    // `criarRegistro` valida o corpo e lanca ErroDeValidacao se algo faltar.
    const registro = criarRegistro(req.body);
    const salvo = await db.inserir(registro);
    res.status(201).json(salvo);
  } catch (erro) {
    if (erro instanceof ErroDeValidacao) {
      return res.status(erro.status).json({ erro: erro.message });
    }
    next(erro);
  }
}

/**
 * DELETE /api/registros/:id
 * Remove um registro (util para limpar dados durante a apresentacao).
 */
export async function remover(req, res, next) {
  try {
    const removeu = await db.remover(req.params.id);
    if (!removeu) {
      return res.status(404).json({ erro: 'Registro nao encontrado.' });
    }
    res.status(204).send(); // 204 = sucesso, sem corpo
  } catch (erro) {
    next(erro);
  }
}
