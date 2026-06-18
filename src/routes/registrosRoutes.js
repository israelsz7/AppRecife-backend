/**
 * Definicao das rotas de "registros".
 *
 * Mantemos as rotas separadas do controller para deixar claro, num so lugar,
 * quais endpoints a API expoe.
 *
 *   GET    /api/registros      -> lista todos os registros
 *   GET    /api/registros/:id  -> detalha um registro
 *   POST   /api/registros      -> cria um registro (localizacao + medicamento)
 *   DELETE /api/registros/:id  -> remove um registro
 */

import { Router } from 'express';
import * as controller from '../controllers/registrosController.js';

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.delete('/:id', controller.remover);

export default router;
