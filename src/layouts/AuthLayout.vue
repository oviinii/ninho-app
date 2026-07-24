<!-- src/layouts/AuthLayout.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Ninho App - Autenticação',
})
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white">👶 Ninho App</h1>
        <p class="text-text-secondary">Ecossistema digital para famílias</p>
      </div>
      
      <div class="glass rounded-2xl p-8">
        <router-view />
      </div>
    </div>
  </div>
</template>