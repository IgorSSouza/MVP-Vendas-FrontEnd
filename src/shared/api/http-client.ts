import { API_BASE_URL } from '@shared/api/config'

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
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      ...init,
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
    throw new ApiError(
      extractErrorMessage(payload) ?? 'Não foi possível concluir a requisição.',
      response.status,
    )
  }

  return payload as T
}
