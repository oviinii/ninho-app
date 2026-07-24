<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'
import { CheckCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)

onMounted(async () => {
  await authStore.initialize()
  
  // Atualizar status da assinatura
  if (authStore.user) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('family_id')
        .eq('id', authStore.user.id)
        .single()

      if (profile?.family_id) {
        await supabase
          .from('families')
          .update({
            plan: 'premium',
            subscription_status: 'active'
          })
          .eq('id', profile.family_id)
      }
    } catch (e) {
      console.error('Erro ao atualizar assinatura:', e)
    }
  }

  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
    <div class="text-center max-w-sm">
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle class="w-8 h-8 text-emerald-400" />
        </div>
      </div>
      <h1 class="text-2xl font-light text-white">Assinatura ativada! 🎉</h1>
      <p class="text-white/30 text-sm mt-2">
        Sua assinatura do Ninho App Premium foi ativada com sucesso.
        Aproveite todos os benefícios!
      </p>
      <button 
        @click="router.push('/app/dashboard')"
        class="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-white/70 text-sm font-medium transition-colors"
      >
        Ir para o dashboard
      </button>
    </div>
  </div>
</template>
