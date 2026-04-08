# MVP de Vendas | Assistência Técnica

Sistema front-end para operação de vendas, serviços e acompanhamento gerencial de uma loja de assistência técnica e acessórios.

## Objetivo do sistema

Este projeto organiza a base de um MVP de vendas com foco em:

- cadastro simples de produtos e serviços
- criação de vendas
- controle básico de estoque para produtos
- histórico de vendas
- visão inicial de dashboard
- autenticação com Google e sessão protegida pela API

## Stack utilizada

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- React Hook Form
- Zod

## Funcionalidades atuais do MVP

- dashboard com indicadores principais, resumo por forma de pagamento, estoque baixo e vendas recentes
- módulo de produtos com listagem, filtros, cadastro, edição e ativação ou inativação
- módulo de serviços com listagem, filtros, cadastro, edição e ativação ou inativação
- fluxo de nova venda com produtos, serviços, desconto, forma de pagamento e baixa de estoque pela API
- histórico de vendas com filtros simples, paginação, ordenação e painel lateral de detalhes
- login com Google, armazenamento do token e proteção básica de rotas
- redirecionamento para configuração inicial da empresa quando `needsCompanySetup = true`

## Integração com API

- `Products`, `Services`, `Sales / New Sale`, `Sales` e `Dashboard` usam a API real
- o login usa `POST /api/auth/google`
- o token retornado é salvo no front e enviado como `Authorization: Bearer`
- a configuração principal fica em `VITE_API_BASE_URL`
- no ambiente local com Vite, o recomendado é usar proxy para evitar problemas de CORS

Exemplo de configuração local:

```env
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:5002
VITE_GOOGLE_CLIENT_ID=seu-google-client-id.apps.googleusercontent.com
```

Se precisar chamar a API diretamente fora do proxy:

```env
VITE_API_BASE_URL=http://localhost:5002
```

O cliente HTTP trata tanto caminhos com `/api/...` quanto base URL em `/api` ou URL completa.

## Configuração do Google Login

1. Crie um OAuth Client para aplicação web no Google Cloud.
2. Copie o Client ID para o `.env` usando `VITE_GOOGLE_CLIENT_ID`.
3. Autorize o domínio local do Vite no Google, por exemplo:

- `http://localhost:5173`

Sem esse valor, a rota `/login` não consegue renderizar o botão do Google Identity Services.

## Como rodar o projeto

1. Suba a API .NET 8 no endereço configurado em `VITE_API_PROXY_TARGET` ou `VITE_API_BASE_URL`
2. No front-end, crie o arquivo `.env` com base em `.env.example`
3. Rode:

```bash
npm install
npm run dev
```

Para validar a compilação de produção:

```bash
npm run build
```

## Estrutura geral de pastas

```text
src/
  app/
    layout/
    providers/
    router/
  domain/
    entities/
    enums/
  application/
    calculators/
    inventory/
  infra/
    mock/
      data/
      repositories/
      utils/
  presentation/
    components/
    pages/
    styles/
  shared/
    api/
    auth/
    constants/
    theme/
    types/
    utils/
```

## Observações sobre dados mockados em memória

- a infraestrutura mock continua no projeto para apoio local e evolução incremental
- as features principais integradas já usam a API real
- se a API estiver indisponível, as telas integradas exibem erro de conexão em vez de cair silenciosamente
- as rotas protegidas exigem sessão válida no front

## Backlog pós-MVP

- onboarding completo da empresa
- persistência mais robusta de sessão
- refresh token
- ordem de serviço
- relatórios avançados
- estorno de venda
- exportação de dados
- melhorias adicionais de UX
