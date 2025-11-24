<template>
  <div>
    <DatePicker 
      :selected-date="selectedDate"
      @date-change="handleDateChange"
    />

    <div v-if="loading" class="flex justify-center items-center h-64">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="text-center text-red-400 py-8">
      Error: {{ error }}
    </div>

    <APODCard 
      v-else-if="currentAPOD"
      :apod="currentAPOD"
      :show-full="true"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAPOD } from '../composables/useAPOD'
import DatePicker from '../components/DatePicker.vue'
import APODCard from '../components/APODCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const { currentAPOD, loading, error, loadAPODByDate } = useAPOD()

const selectedDate = ref(route.params.date)

const handleDateChange = (date) => {
  selectedDate.value = date
  router.push(`/detail/${date}`) // ← Make sure this also uses /detail/
}

onMounted(() => {
  loadAPODByDate(route.params.date)
})

watch(() => route.params.date, (newDate) => {
  selectedDate.value = newDate
  loadAPODByDate(newDate)
})
</script>