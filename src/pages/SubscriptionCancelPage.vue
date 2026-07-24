<script setup lang="ts">
import { useRouter } from 'vue-router'
import { XCircle } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
    <div class="text-center max-w-sm">
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
          <XCircle class="w-8 h-8 text-rose-400" />
        </div>
      </div>
      <h1 class="text-2xl font-light text-white">Pagamento cancelado</h1>
      <p class="text-white/30 text-sm mt-2">
        Você cancelou o processo de assinatura. Pode tentar novamente a qualquer momento.
      </p>
      <button 
        @click="router.push('/subscription')"
        class="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-white/70 text-sm font-medium transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  </div>
</template>
