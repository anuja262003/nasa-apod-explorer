<template>
  <div class="max-w-7xl mx-auto">
    <!-- Gallery Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Cosmic Gallery
      </h1>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto">
        Explore recent astronomical wonders from NASA's archives
      </p>
    </div>

    <!-- Controls -->
    <div class="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700 shadow-xl">
      <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div>
          <h2 class="text-2xl font-semibold text-white">Recent Discoveries</h2>
          <p class="text-gray-400 text-sm mt-1">{{ galleryAPODs.length }} astronomical wonders</p>
        </div>
        <button 
          @click="loadRecentAPODs" 
          :disabled="loading"
          class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg shadow-purple-600/25"
        >
          <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span>{{ loading ? 'Exploring...' : 'Discover More' }}</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20">
      <LoadingSpinner class="mb-4" />
      <p class="text-gray-400 text-lg">Scanning the cosmos...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-900/20 border border-red-800 rounded-2xl p-8 max-w-md mx-auto">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <h3 class="text-xl font-semibold text-red-300 mb-2">Signal Lost</h3>
        <p class="text-red-400">{{ error }}</p>
      </div>
    </div>

    <!-- Gallery Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <APODCard 
        v-for="apod in galleryAPODs" 
        :key="apod.date"
        :apod="apod"
        :show-full="false"
        @click="viewAPODDetail(apod.date)"
        class="cursor-pointer transform hover:scale-105 transition-transform duration-300"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && galleryAPODs.length === 0" class="text-center py-20">
      <div class="bg-gray-800/30 rounded-2xl p-12 max-w-md mx-auto border border-gray-700">
        <svg class="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-xl font-semibold text-gray-300 mb-2">No Cosmic Images Found</h3>
        <p class="text-gray-400 mb-4">The universe seems quiet today.</p>
        <button 
          @click="loadRecentAPODs"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Search Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAPOD } from '../composables/useAPOD'
import APODCard from '../components/APODCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const { galleryAPODs, loading, error, loadRecentAPODs } = useAPOD()

const viewAPODDetail = (date) => {
  router.push(`/detail/${date}`)
}

onMounted(() => {
  loadRecentAPODs(12)
})
</script>