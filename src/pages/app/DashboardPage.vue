<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/baby'
import { supabase } from '@/lib/supabase'
import { Plus, ChevronRight } from 'lucide-vue-next'
import BabyForm from '@/components/BabyForm.vue'
import FeedingForm from '@/components/FeedingForm.vue'
import SleepForm from '@/components/SleepForm.vue'
import DiaperForm from '@/components/DiaperForm.vue'

const router = useRouter()
const babyStore = useBabyStore()
const loading = ref(true)
const isPremium = ref(false)

const showBabyForm = ref(false)
const showFeedingForm = ref(false)
const showSleepForm = ref(false)
const showDiaperForm = ref(false)

const feedings = ref<any[]>([])
const sleepRecords = ref<any[]>([])
const diaperChanges = ref<any[]>([])
const upcomingAppointments = ref<any[]>([])

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

const getAgeInMonths = (birthDate: string) => {
  const birth = new Date(birthDate)
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  return months
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short'
  })
}

const checkPremium = async () => {
  if (!babyStore.currentBaby) return
  try {
    const { data: family } = await supabase
      .from('families')
      .select('plan')
      .eq('id', babyStore.currentBaby.family_id)
      .single()
    
    isPremium.value = family?.plan === 'premium'
  } catch (e) {
    console.error(e)
  }
}

