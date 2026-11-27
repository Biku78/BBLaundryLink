import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import filtersReducer from '../features/filters/filtersSlice'
import authReducer from '../features/auth/authSlice'
import { api } from '../services/api'

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})

setupListeners(store.dispatch)
