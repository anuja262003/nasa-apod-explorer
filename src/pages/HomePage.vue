<template>
  <div class="max-w-6xl mx-auto">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Astronomy Picture of the Day
      </h1>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto">
        Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured.
      </p>
    </div>

    <!-- Date Picker Section -->
    <div class="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700 shadow-xl">
      <DatePicker 
        :selected-date="selectedDate"
        @date-change="handleDateChange"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <LoadingSpinner class="mb-4" />
      <p class="text-gray-400 text-lg">Exploring the cosmos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-900/20 border border-red-800 rounded-2xl p-8 max-w-md mx-auto">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <h3 class="text-xl font-semibold text-red-300 mb-2">Cosmic Connection Lost</h3>
        <p class="text-red-400">{{ error }}</p>
        <button 
          @click="loadTodaysAPOD"
          class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- APOD Content -->
    <div v-else-if="currentAPOD" class="bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
      <APODCard 
        :apod="currentAPOD"
        :show-full="true"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import { useAPOD } from '../composables/useAPOD'
import DatePicker from '../components/DatePicker.vue'
import APODCard from '../components/APODCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

export default {
  name: 'HomePage',
  components: {
    DatePicker,
    APODCard,
    LoadingSpinner
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { currentAPOD, loading, error, loadTodaysAPOD, loadAPODByDate } = useAPOD()

    const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'))

    const handleDateChange = async (date) => {
      selectedDate.value = date
      if (date === format(new Date(), 'yyyy-MM-dd')) {
        await loadTodaysAPOD()
        router.push('/')
      } else {
        await loadAPODByDate(date)
        router.push(`/detail/${date}`)
      }
    }

    onMounted(async () => {
      if (route.params.date) {
        selectedDate.value = route.params.date
        await loadAPODByDate(route.params.date)
      } else {
        await loadTodaysAPOD()
      }
    })

    watch(() => route.params.date, async (newDate) => {
      if (newDate) {
        selectedDate.value = newDate
        await loadAPODByDate(newDate)
      }
    })

    return {
      currentAPOD,
      loading,
      error,
      selectedDate,
      handleDateChange,
      loadTodaysAPOD
    }
  }
}
</script>