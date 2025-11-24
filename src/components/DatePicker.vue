<template>
  <div class="flex flex-col items-center space-y-4">
    <label for="apod-date" class="text-lg font-semibold text-white flex items-center space-x-2">
      <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <span>Explore Cosmic History</span>
    </label>
    
    <div class="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-lg">
      <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div class="flex items-center space-x-2 text-sm text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Select any date since 1995</span>
        </div>
        
        <input
          type="date"
          id="apod-date"
          :value="selectedDate"
          :min="minDate"
          :max="maxDate"
          @input="handleDateChange"
          class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'DatePicker',
  props: {
    selectedDate: {
      type: String,
      required: true
    }
  },
  emits: ['date-change'],
  data() {
    const today = format(new Date(), 'yyyy-MM-dd')
    console.log('DatePicker - Today:', today)
    console.log('DatePicker - Selected Date:', this.selectedDate)
    
    return {
      minDate: '1995-06-16',
      maxDate: today
    }
  },
  methods: {
    handleDateChange(event) {
      console.log('Date selected:', event.target.value)
      this.$emit('date-change', event.target.value)
    }
  }
}
</script>