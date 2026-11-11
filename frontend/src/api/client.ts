const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface AuthUser {
  id: number
  name: string
  email: string
  created_at?: string
  updated_at?: string
}

export interface AuthData {
  user: AuthUser
  token: string
  token_type: string
  expires_in: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

function getStoredToken(): string | null {
  return localStorage.getItem('portal-token')
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken()
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = typeof payload?.message === 'string'
      ? payload.message
      : 'Não foi possível concluir a requisição.'

    throw new Error(message)
  }

  return payload as T
}

export function saveAuthToken(token: string): void {
  localStorage.setItem('portal-token', token)
}

export function clearAuthToken(): void {
  localStorage.removeItem('portal-token')
}

export async function login(email: string, password: string): Promise<ApiResponse<AuthData>> {
  return apiRequest<ApiResponse<AuthData>>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function logout(): Promise<ApiResponse<null>> {
  return apiRequest<ApiResponse<null>>('/api/logout', { method: 'POST' })
}

export async function getCurrentUser(): Promise<ApiResponse<{ user: AuthUser }>> {
  return apiRequest<ApiResponse<{ user: AuthUser }>>('/api/me')
}
