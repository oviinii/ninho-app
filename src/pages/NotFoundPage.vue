<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { Home } from 'lucide-vue-next'

const router = useRouter()

useHead({
  title: 'Página não encontrada',
})
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="text-center max-w-md">
      <div class="text-8xl mb-6">🔍</div>
      <h1 class="text-4xl font-bold text-white mb-2">404</h1>
      <p class="text-text-secondary text-lg mb-6">
        Oops! A página que você procura não foi encontrada.
      </p>
      <button 
        @click="router.push('/')"
        class="btn-primary flex items-center gap-2 mx-auto"
      >
        <Home class="w-4 h-4" />
        Voltar para o início
      </button>
    </div>
  </div>
</template>
