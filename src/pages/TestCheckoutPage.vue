<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('teste@email.com')
const name = ref('Usuário Teste')

const simulatePayment = () => {
  sessionStorage.setItem('checkout_email', email.value)
  sessionStorage.setItem('checkout_name', name.value)
  router.push('/payment/success')
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
    <div class="max-w-md w-full p-6 rounded-xl bg-white/5 border border-white/10">
      <h1 class="text-2xl font-light text-white mb-6">🧪 Teste de Checkout</h1>
      
      <form @submit.prevent="simulatePayment" class="space-y-4">
        <div>
          <label class="text-sm text-white/30 block mb-1.5">Email</label>
          <input v-model="email" type="email" class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
        </div>

        <div>
          <label class="text-sm text-white/30 block mb-1.5">Nome</label>
          <input v-model="name" type="text" class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white" />
        </div>

        <button type="submit" class="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-400 font-medium transition-colors">
          🚀 Simular Pagamento
        </button>
      </form>
    </div>
  </div>
</template>
