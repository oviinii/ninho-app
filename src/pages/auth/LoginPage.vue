<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPremiumMessage = ref(false)

onMounted(() => {
  // Verificar se veio de um pagamento
  const params = new URLSearchParams(window.location.search)
  if (params.get('payment') === 'success') {
    showPremiumMessage.value = true
  }
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const result = await authStore.signIn(email.value, password.value)
    if (result.success) {
      // Verificar se é premium
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', authStore.user?.id)
        .single()
      
      if (profile?.is_premium) {
        router.push('/app/dashboard')
      } else {
        router.push('/subscription')
      }
    } else {
      error.value = result.error || 'Erro ao fazer login'
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Mensagem de pagamento bem-sucedido -->
      <div v-if="showPremiumMessage" class="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
        <p class="text-emerald-400 font-medium">✅ Pagamento confirmado!</p>
        <p class="text-white/30 text-sm mt-1">Crie sua conta abaixo para acessar o conteúdo premium.</p>
      </div>

      <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <h1 class="text-2xl font-light text-white text-center mb-6">Entrar no Ninho App</h1>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="text-sm text-white/30 block mb-1.5">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
              required
            />
          </div>

          <div>
            <label class="text-sm text-white/30 block mb-1.5">Senha</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
              required
            />
          </div>

          <div v-if="error" class="text-sm text-rose-400/70 bg-rose-500/10 p-3 rounded-lg">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-white/10 hover:bg-white/15 rounded-lg text-white/80 font-medium transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-white/20 text-sm">
            Não tem uma conta? 
            <router-link to="/auth/register" class="text-white/40 hover:text-white/60">
              Cadastrar
            </router-link>
          </p>
          <p class="text-white/10 text-xs mt-2">
            Ao criar uma conta, você concorda com nossos Termos de Uso
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
