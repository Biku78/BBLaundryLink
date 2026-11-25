import { createSlice } from '@reduxjs/toolkit'

const initialState = { query: '', service: '' }

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state, action) { state.query = action.payload },
    setService(state, action) { state.service = action.payload },
    clearFilters: () => initialState,
  },
})

export const { setQuery, setService, clearFilters } = filtersSlice.actions
export default filtersSlice.reducer
