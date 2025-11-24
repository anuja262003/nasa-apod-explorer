import { ref } from 'vue'
import { format, subDays } from 'date-fns'
import { fetchTodaysAPOD, fetchAPODByDate, fetchAPODRange } from '../services/api'

export function useAPOD() {
  const currentAPOD = ref(null)
  const galleryAPODs = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadTodaysAPOD = async () => {
    try {
      loading.value = true
      error.value = null
      currentAPOD.value = await fetchTodaysAPOD()
    } catch (err) {
      // Prefer server-provided error message body when available (e.g., upstream NASA errors)
      error.value = err.response?.data?.error || err.message
      console.error('Error loading today\'s APOD:', err)
    } finally {
      loading.value = false
    }
  }

  const loadAPODByDate = async (date) => {
    try {
      loading.value = true
      error.value = null
      currentAPOD.value = await fetchAPODByDate(date)
    } catch (err) {
      error.value = err.response?.data?.error || err.message
      console.error('Error loading APOD by date:', err)
    } finally {
      loading.value = false
    }
  }

  const loadRecentAPODs = async (days = 7) => {
  try {
    loading.value = true
    error.value = null
    
    const numDays = Number.isFinite(Number(days)) ? Math.max(1, Math.floor(Number(days))) : 7
    
    // Use UTC date to match NASA's server time
    const now = new Date()
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    
    const endDate = todayUTC
    const startDate = subDays(todayUTC, numDays - 1)
    
    console.log('Local time:', now.toString())
    console.log('UTC date for API:', format(endDate, 'yyyy-MM-dd'))
    console.log('Fetching APODs from:', format(startDate, 'yyyy-MM-dd'), 'to:', format(endDate, 'yyyy-MM-dd'))
    
    const data = await fetchAPODRange(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    )
    galleryAPODs.value = Array.isArray(data) ? data : [data]
  } catch (err) {
    error.value = err.response?.data?.error || err.message
    console.error('Error loading recent APODs:', err)
  } finally {
    loading.value = false
  }
}

  return {
    currentAPOD,
    galleryAPODs,
    loading,
    error,
    loadTodaysAPOD,
    loadAPODByDate,
    loadRecentAPODs
  }
}