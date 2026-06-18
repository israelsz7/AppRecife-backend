/**
 * Camada de persistencia simples baseada em arquivo JSON.
 *
 * Para um projeto academico optamos por NAO usar um banco de dados externo
 * (Postgres, Mongo, etc.) nem dependencias nativas (SQLite). Em vez disso,
 * gravamos os registros em `data/registros.json`. Vantagens:
 *   - Zero configuracao: roda em qualquer maquina apenas com Node instalado.
 *   - Facil de inspecionar: basta abrir o arquivo para ver os dados salvos.
 *
 * As escritas sao serializadas atraves de uma "fila" (filaDeEscrita) para
 * evitar que duas requisicoes simultaneas corrompam o arquivo.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Em modulos ESM nao existe `__dirname`, entao o reconstruimos a partir da URL.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pasta e arquivo onde os registros sao armazenados.
const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'registros.json');

// Promise usada para encadear (serializar) as operacoes de escrita.
let filaDeEscrita = Promise.resolve();

/**
 * Garante que a pasta e o arquivo de dados existam.
 */
async function garantirArquivo() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    // Arquivo ainda nao existe: cria com uma lista vazia.
    await fs.writeFile(DB_FILE, '[]', 'utf-8');
  }
}

/**
 * Le e retorna todos os registros salvos.
 * @returns {Promise<Array>} lista de registros
 */
export async function lerTodos() {
  await garantirArquivo();
  const conteudo = await fs.readFile(DB_FILE, 'utf-8');
  try {
    const dados = JSON.parse(conteudo);
    return Array.isArray(dados) ? dados : [];
  } catch {
    // Se o arquivo estiver corrompido, devolvemos lista vazia em vez de quebrar.
    return [];
  }
}

/**
 * Sobrescreve o arquivo com a lista informada, de forma serializada.
 * @param {Array} registros
 */
function escreverTodos(registros) {
  filaDeEscrita = filaDeEscrita.then(async () => {
    await garantirArquivo();
    await fs.writeFile(DB_FILE, JSON.stringify(registros, null, 2), 'utf-8');
  });
  return filaDeEscrita;
}

/**
 * Insere um novo registro e persiste no arquivo.
 * @param {object} registro
 * @returns {Promise<object>} o registro salvo
 */
export async function inserir(registro) {
  const registros = await lerTodos();
  registros.push(registro);
  await escreverTodos(registros);
  return registro;
}

/**
 * Busca um registro pelo id.
 * @param {string} id
 * @returns {Promise<object|undefined>}
 */
export async function buscarPorId(id) {
  const registros = await lerTodos();
  return registros.find((r) => r.id === id);
}

/**
 * Remove um registro pelo id.
 * @param {string} id
 * @returns {Promise<boolean>} true se removeu, false se nao encontrou
 */
export async function remover(id) {
  const registros = await lerTodos();
  const filtrados = registros.filter((r) => r.id !== id);
  if (filtrados.length === registros.length) {
    return false; // nada foi removido
  }
  await escreverTodos(filtrados);
  return true;
}
