<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Redirecionar para a página de instruções
  router.replace('/access-instructions')
})
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
    <div class="text-center">
      <div class="w-8 h-8 border-2 border-white/10 border-t-white/30 rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-white/30 text-sm">Redirecionando...</p>
    </div>
  </div>
</template>
