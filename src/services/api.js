import axios from 'axios'

// Use environment variables that work with Vue CLI / webpack.
// Guard `process` with `typeof` so this code can run in browser environments
// where `process` is not defined (avoids ReferenceError at runtime).
// Prefer VUE_APP_API_BASE_URL (Vue CLI convention), then API_BASE_URL, then
// any window-level shim, then fall back to localhost.
const API_BASE_URL = (
  (typeof process !== 'undefined' && process.env && (process.env.VUE_APP_API_BASE_URL || process.env.API_BASE_URL)) ||
  (typeof window !== 'undefined' && window.__env && (window.__env.VUE_APP_API_BASE_URL || window.__env.API_BASE_URL)) ||
  'http://localhost:3001/api'
)

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
})

export const fetchTodaysAPOD = async () => {
  const response = await api.get('/apod/today')
  return response.data
}

export const fetchAPODByDate = async (date) => {
  const response = await api.get(`/apod/date/${date}`)
  return response.data
}

export const fetchAPODRange = async (start_date, end_date) => {
  const response = await api.get('/apod/range', {
    params: { start_date, end_date }
  })
  return response.data
}

export const fetchRandomAPODs = async (count = 5) => {
  const response = await api.get('/apod/random', {
    params: { count }
  })
  return response.data
}