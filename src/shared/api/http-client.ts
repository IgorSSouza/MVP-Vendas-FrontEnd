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

export async function httpRequest<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

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
      extractErrorMessage(payload) ?? 'Nao foi possivel concluir a requisicao.',
      response.status,
    )
  }

  return payload as T
}
