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
    description: 'Visao geral do fluxo comercial',
  },
  {
    label: 'Produtos',
    to: appRoutes.products,
    description: 'Catalogo e cadastro futuro de itens',
  },
  {
    label: 'Servicos',
    to: appRoutes.services,
    description: 'Base para servicos da assistencia tecnica',
  },
  {
    label: 'Vendas',
    to: appRoutes.sales,
    description: 'Consulta e acompanhamento das vendas',
  },
  {
    label: 'Nova venda',
    to: appRoutes.newSale,
    description: 'Entrada futura do fluxo de venda',
  },
] as const
