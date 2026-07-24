<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Preencha todos os campos'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await authStore.signIn(email.value, password.value)
    
    if (result.success) {
      router.push('/app/dashboard')
    } else {
      error.value = result.error || 'Erro ao fazer login'
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
    <!-- Botão voltar -->
    <button 
      @click="goToHome"
      class="fixed top-4 left-4 text-white/20 hover:text-white/40 transition-colors text-sm"
    >
      ← Voltar
    </button>

    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="text-2xl">👶</span>
          <span class="text-xl font-light text-white">Ninho App</span>
        </div>
        <h1 class="text-2xl font-light text-white">Bem-vindo de volta</h1>
        <p class="text-white/30 text-sm mt-1">Faça login para acessar sua conta</p>
      </div>

      <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="text-sm text-white/30 block mb-1.5">Email</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label class="text-sm text-white/30 block mb-1.5">Senha</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-10 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-end">
            <a href="#" class="text-xs text-white/20 hover:text-white/40 transition-colors">
              Esqueceu a senha?
            </a>
          </div>

          <div v-if="error" class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/10">
            <p class="text-sm text-rose-400/70">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-white/10 hover:bg-white/15 rounded-lg text-white/80 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <span v-else>
              Entrar
              <ArrowRight class="w-4 h-4 inline ml-1" />
            </span>
          </button>
        </form>

        <!-- Link para criar conta - apenas para usuários que já pagaram -->
        <div class="mt-6 pt-6 border-t border-white/5">
          <p class="text-center text-white/15 text-xs">
            Já fez o pagamento e não tem uma conta?
            <router-link to="/access-instructions" class="text-emerald-400/50 hover:text-emerald-400 transition-colors">
              Clique aqui
            </router-link>
          </p>
        </div>
      </div>

      <p class="text-center text-white/10 text-xs mt-6">
        🔒 Seus dados estão seguros
      </p>
    </div>
  </div>
</template>
