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

const handleLogin = async () => {
  if (!email.value || !password.value) {
    authStore.error = 'Preencha todos os campos'
    return
  }

  const result = await authStore.signIn(email.value, password.value)
  
  if (result.success) {
    router.push('/app/dashboard')
  }
}

const handleGoogleLogin = async () => {
  await authStore.signInWithGoogle()
}
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-white">Bem-vindo de volta</h2>
      <p class="text-text-secondary mt-1">Faça login para continuar</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
        <div class="relative">
          <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1.5">Senha</label>
        <div class="relative">
          <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            class="w-full pl-10 pr-12 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            required
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
          >
            <Eye v-if="!showPassword" class="w-4 h-4" />
            <EyeOff v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-if="authStore.error" class="text-sm text-status-danger bg-status-danger/10 px-3 py-2 rounded-lg">
        {{ authStore.error }}
      </div>

      <button 
        type="submit" 
        class="btn-primary w-full btn-lg flex items-center justify-center gap-2"
        :disabled="authStore.loading"
      >
        <Loader2 v-if="authStore.loading" class="w-5 h-5 animate-spin" />
        <span v-else>
          Entrar
          <ArrowRight class="w-4 h-4 inline" />
        </span>
      </button>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-border"></div>
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-text-muted">ou continue com</span>
        </div>
      </div>

      <button
        type="button"
        @click="handleGoogleLogin"
        class="w-full py-2.5 px-4 bg-background-card border border-border rounded-lg text-text hover:bg-background-card/80 transition-colors flex items-center justify-center gap-2"
        :disabled="authStore.loading"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </button>
    </form>

    <p class="text-center text-text-secondary mt-6 text-sm">
      Não tem uma conta? 
      <router-link to="/auth/register" class="text-primary-500 hover:text-primary-400 font-medium transition-colors">
        Criar conta grátis
      </router-link>
    </p>
  </div>
</template>
