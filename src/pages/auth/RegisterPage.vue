<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    authStore.error = 'Preencha todos os campos'
    return
  }

  if (password.value !== confirmPassword.value) {
    authStore.error = 'As senhas não coincidem'
    return
  }

  if (password.value.length < 6) {
    authStore.error = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  const result = await authStore.signUp(email.value, password.value, name.value)
  
  if (result.success) {
    router.push('/app/dashboard')
  }
}
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-white">Criar conta</h2>
      <p class="text-text-secondary mt-1">Comece sua jornada no Ninho App</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1.5">Nome completo</label>
        <div class="relative">
          <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            v-model="name"
            type="text"
            placeholder="Seu nome"
            class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>
      </div>

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
            placeholder="Mínimo 6 caracteres"
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

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1.5">Confirmar senha</label>
        <div class="relative">
          <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            required
          />
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
          Criar conta
          <ArrowRight class="w-4 h-4 inline" />
        </span>
      </button>
    </form>

    <p class="text-center text-text-secondary mt-6 text-sm">
      Já tem uma conta? 
      <router-link to="/auth/login" class="text-primary-500 hover:text-primary-400 font-medium transition-colors">
        Fazer login
      </router-link>
    </p>
  </div>
</template>
