/**
 * Modelo / validacao de um "Registro".
 *
 * Um Registro representa o RELACIONAMENTO entre:
 *   - a LOCALIZACAO do usuario (latitude/longitude obtidas via GPS no app), e
 *   - um MEDICAMENTO consultado na API de Dados Abertos do Recife
 *     (unidade de saude, produto, quantidade em estoque, etc.).
 *
 * Esta funcao recebe o corpo bruto da requisicao, valida os campos
 * obrigatorios e devolve um objeto ja normalizado e pronto para ser salvo.
 */

import { randomUUID } from 'node:crypto';

/**
 * Erro de validacao com status HTTP associado (422 = entidade nao processavel).
 */
export class ErroDeValidacao extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroDeValidacao';
    this.status = 422;
  }
}

// Converte para numero e valida se esta dentro de um intervalo.
function numeroNoIntervalo(valor, min, max) {
  const n = Number(valor);
  if (Number.isNaN(n) || n < min || n > max) return null;
  return n;
}

/**
 * Cria um registro validado a partir do corpo da requisicao.
 * @param {object} corpo - req.body
 * @returns {object} registro normalizado
 * @throws {ErroDeValidacao} se algum campo obrigatorio for invalido
 */
export function criarRegistro(corpo = {}) {
  const localizacao = corpo.localizacao || {};
  const medicamento = corpo.medicamento || {};

  // --- Validacao da localizacao ---
  const latitude = numeroNoIntervalo(localizacao.latitude, -90, 90);
  const longitude = numeroNoIntervalo(localizacao.longitude, -180, 180);

  if (latitude === null) {
    throw new ErroDeValidacao('localizacao.latitude e obrigatoria e deve estar entre -90 e 90.');
  }
  if (longitude === null) {
    throw new ErroDeValidacao('localizacao.longitude e obrigatoria e deve estar entre -180 e 180.');
  }

  // --- Validacao dos dados do medicamento (vindos da API do Recife) ---
  if (!medicamento.produto || typeof medicamento.produto !== 'string') {
    throw new ErroDeValidacao('medicamento.produto e obrigatorio.');
  }
  if (!medicamento.unidade || typeof medicamento.unidade !== 'string') {
    throw new ErroDeValidacao('medicamento.unidade e obrigatoria.');
  }

  // --- Montagem do registro normalizado ---
  return {
    id: randomUUID(),
    criadoEm: new Date().toISOString(),
    localizacao: {
      latitude,
      longitude,
      // Precisao do GPS em metros (opcional).
      precisao: localizacao.precisao != null ? Number(localizacao.precisao) : null,
    },
    medicamento: {
      distrito: medicamento.distrito != null ? Number(medicamento.distrito) : null,
      unidade: String(medicamento.unidade),
      produto: String(medicamento.produto),
      classe: medicamento.classe ? String(medicamento.classe) : null,
      apresentacao: medicamento.apresentacao ? String(medicamento.apresentacao) : null,
      quantidade: medicamento.quantidade != null ? Number(medicamento.quantidade) : null,
      codigoProduto: medicamento.codigoProduto != null ? Number(medicamento.codigoProduto) : null,
    },
  };
}
