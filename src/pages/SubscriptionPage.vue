<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBabyStore } from '@/stores/baby'
import { caktoService } from '@/services/cakto.service'
import { supabase } from '@/lib/supabase'
import { Loader2, Check, X } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const babyStore = useBabyStore()

const loading = ref(false)
const error = ref('')
const isPremium = ref(false)
const subscriptionStatus = ref('')
const subscriptionExpiresAt = ref('')
const showPaymentModal = ref(false)
const checkoutUrl = ref('')

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

const checkSubscription = async () => {
  if (!authStore.user) return

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', authStore.user.id)
      .single()

    if (profile?.family_id) {
      const { data: family } = await supabase
        .from('families')
        .select('plan, subscription_status, subscription_expires_at')
        .eq('id', profile.family_id)
        .single()

      if (family) {
        isPremium.value = family.plan === 'premium'
        subscriptionStatus.value = family.subscription_status || 'inactive'
        subscriptionExpiresAt.value = family.subscription_expires_at || ''
      }
    }
  } catch (e) {
    console.error('Erro ao verificar assinatura:', e)
  }
}

const handleSubscribe = async () => {
  if (!authStore.user) {
    router.push('/auth/login')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const name = authStore.user.user_metadata?.full_name || authStore.user.email?.split('@')[0] || 'Usuário'
    
    const result = await caktoService.createMonthlyCheckout(
      authStore.user.id,
      authStore.user.email!,
      name
    )

    if (result.checkout_url) {
      // Abrir checkout em nova aba
      window.open(result.checkout_url, '_blank')
      showPaymentModal.value = true
    }
  } catch (err: any) {
    error.value = err.message || 'Erro ao iniciar pagamento'
  } finally {
    loading.value = false
  }
}

const handleCancelSubscription = async () => {
  if (!confirm('Tem certeza que deseja cancelar sua assinatura?')) return

  loading.value = true
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', authStore.user.id)
      .single()

    if (profile?.family_id) {
      const { data: family } = await supabase
        .from('families')
        .select('subscription_id')
        .eq('id', profile.family_id)
        .single()

      if (family?.subscription_id) {
        await caktoService.cancelSubscription(family.subscription_id)
        await checkSubscription()
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Erro ao cancelar assinatura'
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(async () => {
  await authStore.initialize()
  await checkSubscription()
})
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f]">
    <!-- Header -->
    <div class="flex items-center justify-between py-3 px-4 border-b border-white/5">
      <div class="flex items-center gap-3">
        <button @click="router.back()" class="text-white/30 hover:text-white/50 transition-colors">
          ← Voltar
        </button>
        <span class="text-sm font-medium text-white">Assinatura</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <Loader2 class="w-6 h-6 animate-spin text-white/30" />
    </div>

    <!-- Conteúdo -->
    <div v-else class="max-w-md mx-auto px-4 py-8">
      
      <!-- Status atual -->
      <div class="mb-8 p-4 rounded-xl bg-white/5 border border-white/5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-white/40">Status da assinatura</p>
            <p class="text-lg font-medium text-white mt-0.5">
              {{ isPremium ? '✅ Premium' : '📦 Gratuito' }}
            </p>
          </div>
          <div v-if="isPremium && subscriptionExpiresAt" class="text-right">
            <p class="text-xs text-white/20">Renova em</p>
            <p class="text-sm text-white/40">{{ formatDate(subscriptionExpiresAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Plano -->
      <div class="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 class="text-xl font-light text-white">{{ plan.name }}</h2>
        <div class="mt-2">
          <span class="text-3xl font-light text-white">{{ plan.price }}</span>
          <span class="text-sm text-white/30 ml-1">{{ plan.period }}</span>
        </div>

        <ul class="mt-6 space-y-2">
          <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-sm text-white/50">
            <Check class="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {{ feature }}
          </li>
        </ul>

        <button
          v-if="!isPremium"
          @click="handleSubscribe"
          :disabled="loading"
          class="w-full mt-6 py-3 bg-white/10 hover:bg-white/15 rounded-lg text-white/80 font-medium transition-colors disabled:opacity-50"
        >
          {{ loading ? 'Processando...' : 'Assinar agora' }}
        </button>

        <button
          v-else
          @click="handleCancelSubscription"
          :disabled="loading"
          class="w-full mt-6 py-3 bg-white/5 hover:bg-rose-500/10 rounded-lg text-white/30 hover:text-rose-400/70 font-medium transition-colors disabled:opacity-50 text-sm"
        >
          Cancelar assinatura
        </button>
      </div>

      <!-- Benefícios -->
      <div class="mt-6 p-4 rounded-xl bg-white/3 border border-white/5">
        <p class="text-xs text-white/20 text-center leading-relaxed">
          🌟 Assinatura mensal com cancelamento a qualquer momento.
          Seu cartão será cobrado automaticamente a cada mês.
        </p>
      </div>

      <!-- Modal de pagamento -->
      <div v-if="showPaymentModal" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div class="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 max-w-sm w-full">
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">💳</span>
            </div>
            <h3 class="text-white font-medium text-lg">Aguardando pagamento</h3>
            <p class="text-white/30 text-sm mt-1">A janela de pagamento foi aberta em uma nova aba</p>
            <p class="text-white/20 text-xs mt-4">Após concluir o pagamento, sua assinatura será ativada automaticamente</p>
            <button 
              @click="showPaymentModal = false"
              class="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 text-sm transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/10">
        <p class="text-sm text-rose-400/70">{{ error }}</p>
      </div>
    </div>
  </div>
</template>
