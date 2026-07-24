<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { caktoService } from '@/services/cakto.service'
import { Loader2, Check, Shield, Smartphone, Clock, CreditCard, ArrowLeft, Sparkles } from 'lucide-vue-next'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const email = ref('')
const name = ref('')
const termsAccepted = ref(false)

const plan = {
  name: 'Ninho App Premium',
  price: 'R$ 29,90',
  period: 'por mês',
  features: [
    'Acesso completo a todos os módulos',
    'Múltiplos bebês por família',
    'Convide até 5 membros da família',
    'Relatórios avançados',
    'Exportação de dados',
    'Suporte prioritário',
    'Sem anúncios',
    'Atualizações futuras gratuitas'
  ]
}

const goToHome = () => {
  router.push('/')
}

const handleCheckout = () => {
  if (!email.value || !name.value) {
    error.value = 'Preencha seu nome e email'
    return
  }

  if (!termsAccepted.value) {
    error.value = 'Aceite os termos para continuar'
    return
  }

  loading.value = true
  error.value = ''

  try {
    sessionStorage.setItem('checkout_email', email.value)
    sessionStorage.setItem('checkout_name', name.value)
    caktoService.redirectToCheckout(email.value, name.value)
  } catch (err: any) {
    error.value = err.message || 'Erro ao iniciar pagamento'
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
    <!-- Botão voltar -->
    <button 
      @click="goToHome"
      class="fixed top-4 left-4 text-white/20 hover:text-white/40 transition-colors text-sm flex items-center gap-1"
    >
      ← Voltar
    </button>

    <div class="max-w-5xl w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-2xl">👶</span>
          <span class="text-xl font-light text-white">Ninho App</span>
        </div>
        <p class="text-white/30 text-sm">Assine agora e comece a cuidar do seu bebê</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Plano -->
        <div class="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 border border-white/10">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">Premium</span>
          </div>
          <h2 class="text-2xl font-light text-white">{{ plan.name }}</h2>
          <div class="mt-2">
            <span class="text-4xl font-light text-white">{{ plan.price }}</span>
            <span class="text-sm text-white/30 ml-1">{{ plan.period }}</span>
          </div>

          <ul class="mt-6 space-y-3">
            <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-sm text-white/50">
              <Check class="w-4 h-4 text-emerald-400 flex-shrink-0" />
              {{ feature }}
            </li>
          </ul>

          <div class="mt-6 pt-6 border-t border-white/5">
            <div class="flex items-center justify-between text-sm">
              <span class="text-white/30">Total</span>
              <span class="text-white font-medium">{{ plan.price }}</span>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-center gap-4 text-xs text-white/20">
            <span class="flex items-center gap-1"><Shield class="w-3.5 h-3.5" /> Pagamento seguro</span>
            <span class="flex items-center gap-1"><CreditCard class="w-3.5 h-3.5" /> Cartão de crédito</span>
          </div>
        </div>

        <!-- Formulário -->
        <div class="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/3 border border-white/10">
          <h3 class="text-white font-medium text-lg mb-4">Dados para assinatura</h3>
          
          <form @submit.prevent="handleCheckout" class="space-y-4">
            <div>
              <label class="text-sm text-white/30 block mb-1.5">Nome completo</label>
              <input
                v-model="name"
                type="text"
                placeholder="Seu nome"
                class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                required
              />
            </div>

            <div>
              <label class="text-sm text-white/30 block mb-1.5">Email</label>
              <input
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                required
              />
            </div>

            <div class="flex items-start gap-2">
              <input
                v-model="termsAccepted"
                type="checkbox"
                class="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-emerald-400 focus:ring-emerald-400"
              />
              <label class="text-xs text-white/25 leading-relaxed">
                Concordo com os 
                <a href="#" class="text-white/40 hover:text-white/60 transition-colors">Termos de Uso</a> 
                e 
                <a href="#" class="text-white/40 hover:text-white/60 transition-colors">Política de Privacidade</a>
              </label>
            </div>

            <div v-if="error" class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/10">
              <p class="text-sm text-rose-400/70">{{ error }}</p>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 hover:from-emerald-500/30 hover:to-emerald-500/20 rounded-xl text-emerald-400 font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2 border border-emerald-500/20 hover:border-emerald-500/30"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <span v-else>
                <Sparkles class="w-4 h-4 inline mr-2" />
                Assinar agora
              </span>
            </button>

            <p class="text-xs text-white/15 text-center">
              🔒 Pagamento seguro via Cakto • Cancelamento a qualquer momento
            </p>
          </form>
        </div>
      </div>

      <!-- Link para login -->
      <p class="text-center text-white/15 text-sm mt-6">
        Já tem uma conta? 
        <router-link to="/auth/login" class="text-emerald-400/50 hover:text-emerald-400 transition-colors">
          Fazer login
        </router-link>
      </p>
    </div>
  </div>
</template>
