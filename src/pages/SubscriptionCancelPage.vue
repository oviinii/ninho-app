<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
    <div class="text-center max-w-sm">
      <div class="text-6xl mb-4">😕</div>
      <h1 class="text-2xl font-light text-white mb-2">Pagamento cancelado</h1>
      <p class="text-white/30 text-sm mb-6">Você cancelou o processo de assinatura. Pode tentar novamente a qualquer momento.</p>
      <button @click="router.push('/checkout')" class="px-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-white/70 text-sm font-medium transition-colors">
        Tentar novamente
      </button>
    </div>
  </div>
</template>
