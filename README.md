# MVP de Vendas | Assistencia Tecnica

Sistema front-end para operacao de vendas, servicos e acompanhamento gerencial de uma loja de assistencia tecnica e acessorios.

## Objetivo do sistema

Este projeto organiza a base de um MVP de vendas com foco em:

- cadastro simples de produtos e servicos
- criacao de vendas em memoria
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
- fluxo de nova venda com produtos, servicos, desconto, forma de pagamento e baixa de estoque
- historico de vendas com filtros simples e painel lateral de detalhes

## Integracao com API

- a feature `Products` pode usar a API real via `VITE_API_BASE_URL`
- as demais features continuam usando dados mockados em memoria nesta etapa

Exemplo de configuracao local:

```bash
cp .env.example .env
```

No desenvolvimento com Vite, o front pode usar `/api` e deixar o proxy encaminhar para a API real:

```env
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:5002
```

Se precisar chamar a API diretamente fora do proxy, voce ainda pode ajustar `VITE_API_BASE_URL` para a URL completa.

## Como rodar o projeto

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

- Products pode usar API real quando a base URL estiver configurada
- servicos e vendas continuam com repositories em memoria nesta etapa
- produtos, servicos e vendas partem de seeds locais
- novas vendas afetam o estoque em memoria durante a sessao atual
- ao recarregar a aplicacao, os dados voltam ao estado inicial dos mocks

## Backlog pos-MVP

- autenticacao
- backend real
- persistencia de dados
- ordem de servico
- relatorios avancados
- estorno de venda
- exportacao de dados
- melhorias adicionais de UX
