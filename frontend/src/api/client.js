const BASE = import.meta.env.VITE_API_BASE

export function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  if (!token) localStorage.removeItem('token')
  else localStorage.setItem('token', token)
}

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth && getToken()) headers['Authorization'] = `Bearer ${getToken()}`
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

