# AppRecife — Backend

API REST que **persiste o relacionamento entre a localização do usuário e os
medicamentos** consultados no [Portal de Dados Abertos da Cidade do
Recife](https://dados.recife.pe.gov.br/).

Faz parte do projeto **AppRecife**, composto por dois repositórios:

| Repositório | Descrição |
|-------------|-----------|
| [AppRecife-frontend](https://github.com/israelsz7/AppRecife-frontend) | Aplicativo mobile em React Native (Expo) |
| **AppRecife-backend** (este) | API em Node.js + Express |

---

## ✨ O que esta API faz

Quando o usuário encontra um medicamento em uma farmácia da rede municipal
(dados vindos da API do Recife), o aplicativo envia para esta API a
**localização atual do celular** junto com os **dados do medicamento**. A API
guarda esse "registro" e permite consultá-lo depois.

Cada **registro** relaciona:

- 📍 **Localização do usuário** — `latitude`, `longitude`, `precisao` (GPS)
- 💊 **Medicamento consultado** — `unidade` de saúde, `produto`, `classe`,
  `apresentacao`, `quantidade` em estoque, `distrito`

---

## 🧰 Tecnologias

- **Node.js** (>= 18) com módulos ES (`import`/`export`)
- **Express** — servidor HTTP e rotas
- **CORS** — libera o acesso a partir do app
- Persistência em **arquivo JSON** (`data/registros.json`) — sem banco de dados
  externo, para rodar em qualquer máquina apenas com o Node instalado.

---

## 📂 Estrutura do projeto

```
AppRecife-backend/
├── data/                     # registros.json é gerado aqui em tempo de execução
├── src/
│   ├── config/
│   │   └── env.js            # leitura de variáveis de ambiente (porta)
│   ├── controllers/
│   │   └── registrosController.js  # lógica de cada rota
│   ├── database/
│   │   └── db.js             # leitura/escrita no arquivo JSON
│   ├── models/
│   │   └── registro.js       # validação e formato de um registro
│   ├── routes/
│   │   └── registrosRoutes.js # mapeamento dos endpoints
│   ├── app.js                # configuração do Express (middlewares + rotas)
│   └── server.js             # ponto de entrada (sobe o servidor)
├── .env.example
└── package.json
```

---

## ▶️ Como rodar localmente

Pré-requisito: **Node.js 18 ou superior** instalado.

```bash
# 1. Instale as dependências
npm install

# 2. (opcional) Configure a porta
cp .env.example .env      # no Windows: copy .env.example .env

# 3. Suba o servidor
npm start                 # ou: npm run dev  (reinicia ao salvar)
```

O servidor sobe em **http://localhost:3000**.

> 💡 Para que o **celular** alcance o backend durante a demonstração, o app usa
> o IP da máquina na rede local automaticamente (via Expo). Garanta que o PC e o
> celular estejam na **mesma rede Wi‑Fi**.

---

## 🌐 Endpoints

Base: `http://localhost:3000`

| Método | Rota                 | Descrição                                   |
|--------|----------------------|---------------------------------------------|
| GET    | `/`                  | Informações da API                          |
| GET    | `/api/health`        | Verifica se a API está no ar                |
| GET    | `/api/registros`     | **Lista** todos os registros salvos         |
| GET    | `/api/registros/:id` | Detalha um registro                         |
| POST   | `/api/registros`     | **Cria** um registro (localização + medicamento) |
| DELETE | `/api/registros/:id` | Remove um registro                          |

### Exemplo — `POST /api/registros`

Corpo da requisição (JSON):

```json
{
  "localizacao": {
    "latitude": -8.0476,
    "longitude": -34.877,
    "precisao": 12.5
  },
  "medicamento": {
    "distrito": 1,
    "unidade": "Us 101 Policlinica Prof Waldemar de Oliveira",
    "produto": "DIPIRONA 500MG",
    "classe": "ANALGÉSICO/ ANTIPIRÉTICO",
    "apresentacao": "COMPR",
    "quantidade": 2370,
    "codigoProduto": 10110
  }
}
```

Resposta `201 Created`:

```json
{
  "id": "f7b3...-uuid",
  "criadoEm": "2026-06-17T18:30:00.000Z",
  "localizacao": { "latitude": -8.0476, "longitude": -34.877, "precisao": 12.5 },
  "medicamento": { "distrito": 1, "unidade": "Us 101 ...", "produto": "DIPIRONA 500MG", "...": "..." }
}
```

### Exemplo — testar com `curl`

```bash
# Listar
curl http://localhost:3000/api/registros

# Criar
curl -X POST http://localhost:3000/api/registros \
  -H "Content-Type: application/json" \
  -d '{"localizacao":{"latitude":-8.05,"longitude":-34.88},"medicamento":{"unidade":"Policlinica X","produto":"DIPIRONA 500MG","quantidade":100}}'
```

---

## 🔎 Fonte dos dados (API do Recife)

Conjunto de dados:
[Estoque dos medicamentos nas farmácias da rede municipal de saúde](https://dados.recife.pe.gov.br/dataset/estoque-dos-medicamentos-nas-farmacias-da-rede-municipal-de-saude).
A consulta a esse conjunto é feita **pelo aplicativo** (frontend) via API
CKAN `datastore_search`; o backend apenas guarda o que o usuário decide salvar.

---

## 📄 Licença

[MIT](LICENSE).
