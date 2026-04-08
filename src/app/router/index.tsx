import { Navigate, createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '@app/layout/AppLayout'
import {
  RequireAuth,
  RequireCompanySetup,
  RequireGuest,
  RootRedirect,
} from '@app/router/guards'
import { DashboardPage } from '@presentation/pages/DashboardPage'
import { LoginPage } from '@presentation/pages/LoginPage'
import { NewSalePage } from '@presentation/pages/NewSalePage'
import { ProductsPage } from '@presentation/pages/ProductsPage'
import { SalesPage } from '@presentation/pages/SalesPage'
import { ServicesPage } from '@presentation/pages/ServicesPage'
import { SetupCompanyPage } from '@presentation/pages/SetupCompanyPage'
import { appRoutes } from '@shared/constants/app-routes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: appRoutes.login,
    element: (
      <RequireGuest>
        <LoginPage />
      </RequireGuest>
    ),
  },
  {
    path: appRoutes.setupCompany,
    element: (
      <RequireCompanySetup>
        <SetupCompanyPage />
      </RequireCompanySetup>
    ),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
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
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
