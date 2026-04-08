import { httpRequest } from '@shared/api/http-client'
import type { AuthSession } from '@shared/auth/session'

type SetupInitialCompanyRequest = {
  name: string
  cnpj: string
}

export async function setupInitialCompany(payload: SetupInitialCompanyRequest) {
  return httpRequest<AuthSession>('/api/companies/setup-initial', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
