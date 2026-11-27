import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { logout, setCredentials } from '../features/auth/authSlice'

let api
let store
beforeEach(async () => {
  vi.stubEnv('VITE_API_BASE_URL', 'http://localhost/api/')
  vi.resetModules()
  ;({ api } = await import('./api'))
  store = configureStore({
    reducer: { auth: authReducer, [api.reducerPath]: api.reducer },
    middleware: defaults => defaults().concat(api.middleware),
  })
})
afterEach(() => {
  store.dispatch(api.util.resetApiState())
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})
const credentials = { email: 'customer@example.com', password: 'test-password' }

describe('login API integration', () => {
  it('posts customer registration details', async () => {
    const details = { name: 'Test', mobile: '9876543210', email: 'test@example.com', password: 'Laundry123!', confirm_password: 'Laundry123!', accept_terms: true }
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ status: 'success' }, { status: 201 }))
    vi.stubGlobal('fetch', fetchMock)
    await store.dispatch(api.endpoints.register.initiate(details)).unwrap()
    const request = fetchMock.mock.calls[0][0]
    expect(request.url).toBe('http://localhost/api/register')
    expect(request.method).toBe('POST')
    expect(await request.json()).toEqual(details)
    expect(store.getState().auth.token).toBeNull()
  })

  it('exposes duplicate email errors from registration', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ message: 'an account with this email already exists' }, { status: 409 })))
    await expect(store.dispatch(api.endpoints.register.initiate({})).unwrap()).rejects.toMatchObject({ status: 409 })
  })

  it('posts credentials and stores the returned user/token', async () => {
    const data = { token: 'test-jwt', user: { ID: 1, Name: 'Customer', Role: 'customer' } }
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ status: 'success', data }))
    vi.stubGlobal('fetch', fetchMock)
    const result = await store.dispatch(api.endpoints.login.initiate(credentials)).unwrap()
    const request = fetchMock.mock.calls[0][0]
    expect(request.url).toBe('http://localhost/api/login')
    expect(request.method).toBe('POST')
    expect(await request.json()).toEqual(credentials)
    store.dispatch(setCredentials(result.data))
    expect(store.getState().auth).toEqual(data)
    store.dispatch(logout())
    expect(store.getState().auth).toEqual({ token: null, user: null })
  })

  it('returns invalid-credential errors without authenticating', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ message: 'invalid email or password' }, { status: 401 })))
    await expect(store.dispatch(api.endpoints.login.initiate(credentials)).unwrap()).rejects.toMatchObject({ status: 401, data: { message: 'invalid email or password' } })
    expect(store.getState().auth.token).toBeNull()
  })

  it('reports unavailable backend connections', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network unavailable')))
    await expect(store.dispatch(api.endpoints.login.initiate(credentials)).unwrap()).rejects.toMatchObject({ status: 'FETCH_ERROR' })
    expect(store.getState().auth.user).toBeNull()
  })

  it('attaches the bearer token to later API calls', async () => {
    store.dispatch(setCredentials({ token: 'test-jwt', user: { ID: 1 } }))
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ status: 'success' }))
    vi.stubGlobal('fetch', fetchMock)
    await store.dispatch(api.endpoints.getHealth.initiate()).unwrap()
    expect(fetchMock.mock.calls[0][0].headers.get('authorization')).toBe('Bearer test-jwt')
  })
})
