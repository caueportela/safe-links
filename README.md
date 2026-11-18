# SafeLink

**Sistema de análise de links suspeitos.** O SafeLink recebe uma URL, procura indicadores de risco (phishing, malware, golpes) na estrutura do endereço e em fontes externas de segurança, e devolve um **índice de risco de 0 a 100** explicando os motivos da classificação.

> ⚠️ O índice é **indicativo**: vem de regras de avaliação, não de uma probabilidade comprovada de fraude. Se nenhuma fonte tiver registro sobre uma URL, isso **não** garante que ela seja segura.

Projeto Integrador VI-B, curso de Análise e Desenvolvimento de Sistemas, Católica de Pelotas (2026).

---

## Funcionalidades

| Funcionalidade | Status |
|---|---|
| Validação da URL informada | 🔜 planejado |
| Análise estrutural (HTTPS, IP no lugar de domínio, caracteres incomuns, subdomínios, palavras-chave, encurtadores) | 🔜 planejado |
| Idade e dados de registro do domínio (RDAP) | 🔜 planejado |
| Consulta a bases de ameaças (URLhaus, Google Web Risk, VirusTotal) | 🔜 planejado |
| Reputação da empresa (Reclame Aqui, via RA Data Hub) | ⏳ depende de autorização |
| Índice de risco de 0 a 100 com os motivos | 🔜 planejado |
| Histórico de verificações | 🔜 planejado |
| Orientações de segurança conforme o resultado | 🔜 planejado |

### Classificação de risco

| Índice | Nível |
|---|---|
| 0 a 30 | Baixo |
| 31 a 60 | Moderado |
| 61 a 100 | Alto |

---

## Tecnologias

- **Backend:** Node.js 22+, Express 5, Prisma 7
- **Banco de dados:** PostgreSQL 17 (Docker no desenvolvimento, Neon em produção)
- **Frontend:** React + JavaScript *(em breve)*
- **Segurança:** helmet, cors, express-rate-limit, zod
- **Deploy:** Render

---

## Estrutura

```
SafeLink/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # modelo do banco
│   │   └── migrations/          # histórico de alterações do banco
│   ├── src/
│   │   ├── app.js               # monta o Express (middlewares e rotas)
│   │   ├── server.js            # sobe o servidor
│   │   ├── config/env.js        # lê e valida as variáveis de ambiente
│   │   ├── db/prisma.js         # conexão com o banco
│   │   ├── middlewares/         # validação, tratamento de erros
│   │   ├── modules/analysis/    # rotas, controller, service e repository das análises
│   │   └── engine/              # o "cérebro": não depende de Express nem de banco
│   │       ├── heuristics/      # verificações locais da URL
│   │       ├── providers/       # integrações com fontes externas
│   │       └── scoring/         # cálculo do índice de risco
│   ├── docker-compose.yml       # Postgres local
│   └── prisma.config.js
└── frontend/                    # em breve
```

O `engine/` só recebe uma URL e devolve indicadores e pontuação. Quem chama o engine e salva o resultado no banco é o service do módulo `analysis`. Por isso o engine pode ser testado sem subir servidor nem banco.

---

## Como rodar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) 22 ou superior
- [Docker](https://www.docker.com/) com Docker Compose

### Passo a passo

```bash
# 1. Clonar e entrar no backend
git clone <url-do-repositorio>
cd SafeLink/backend

# 2. Criar o .env a partir do exemplo e preencher os valores
cp .env.example .env

# 3. Subir o Postgres
docker compose up -d

# 4. Instalar as dependências (o Prisma Client é gerado automaticamente)
npm install

# 5. Criar as tabelas
npm run db:migrate

# 6. Rodar a API
npm run dev
```

Para conferir, abra <http://localhost:3000/health>. A resposta deve ser `{"status":"ok"}`.

### Variáveis de ambiente

Todas estão listadas em [`backend/.env.example`](backend/.env.example). A aplicação **não sobe** se faltar alguma obrigatória.

| Variável | Para que serve |
|---|---|
| `NODE_ENV` | `development`, `test` ou `production` |
| `PORT` | Porta da API (no Render, é definida pela plataforma) |
| `CORS_ORIGINS` | Origens do frontend que podem chamar a API, separadas por vírgula |
| `TRUST_PROXY_HOPS` | Quantidade de proxies na frente da API (`0` local, `1` no Render) |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Credenciais do Postgres local (lidas só na criação do volume) |
| `DATABASE_URL` | String de conexão: `postgresql://USUARIO:SENHA@localhost:5432/BANCO` |

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Roda a API com reinício automático e carrega o `.env` |
| `npm start` | Roda a API (usado em produção) |
| `npm run db:migrate` | Cria e aplica migrations em desenvolvimento |
| `npm run db:deploy` | Aplica as migrations pendentes (produção) |
| `npm run db:studio` | Abre o Prisma Studio para visualizar os dados |

---

## API

| Método | Rota | Descrição | Status |
|---|---|---|---|
| `GET` | `/health` | Verifica se a API está no ar | ✅ |
| `POST` | `/api/analyses` | Analisa uma URL | 🔜 |
| `GET` | `/api/analyses` | Lista o histórico (paginado) | 🔜 |
| `GET` | `/api/analyses/:id` | Detalhes de uma análise | 🔜 |

---

## Segurança e privacidade

A segurança é tratada como requisito desde o início do projeto:

- **Rate limit:** limite de requisições por IP, para evitar abuso e o consumo das cotas das APIs externas.
- **SSRF:** o servidor **nunca acessa a URL enviada pelo usuário**. Ela é apenas consultada nas APIs de segurança.
- **Banco:** queries parametrizadas (Prisma). O Postgres local só aceita conexões da própria máquina.
- **Dependências:** versões críticas fixadas, e scripts de instalação aprovados individualmente.
- **LGPD:** só os dados necessários são guardados, com política de retenção do histórico.

Encontrou uma vulnerabilidade? Avise a equipe em privado, sem abrir uma issue pública.

---

## Fontes externas

| Fonte | Uso |
|---|---|
| [RDAP](https://about.rdap.org/) | Data de criação e dados de registro do domínio |
| [Google Web Risk](https://cloud.google.com/web-risk) | Listas de phishing e malware |
| [VirusTotal](https://www.virustotal.com/) | Resultado de vários mecanismos de detecção |
| Reclame Aqui (RA Data Hub) | Reputação de empresas, mediante integração autorizada |

Cada fonte é usada conforme os seus termos de uso e limites de requisição. Se uma fonte estiver fora do ar, a análise continua com as demais e informa qual não respondeu.

---

## Equipe

- Biatrice de Leon Cantaluppi
- Cauê Bernardo Portela
- Víctor Lima Vieira

---

*Projeto acadêmico, sem fins comerciais.*
