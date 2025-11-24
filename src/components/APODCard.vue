<template>
  <div 
    class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Media Container -->
    <div class="relative overflow-hidden">
      <!-- Image Media Type -->
      <img
        v-if="isImage"
        :src="apod.url"
        :alt="apod.title"
        class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />

      <!-- Video or Other Media Type -->
      <div v-else-if="isVideo || isOtherVideo" class="w-full">
        <!-- Compact View (Gallery) -->
        <div v-if="!showFull" class="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-black/60 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
              <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <span class="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
            {{ hasVideoUrl ? 'Watch Video' : 'Video Content' }}
          </span>
        </div>

        <!-- Full View (Detail) -->
        <div v-else class="w-full bg-black">
          <div class="relative" style="padding-top: 56.25%">
            <video 
              v-if="isDirectVideo"
              :src="apod.url"
              controls
              class="absolute top-0 left-0 w-full h-full rounded-t-2xl"
            >
              Your browser does not support the video tag.
            </video>
            
            <iframe
              v-else-if="isEmbeddable"
              :src="videoUrl"
              class="absolute top-0 left-0 w-full h-full rounded-t-2xl"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              :title="apod.title"
            ></iframe>
            
            <div v-else-if="hasVideoUrl" class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
              <div class="text-center">
                <svg class="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-gray-300 mb-2">Video cannot be embedded</p>
                <a :href="apod.url" target="_blank" rel="noopener noreferrer" 
                   class="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center space-x-1">
                  <span>Open externally</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </div>
            </div>

            <div v-else class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
              <div class="text-center">
                <svg class="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-gray-300 mb-2">Video content not available</p>
                <p class="text-gray-500 text-sm">NASA hasn't provided the video URL yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Media Type Badge -->
      <div class="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/20">
        {{ displayMediaType.toUpperCase() }}
      </div>

      <!-- Date Badge -->
      <div class="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium border border-white/20">
        {{ formatDate(apod.date) }}
      </div>
    </div>
    
    <!-- Content -->
    <div class="p-6">
      <!-- Title -->
      <h3 class="font-bold text-lg mb-3 line-clamp-2 text-white group-hover:text-blue-300 transition-colors">
        {{ apod.title || 'Untitled Cosmic Wonder' }}
      </h3>

      <!-- Metadata -->
      <div class="flex items-center text-sm text-gray-400 mb-4 space-x-3">
        <span class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>{{ formatDate(apod.date) }}</span>
        </span>
        <span v-if="apod.copyright" class="flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          <span>{{ apod.copyright }}</span>
        </span>
      </div>
      
      <!-- Explanation -->
      <p v-if="showFull" class="text-gray-300 leading-relaxed mb-6 text-sm">
        {{ apod.explanation || 'No explanation available for this cosmic wonder.' }}
      </p>
      <p v-else class="text-gray-300 text-sm line-clamp-3 leading-relaxed">
        {{ apod.explanation || 'No explanation available for this cosmic wonder.' }}
      </p>

      <!-- Actions -->
      <div v-if="showFull" class="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-700">
        <div v-if="apod.media_type === 'image' && apod.hdurl" class="flex-1">
          <a
            :href="apod.hdurl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"/>
            </svg>
            <span>View HD</span>
          </a>
        </div>
        
        <div v-if="(isVideo || isOtherVideo) && hasVideoUrl" class="flex-1">
          <a
            :href="apod.url"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Open Video</span>
          </a>
        </div>
      </div>

      <!-- View Details Button (Compact View) -->
      <div v-if="!showFull" class="mt-4 pt-3 border-t border-gray-700">
        <button class="w-full text-center text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center justify-center space-x-1">
          <span>View Details</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'APODCard',
  props: {
    apod: {
      type: Object,
      required: true,
      default: () => ({})
    },
    showFull: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  computed: {
    hasVideoUrl() {
      return !!this.apod?.url && this.apod.url.trim() !== '';
    },
    
    isImage() {
      return this.apod?.media_type === 'image';
    },
    
    isVideo() {
      return this.apod?.media_type === 'video';
    },
    
    isOtherVideo() {
      if (this.apod?.media_type !== 'other') return false;
      
      const url = (this.apod?.url || '').toLowerCase();
      const explanation = (this.apod?.explanation || '').toLowerCase();
      
      const isVideoUrl = url.includes('youtube') || 
                         url.includes('vimeo') || 
                         url.includes('video') ||
                         url.includes('embed') ||
                         url.includes('player') ||
                         url.includes('mp4') ||
                         url.includes('webm') ||
                         url.includes('mov');
      
      const isVideoExplanation = explanation.includes('video') || 
                                explanation.includes('movie') ||
                                explanation.includes('scrolls');
      
      return isVideoUrl || isVideoExplanation;
    },
    
    displayMediaType() {
      if (this.isOtherVideo) return 'video';
      return this.apod?.media_type || 'unknown';
    },
    
    videoUrl() {
      if (!this.isVideo && !this.isOtherVideo) return '';
      if (!this.hasVideoUrl) return '';
      
      const url = this.apod.url;
      
      if (url.includes('youtube.com/embed') || url.includes('player.vimeo.com')) {
        return url;
      }
      
      if (url.includes('youtube.com/watch')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      
      if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
        const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
        return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
      }
      
      return url;
    },
    
    isEmbeddable() {
      if (!this.hasVideoUrl) return false;
      
      const url = (this.videoUrl || '').toLowerCase();
      
      const embeddablePatterns = [
        'youtube.com/embed',
        'player.vimeo.com',
        'youtu.be/',
        'vimeo.com/',
        'youtube.com/watch'
      ];
      
      return embeddablePatterns.some(pattern => url.includes(pattern));
    },
    
    isDirectVideo() {
      if (!this.hasVideoUrl) return false;
      
      const url = (this.apod.url || '').toLowerCase();
      const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.avi'];
      return videoExtensions.some(ext => url.includes(ext));
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Unknown date';
      try {
        return format(new Date(dateString), 'MMM d, yyyy')
      } catch (error) {
        return 'Invalid date';
      }
    }
  }
}
</script>