import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import pages with new names
import HomePage from './pages/HomePage.vue'
import GalleryPage from './pages/GalleryPage.vue'
import DetailPage from './pages/DetailPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/gallery', component: GalleryPage },
  { path: '/detail/:date', component: DetailPage, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')