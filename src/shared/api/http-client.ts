import { API_BASE_URL } from '@shared/api/config'
import { dispatchUnauthorizedAuthEvent } from '@shared/auth/auth-events'
import { getStoredAccessToken } from '@shared/auth/session'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function extractErrorMessage(payload: unknown) {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (!payload || typeof payload !== 'object') {
    return null
  }

  const record = payload as Record<string, unknown>

  if (typeof record.message === 'string') {
    return record.message
  }

  if (typeof record.title === 'string') {
    return record.title
  }

  if (record.errors && typeof record.errors === 'object') {
    const firstError = Object.values(record.errors as Record<string, unknown>).find(
      (value) => Array.isArray(value) && value.length > 0 && typeof value[0] === 'string',
    ) as string[] | undefined

    if (firstError?.[0]) {
      return firstError[0]
    }
  }

  return null
}

function buildApiUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const normalizedBaseUrl = API_BASE_URL.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const baseEndsWithApi = normalizedBaseUrl.endsWith('/api')
  const pathStartsWithApi =
    normalizedPath === '/api' || normalizedPath.startsWith('/api/')

  if (!normalizedBaseUrl) {
    return normalizedPath
  }

  if (baseEndsWithApi && pathStartsWithApi) {
    return `${normalizedBaseUrl}${normalizedPath.slice(4)}`
  }

  return `${normalizedBaseUrl}${normalizedPath}`
}

function buildRequestHeaders(init?: RequestInit) {
  const headers = new Headers(init?.headers)
  const accessToken = getStoredAccessToken()

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  if (!headers.has('Content-Type') && init?.body && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  return headers
}

function getDefaultStatusMessage(status: number) {
  if (status === 401) {
    return 'Sua sessão não é mais válida. Faça login novamente para continuar.'
  }

  if (status === 403) {
    return 'Você não tem permissão para acessar este recurso com a sessão atual.'
  }

  return 'Não foi possível concluir a requisição.'
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    return error.message
  }

  return fallbackMessage
}

export async function httpRequest<T>(path: string, init?: RequestInit) {
  let response: Response

  try {
    response = await fetch(buildApiUrl(path), {
      ...init,
      headers: buildRequestHeaders(init),
    })
  } catch {
    throw new ApiError(
      'Não foi possível conectar com a API. Verifique se o backend está em execução e se a configuração da URL está correta.',
      0,
    )
  }

  const rawText = await response.text()
  let payload: unknown = null

  if (rawText) {
    try {
      payload = JSON.parse(rawText) as unknown
    } catch {
      payload = rawText
    }
  }

  if (!response.ok) {
    if (response.status === 401 && getStoredAccessToken()) {
      dispatchUnauthorizedAuthEvent()
    }

    throw new ApiError(
      extractErrorMessage(payload) ?? getDefaultStatusMessage(response.status),
      response.status,
    )
  }

  return payload as T
}
