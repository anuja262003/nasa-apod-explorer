<template>
  <div class="flex flex-col items-center justify-center space-y-3">
    <div class="relative">
      <div class="w-12 h-12 border-4 border-blue-500/20 rounded-full"></div>
      <div class="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
    </div>
    <p class="text-gray-400 text-sm">Loading cosmic data...</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner'
}
</script>