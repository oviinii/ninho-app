<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-vue-next'

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
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Voltar -->
    <button 
      @click="goToHome"
      class="absolute top-6 left-6 text-white/20 hover:text-white/40 transition-all duration-300 text-sm flex items-center gap-1.5 group z-10"
    >
      <ArrowLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      <span class="hidden sm:inline">Voltar</span>
    </button>

    <div class="w-full max-w-[400px] relative z-10">
      <!-- Logo & Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-5">
          <span class="text-2xl">👶</span>
          <span class="text-xl font-light tracking-tight text-white">Ninho</span>
        </div>
        <h1 class="text-2xl font-light text-white tracking-tight">Bem-vindo de volta</h1>
        <p class="text-white/25 text-sm mt-1.5 leading-relaxed max-w-xs mx-auto">
          Entre para continuar acompanhando tudo em um só lugar.
        </p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl bg-white/3 border border-white/5 p-6">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email -->
          <div>
            <label class="text-xs text-white/25 block mb-1.5 font-medium tracking-wide">Email</label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
              <input
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                class="w-full pl-10 pr-4 py-2.5 bg-white/3 border border-white/5 rounded-lg text-white placeholder-white/10 transition-all duration-200 focus:outline-none focus:border-white/15"
                required
              />
            </div>
          </div>

          <!-- Senha -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs text-white/25 block font-medium tracking-wide">Senha</label>
              <a href="#" class="text-xs text-white/15 hover:text-white/30 transition-colors">Esqueceu?</a>
            </div>
            <div class="relative">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-10 pr-12 py-2.5 bg-white/3 border border-white/5 rounded-lg text-white placeholder-white/10 transition-all duration-200 focus:outline-none focus:border-white/15"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/30 transition-colors"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10">
            <p class="text-sm text-rose-400/60 leading-relaxed">{{ error }}</p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-white/80 text-sm font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <span v-else>
              Entrar
              <ArrowRight class="w-4 h-4 inline ml-1 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-6 pt-6 border-t border-white/5 text-center">
          <p class="text-xs text-white/15">
            Ainda não tem acesso?
            <router-link to="/access-instructions" class="text-white/25 hover:text-white/40 transition-colors">
              Saiba como criar sua conta
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
