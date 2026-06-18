/**
 * Configuracoes globais da aplicacao.
 *
 * Centralizamos aqui a leitura de variaveis de ambiente para que o resto
 * do codigo nao precise acessar `process.env` diretamente. Isso facilita
 * a manutencao e deixa explicito quais configuracoes a API utiliza.
 */

// Porta do servidor. Usa a variavel de ambiente PORT (ex.: ambientes de
// hospedagem) ou cai para 3000 durante o desenvolvimento local.
export const PORT = Number(process.env.PORT) || 3000;
