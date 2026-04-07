export const appRoutes = {
  dashboard: '/dashboard',
  products: '/products',
  services: '/services',
  sales: '/sales',
  newSale: '/sales/new',
} as const

export const navigationItems = [
  {
    label: 'Dashboard',
    to: appRoutes.dashboard,
    description: 'Visão geral do fluxo comercial',
  },
  {
    label: 'Produtos',
    to: appRoutes.products,
    description: 'Catálogo e cadastro de itens',
  },
  {
    label: 'Serviços',
    to: appRoutes.services,
    description: 'Base para serviços da assistência técnica',
  },
  {
    label: 'Vendas',
    to: appRoutes.sales,
    description: 'Consulta e acompanhamento das vendas',
  },
  {
    label: 'Nova venda',
    to: appRoutes.newSale,
    description: 'Fluxo principal para registrar vendas',
  },
] as const
