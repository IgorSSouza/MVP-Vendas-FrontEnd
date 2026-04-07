import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@app/layout/AppLayout'
import { appRoutes } from '@shared/constants/app-routes'

import { DashboardPage } from '@presentation/pages/DashboardPage'
import { NewSalePage } from '@presentation/pages/NewSalePage'
import { ProductsPage } from '@presentation/pages/ProductsPage'
import { SalesPage } from '@presentation/pages/SalesPage'
import { ServicesPage } from '@presentation/pages/ServicesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={appRoutes.dashboard} replace />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: appRoutes.dashboard,
        element: <DashboardPage />,
      },
      {
        path: appRoutes.products,
        element: <ProductsPage />,
      },
      {
        path: appRoutes.services,
        element: <ServicesPage />,
      },
      {
        path: appRoutes.sales,
        element: <SalesPage />,
      },
      {
        path: appRoutes.newSale,
        element: <NewSalePage />,
      },
    ],
  },
])
