# MVP de Vendas | Assistencia Tecnica

Sistema front-end para operacao de vendas, servicos e acompanhamento gerencial de uma loja de assistencia tecnica e acessorios.

## Objetivo do sistema

Este projeto organiza a base de um MVP de vendas com foco em:

- cadastro simples de produtos e servicos
- criacao de vendas
- controle basico de estoque para produtos
- historico de vendas
- visao inicial de dashboard

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
- modulo de produtos com listagem, filtros, cadastro, edicao e ativacao ou inativacao
- modulo de servicos com listagem, filtros, cadastro, edicao e ativacao ou inativacao
- fluxo de nova venda com produtos, servicos, desconto, forma de pagamento e baixa de estoque pela API
- historico de vendas com filtros simples e painel lateral de detalhes

## Integracao com API

- `Products`, `Services`, `Sales / New Sale`, `Sales` e `Dashboard` usam a API real
- a configuracao principal fica em `VITE_API_BASE_URL`
- no ambiente local com Vite, o recomendado e usar proxy para evitar problemas de CORS

Exemplo de configuracao local:

```bash
cp .env.example .env
```

No desenvolvimento com Vite, o front pode usar `/api` e deixar o proxy encaminhar para a API real:

```env
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:5002
```

Se precisar chamar a API diretamente fora do proxy, voce tambem pode usar:

```env
VITE_API_BASE_URL=http://localhost:5002
```

O cliente HTTP trata tanto caminhos com `/api/...` quanto base URL em `/api` ou URL completa.

## Como rodar o projeto

1. Suba a API .NET 8 no endereco configurado em `VITE_API_PROXY_TARGET` ou `VITE_API_BASE_URL`
2. No front-end, crie o arquivo `.env` com base em `.env.example`
3. Rode:

```bash
npm install
npm run dev
```

Para validar a compilacao de producao:

```bash
npm run build
```

## Estrutura geral de pastas

```text
src/
  app/
    layout/
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
    constants/
    types/
    utils/
```

## Observacoes sobre dados mockados em memoria

- a infraestrutura mock continua no projeto para apoio local e evolucao incremental
- as features principais integradas ja usam a API real
- se a API estiver indisponivel, as telas integradas exibem erro de conexao em vez de cair silenciosamente

## Backlog pos-MVP

- autenticacao
- backend real
- persistencia de dados
- ordem de servico
- relatorios avancados
- estorno de venda
- exportacao de dados
- melhorias adicionais de UX
