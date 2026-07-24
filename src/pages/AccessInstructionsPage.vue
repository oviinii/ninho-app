<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Copy, Check, Mail, User, Key, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const copied = ref(false)
const email = ref('')
const name = ref('')

onMounted(() => {
  // Recuperar dados do checkout
  email.value = sessionStorage.getItem('checkout_email') || ''
  name.value = sessionStorage.getItem('checkout_name') || ''
})

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const goToRegister = () => {
  router.push('/auth/register')
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
    <div class="max-w-lg w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-2xl">👶</span>
          <span class="text-xl font-light text-white">Ninho App</span>
        </div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span class="text-emerald-400 text-xs font-medium">Pagamento confirmado!</span>
        </div>
      </div>

      <!-- Main Card -->
      <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <h1 class="text-xl font-light text-white text-center mb-6">
          🎉 Acesso Liberado!
        </h1>

        <div class="bg-white/5 rounded-lg p-4 mb-6">
          <p class="text-white/40 text-sm text-center">
            Seu pagamento foi confirmado. Agora você precisa criar sua conta no Ninho App para começar a usar.
          </p>
        </div>

        <!-- Dados do Checkout -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
            <User class="w-4 h-4 text-white/20 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-xs text-white/20">Nome</p>
              <p class="text-sm text-white/60 truncate">{{ name || 'Não informado' }}</p>
            </div>
            <button 
              @click="copyToClipboard(name)"
              class="p-1.5 rounded hover:bg-white/5 transition-colors"
            >
              <Copy class="w-3.5 h-3.5 text-white/20 hover:text-white/40" />
            </button>
          </div>

          <div class="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
            <Mail class="w-4 h-4 text-white/20 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-xs text-white/20">Email</p>
              <p class="text-sm text-white/60 truncate">{{ email || 'Não informado' }}</p>
            </div>
            <button 
              @click="copyToClipboard(email)"
              class="p-1.5 rounded hover:bg-white/5 transition-colors"
            >
              <Copy class="w-3.5 h-3.5 text-white/20 hover:text-white/40" />
            </button>
          </div>
        </div>

        <!-- Instruções -->
        <div class="space-y-3 mb-6">
          <p class="text-xs text-white/20 uppercase tracking-wider">📋 Passo a passo</p>
          
          <div class="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <span class="text-emerald-400 text-sm font-medium">1</span>
            <div>
              <p class="text-sm text-white/70">Crie sua conta</p>
              <p class="text-xs text-white/30">Use o mesmo email que você usou no pagamento</p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
            <span class="text-white/30 text-sm font-medium">2</span>
            <div>
              <p class="text-sm text-white/70">Confirme seu email</p>
              <p class="text-xs text-white/30">Você receberá um link de confirmação</p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
            <span class="text-white/30 text-sm font-medium">3</span>
            <div>
              <p class="text-sm text-white/70">Acesse o dashboard</p>
              <p class="text-xs text-white/30">Seu acesso premium já está ativo!</p>
            </div>
          </div>
        </div>

        <!-- Botão Criar Conta -->
        <button
          @click="goToRegister"
          class="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg text-emerald-400 font-medium transition-colors flex items-center justify-center gap-2"
        >
          Criar minha conta agora
          <ArrowRight class="w-4 h-4" />
        </button>

        <p class="text-center text-white/10 text-xs mt-4">
          🔒 Seus dados estão seguros e criptografados
        </p>
      </div>

      <!-- Suporte -->
      <div class="text-center mt-6">
        <p class="text-white/10 text-xs">
          Precisa de ajuda? 
          <a href="#" class="text-white/20 hover:text-white/40 transition-colors">
            Fale com o suporte
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
