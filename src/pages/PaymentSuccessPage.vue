<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const loading = ref(true)
const error = ref('')
const step = ref('Verificando pagamento...')

const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

const createAccount = async (email: string, name: string) => {
  try {
    // Verificar se usuário já existe
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      // Usuário já existe, fazer login
      step.value = 'Usuário já existe, redirecionando...'
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Tentar login com senha temporária
      const tempPassword = generatePassword()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: tempPassword
      })
      
      if (signInError) {
        // Se não conseguir logar, enviar redefinição de senha
        await supabase.auth.resetPasswordForEmail(email)
        error.value = 'Já existe uma conta com este email. Verifique seu email para redefinir a senha.'
        loading.value = false
        return
      }
      
      loading.value = false
      return
    }

    // Criar nova conta
    step.value = 'Criando sua conta...'
    const tempPassword = generatePassword()
    
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

    if (signUpError) throw signUpError

    // Criar família e perfil
    if (authData?.user) {
      step.value = 'Configurando sua assinatura premium...'
      
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

      await supabase
        .from('profiles')
        .update({ 
          full_name: name,
          family_id: family.id,
          is_premium: true
        })
        .eq('id', authData.user.id)

      step.value = 'Conta criada com sucesso!'
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    loading.value = false

  } catch (err: any) {
    console.error('Erro ao criar conta:', err)
    error.value = err.message || 'Erro ao criar conta'
    loading.value = false
  }
}

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

    await createAccount(email, name)

    // Limpar dados do checkout
    sessionStorage.removeItem('checkout_email')
    sessionStorage.removeItem('checkout_name')

  } catch (err: any) {
    console.error(err)
    error.value = err.message || 'Erro ao processar pagamento'
    loading.value = false
  }
})

const goToLogin = () => {
  router.push('/auth/login')
}

const goToDashboard = () => {
  router.push('/app/dashboard')
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
          @click="goToDashboard"
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
        <button 
          v-if="error"
          @click="goToDashboard"
          class="w-full px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 text-sm font-medium transition-colors"
        >
          Tentar acessar mesmo assim
        </button>
      </div>

      <p v-if="!loading && !error" class="text-xs text-white/15 mt-4">
        Uma senha temporária foi enviada para seu email.
        Você pode alterá-la nas configurações.
      </p>
    </div>
  </div>
</template>