const loadData = async () => {
  if (!babyStore.currentBaby) return

  try {
    const babyId = babyStore.currentBaby.id

    const { data: fData } = await supabase
      .from('feedings')
      .select('*')
      .eq('baby_id', babyId)
      .order('recorded_at', { ascending: false })
      .limit(3)
    feedings.value = fData || []

    const { data: sData } = await supabase
      .from('sleep_records')
      .select('*')
      .eq('baby_id', babyId)
      .order('start_time', { ascending: false })
      .limit(3)
    sleepRecords.value = sData || []

    const { data: dData } = await supabase
      .from('diaper_changes')
      .select('*')
      .eq('baby_id', babyId)
      .order('recorded_at', { ascending: false })
      .limit(3)
    diaperChanges.value = dData || []

    const { data: appData } = await supabase
      .from('appointments')
      .select('*')
      .eq('baby_id', babyId)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(3)
    upcomingAppointments.value = appData || []

  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleFeedingSaved = () => {
  showFeedingForm.value = false
  loadData()
}

const handleSleepSaved = () => {
  showSleepForm.value = false
  loadData()
}

const handleDiaperSaved = () => {
  showDiaperForm.value = false
  loadData()
}

const handleBabySaved = () => {
  showBabyForm.value = false
  babyStore.loadBabies()
  loadData()
  checkPremium()
}

const goToSubscription = () => {
  router.push('/subscription')
}

onMounted(async () => {
  await babyStore.loadBabies()
  await loadData()
  await checkPremium()
})
</script>

<template>
  <div class="pb-20 md:pb-0">
    <!-- Cabeçalho com perfil -->
    <div class="px-4 pt-4 pb-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl font-medium text-white/70 border border-white/5">
            {{ babyStore.currentBaby?.name?.[0] || '👶' }}
          </div>
          <div>
            <p class="text-base font-medium text-white">{{ getGreeting() }}</p>
            <div class="flex items-center gap-2 text-sm text-white/40">
              <span>{{ babyStore.currentBaby?.name || 'Nenhum bebê' }}</span>
              <span v-if="babyStore.currentBaby" class="w-1 h-1 rounded-full bg-white/10"></span>
              <span v-if="babyStore.currentBaby">{{ getAgeInMonths(babyStore.currentBaby.birth_date) }} meses</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="goToSubscription"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            :class="isPremium ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/10 text-white/60 hover:bg-white/15'"
          >
            {{ isPremium ? '⭐ Premium' : 'Assinar' }}
          </button>
          <button 
            @click="showBabyForm = true"
            class="w-9 h-9 rounded-full border border-white/10 hover:border-white/20 flex items-center justify-center transition-colors"
            title="Adicionar bebê"
          >
            <Plus class="w-4 h-4 text-white/40" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="w-6 h-6 border-2 border-white/10 border-t-white/30 rounded-full animate-spin"></div>
    </div>

    <!-- Conteúdo -->
    <div v-else-if="babyStore.currentBaby" class="px-4 space-y-6">
      
      <!-- Atalhos rápidos -->
      <div class="grid grid-cols-4 gap-2 pt-3">
        <button 
          @click="showFeedingForm = true"
          class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors active:scale-95"
        >
          <span class="text-2xl">🍼</span>
          <span class="text-[11px] text-white/60 font-medium">Mamada</span>
        </button>
        <button 
          @click="showSleepForm = true"
          class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors active:scale-95"
        >
          <span class="text-2xl">😴</span>
          <span class="text-[11px] text-white/60 font-medium">Sono</span>
        </button>
        <button 
          @click="showDiaperForm = true"
          class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors active:scale-95"
        >
          <span class="text-2xl">🧸</span>
          <span class="text-[11px] text-white/60 font-medium">Fralda</span>
        </button>
        <button 
          @click="router.push('/app/calendar')"
          class="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors active:scale-95"
        >
          <span class="text-2xl">📅</span>
          <span class="text-[11px] text-white/60 font-medium">Agenda</span>
        </button>
      </div>

      <!-- Resumo rápido do dia -->
      <div class="grid grid-cols-3 gap-2">
        <div class="p-3 rounded-xl bg-white/3 border border-white/5">
          <p class="text-xs text-white/25 uppercase tracking-wider">Mamadas</p>
          <p class="text-xl font-light text-white mt-0.5">{{ feedings.length }}</p>
        </div>
        <div class="p-3 rounded-xl bg-white/3 border border-white/5">
          <p class="text-xs text-white/25 uppercase tracking-wider">Sono</p>
          <p class="text-xl font-light text-white mt-0.5">{{ sleepRecords.length }}</p>
        </div>
        <div class="p-3 rounded-xl bg-white/3 border border-white/5">
          <p class="text-xs text-white/25 uppercase tracking-wider">Fraldas</p>
          <p class="text-xl font-light text-white mt-0.5">{{ diaperChanges.length }}</p>
        </div>
      </div>

      <!-- Atividades recentes -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-medium text-white/30 uppercase tracking-wider">Atividades</h2>
          <span class="text-xs text-white/15">hoje</span>
        </div>

        <div class="space-y-1.5">
          <div v-for="feeding in feedings" :key="feeding.id" class="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 hover:bg-white/5 transition-colors cursor-default">
            <div class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <span class="text-emerald-400 text-sm">🍼</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white/70 truncate">
                {{ feeding.type === 'breast_left' ? 'Seio E.' : feeding.type === 'breast_right' ? 'Seio D.' : 'Mamadeira' }}
                <span v-if="feeding.duration" class="text-white/20 text-xs ml-1">{{ feeding.duration }}min</span>
              </p>
              <p class="text-xs text-white/20">{{ formatTime(feeding.recorded_at) }}</p>
            </div>
            <ChevronRight class="w-3.5 h-3.5 text-white/10 flex-shrink-0" />
          </div>

          <div v-for="sleep in sleepRecords" :key="sleep.id" class="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 hover:bg-white/5 transition-colors cursor-default">
            <div class="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <span class="text-indigo-400 text-sm">😴</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white/70 truncate">
                Sono <span class="text-white/20 text-xs ml-1">{{ sleep.quality || 'Bom' }}</span>
              </p>
              <p class="text-xs text-white/20">{{ formatTime(sleep.start_time) }}</p>
            </div>
            <ChevronRight class="w-3.5 h-3.5 text-white/10 flex-shrink-0" />
          </div>

          <div v-for="diaper in diaperChanges" :key="diaper.id" class="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 hover:bg-white/5 transition-colors cursor-default">
            <div class="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <span class="text-amber-400 text-sm">🧸</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white/70 truncate">
                {{ diaper.type === 'wet' ? 'Xixi' : diaper.type === 'soiled' ? 'Cocô' : 'Ambos' }}
              </p>
              <p class="text-xs text-white/20">{{ formatTime(diaper.recorded_at) }}</p>
            </div>
            <ChevronRight class="w-3.5 h-3.5 text-white/10 flex-shrink-0" />
          </div>

          <div v-if="!feedings.length && !sleepRecords.length && !diaperChanges.length" class="py-6 text-center">
            <p class="text-sm text-white/15">Nenhuma atividade hoje</p>
            <p class="text-xs text-white/10 mt-1">Registre algo para começar</p>
          </div>
        </div>
      </div>

      <!-- Próximos compromissos -->
      <div v-if="upcomingAppointments.length">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-medium text-white/30 uppercase tracking-wider">Próximos compromissos</h2>
          <button @click="router.push('/app/calendar')" class="text-xs text-white/15 hover:text-white/30 transition-colors">Ver todos</button>
        </div>
        <div class="space-y-1.5">
          <div v-for="app in upcomingAppointments" :key="app.id" class="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-default">
            <div class="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0">
              <span class="text-rose-400 text-sm">📅</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white/70 truncate">{{ app.title }}</p>
              <p class="text-xs text-white/20">{{ formatDate(app.start_time) }} • {{ formatTime(app.start_time) }}</p>
            </div>
            <ChevronRight class="w-3.5 h-3.5 text-white/10 flex-shrink-0" />
          </div>
        </div>
      </div>

    </div>

    <!-- Estado vazio -->
    <div v-else class="flex flex-col items-center justify-center py-16 px-4">
      <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-4xl mb-4">👶</div>
      <h3 class="text-white/70 font-medium text-lg mb-1">Nenhum bebê cadastrado</h3>
      <p class="text-white/20 text-sm text-center mb-6">Adicione seu bebê para começar a registrar</p>
      <button @click="showBabyForm = true" class="px-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-white/70 text-sm font-medium transition-colors">
        Adicionar bebê
      </button>
    </div>

    <!-- Modais -->
    <BabyForm v-if="showBabyForm" @close="showBabyForm = false" @saved="handleBabySaved" />
    <FeedingForm v-if="showFeedingForm" @close="showFeedingForm = false" @saved="handleFeedingSaved" />
    <SleepForm v-if="showSleepForm" @close="showSleepForm = false" @saved="handleSleepSaved" />
    <DiaperForm v-if="showDiaperForm" @close="showDiaperForm = false" @saved="handleDiaperSaved" />
  </div>
</template>
