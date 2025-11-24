<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
    <!-- Enhanced Header -->
    <header class="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 shadow-xl sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <!-- Logo & Title -->
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"/>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                NASA APOD Explorer
              </h1>
              <p class="text-xs text-gray-400">Discover the cosmos</p>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex space-x-1 bg-gray-800 rounded-lg p-1">
            <router-link 
              to="/" 
              class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              :class="{'bg-blue-600 shadow-lg shadow-blue-600/25': $route.path === '/', 'text-gray-300 hover:text-white hover:bg-gray-700': $route.path !== '/'}"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span>Today</span>
            </router-link>
            <router-link 
              to="/gallery" 
              class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              :class="{'bg-purple-600 shadow-lg shadow-purple-600/25': $route.path === '/gallery', 'text-gray-300 hover:text-white hover:bg-gray-700': $route.path !== '/gallery'}"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              <span>Gallery</span>
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Enhanced Footer -->
    <footer class="bg-gray-900/50 border-t border-gray-800 mt-16">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div class="flex items-center space-x-3">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"/>
              </svg>
            </div>
            <div>
              <p class="font-semibold">NASA APOD Explorer</p>
              <p class="text-sm text-gray-400">Exploring the universe, one day at a time</p>
            </div>
          </div>
          
          <div class="text-center md:text-right">
            <p class="text-gray-400 text-sm">
              Data provided by NASA's Astronomy Picture of the Day API
            </p>
            <p class="text-gray-500 text-xs mt-1">
              Built with Vue.js & Express
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// No setup needed for main app component
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>