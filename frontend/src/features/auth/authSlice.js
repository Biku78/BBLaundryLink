import { createSlice } from '@reduxjs/toolkit'

// Keep credentials in memory, not localStorage. A refresh requires signing in again.
const initialState = { token: null, user: null }
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    logout: () => initialState,
  },
})
export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
