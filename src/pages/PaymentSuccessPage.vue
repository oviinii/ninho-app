<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { CheckCircle, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')
const step = ref('Verificando pagamento...')

onMounted(async () => {
  try {
    // Buscar dados do checkout
    const email = sessionStorage.getItem('checkout_email')
    const name = sessionStorage.getItem('checkout_name')
    
    if (!email || !name) {
      error.value = 'Dados não encontrados. Tente novamente.'
      loading.value = false
      return
    }

    step.value = 'Criando sua conta...'
    
    // Criar conta do usuário
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'
    
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: tempPassword,
      options: {
        data: { 
          full_name: name,
          is_premium: true
        }
      }
    })

    if (signUpError) {
      // Se o usuário já existe, tentar login
      step.value = 'Usuário já existe, fazendo login...'
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: tempPassword
      })
      
      if (signInError) {
        // Se não conseguir logar, enviar email de recuperação
        step.value = 'Enviando instruções para seu email...'
        await supabase.auth.resetPasswordForEmail(email)
        error.value = 'Já existe uma conta com este email. Verifique seu email para redefinir a senha.'
        loading.value = false
        return
      }
    }

    // Atualizar perfil como premium
    if (authData?.user) {
      step.value = 'Ativando sua assinatura...'
      
      // Criar família
      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({
          name: `Família ${name}`,
          plan: 'premium',
          subscription_status: 'active'
        })
        .select()
        .single()

      if (familyError) throw familyError

      // Atualizar perfil
      await supabase
        .from('profiles')
        .update({ 
          full_name: name,
          family_id: family.id 
        })
        .eq('id', authData.user.id)

      step.value = 'Conta criada com sucesso!'
    }

    // Limpar dados do checkout
    sessionStorage.removeItem('checkout_email')
    sessionStorage.removeItem('checkout_name')

    await new Promise(resolve => setTimeout(resolve, 1000))
    loading.value = false

  } catch (err: any) {
    console.error(err)
    error.value = err.message || 'Erro ao criar conta'
    loading.value = false
  }
})

const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
    <div class="text-center max-w-sm">
      <div v-if="!error" class="flex justify-center mb-6">
        <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle v-if="!loading" class="w-8 h-8 text-emerald-400" />
          <Loader2 v-else class="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      </div>

      <div v-if="error" class="flex justify-center mb-6">
        <div class="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
          <span class="text-2xl">⚠️</span>
        </div>
      </div>

      <h1 class="text-2xl font-light text-white">
        {{ error ? 'Atenção' : loading ? 'Processando...' : '🎉 Tudo pronto!' }}
      </h1>
      
      <p v-if="loading" class="text-white/30 text-sm mt-2">
        {{ step }}
      </p>
      
      <p v-else-if="error" class="text-white/30 text-sm mt-2">
        {{ error }}
      </p>
      
      <p v-else class="text-white/30 text-sm mt-2">
        Sua conta foi criada com sucesso! Você já tem acesso premium.
      </p>

      <div v-if="!loading" class="mt-6 space-y-3">
        <button 
          v-if="!error"
          @click="router.push('/app/dashboard')"
          class="w-full px-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-white/70 text-sm font-medium transition-colors"
        >
          Ir para o dashboard
        </button>
        <button 
          v-if="error"
          @click="goToLogin"
          class="w-full px-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-white/70 text-sm font-medium transition-colors"
        >
          Ir para o login
        </button>
      </div>

      <p v-if="!loading && !error" class="text-xs text-white/15 mt-4">
        Uma senha temporária foi enviada para seu email.
        Você pode alterá-la nas configurações.
      </p>
    </div>
  </div>
</template>
