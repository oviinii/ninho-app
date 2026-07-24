<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useBabyStore } from '@/stores/baby'
import { supabase } from '@/lib/supabase'
import { Loader2, Plus } from 'lucide-vue-next'
import BabyForm from '@/components/BabyForm.vue'
import FeedingForm from '@/components/FeedingForm.vue'
import SleepForm from '@/components/SleepForm.vue'
import DiaperForm from '@/components/DiaperForm.vue'
import GrowthForm from '@/components/GrowthForm.vue'

const babyStore = useBabyStore()
const activeTab = ref('feedings')
const loading = ref(true)

const showBabyForm = ref(false)
const showFeedingForm = ref(false)
const showSleepForm = ref(false)
const showDiaperForm = ref(false)
const showGrowthForm = ref(false)

const feedings = ref<any[]>([])
const sleepRecords = ref<any[]>([])
const diaperChanges = ref<any[]>([])
const growthRecords = ref<any[]>([])

const tabs = [
  { id: 'feedings', label: '🍼' },
  { id: 'sleep', label: '😴' },
  { id: 'diapers', label: '🧸' },
  { id: 'growth', label: '📏' },
]

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const getFeedingLabel = (type: string) => {
  const map: Record<string, string> = {
    breast_left: 'Seio E.',
    breast_right: 'Seio D.',
    bottle: 'Mamadeira',
    baby_food: 'Papinha',
    fruit: 'Frutas',
    water: 'Água'
  }
  return map[type] || type
}

const getDiaperLabel = (type: string) => {
  const map: Record<string, string> = {
    wet: '💧 Xixi',
    soiled: '💩 Cocô',
    both: '💧💩 Ambos'
  }
  return map[type] || type
}

const loadFeedings = async () => {
  if (!babyStore.currentBaby) return
  try {
    const { data } = await supabase
      .from('feedings')
      .select('*')
      .eq('baby_id', babyStore.currentBaby.id)
      .order('recorded_at', { ascending: false })
      .limit(20)
    feedings.value = data || []
  } catch (e) { console.error(e) }
}

const loadSleep = async () => {
  if (!babyStore.currentBaby) return
  try {
    const { data } = await supabase
      .from('sleep_records')
      .select('*')
      .eq('baby_id', babyStore.currentBaby.id)
      .order('start_time', { ascending: false })
      .limit(20)
    sleepRecords.value = data || []
  } catch (e) { console.error(e) }
}

const loadDiapers = async () => {
  if (!babyStore.currentBaby) return
  try {
    const { data } = await supabase
      .from('diaper_changes')
      .select('*')
      .eq('baby_id', babyStore.currentBaby.id)
      .order('recorded_at', { ascending: false })
      .limit(20)
    diaperChanges.value = data || []
  } catch (e) { console.error(e) }
}

const loadGrowth = async () => {
  if (!babyStore.currentBaby) return
  try {
    const { data } = await supabase
      .from('growth_records')
      .select('*')
      .eq('baby_id', babyStore.currentBaby.id)
      .order('recorded_at', { ascending: false })
      .limit(20)
    growthRecords.value = data || []
  } catch (e) { console.error(e) }
}

const loadData = async () => {
  loading.value = true
  await Promise.all([loadFeedings(), loadSleep(), loadDiapers(), loadGrowth()])
  loading.value = false
}

const handleTabChange = (tab: string) => {
  activeTab.value = tab
  if (tab === 'feedings') loadFeedings()
  else if (tab === 'sleep') loadSleep()
  else if (tab === 'diapers') loadDiapers()
  else if (tab === 'growth') loadGrowth()
}

const handleBabySaved = () => {
  showBabyForm.value = false
  babyStore.loadBabies()
}

const handleFeedingSaved = () => {
  showFeedingForm.value = false
  loadFeedings()
}

const handleSleepSaved = () => {
  showSleepForm.value = false
  loadSleep()
}

const handleDiaperSaved = () => {
  showDiaperForm.value = false
  loadDiapers()
}

const handleGrowthSaved = () => {
  showGrowthForm.value = false
  loadGrowth()
}

onMounted(async () => {
  await babyStore.loadBabies()
  await loadData()
})

watch(() => babyStore.currentBabyId, async () => {
  if (babyStore.currentBabyId) await loadData()
})
</script>

<template>
  <div class="pb-20 md:pb-0">
    <!-- Header -->
    <div class="flex items-center justify-between py-3 px-4 border-b border-white/5">
      <div>
        <p class="text-sm font-medium text-white">Diário</p>
        <p class="text-xs text-white/40">Registros do bebê</p>
      </div>
      <button 
        @click="showFeedingForm = true"
        class="px-4 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-white/80 text-sm font-medium transition-colors"
      >
        + Novo
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-6 h-6 border-2 border-white/10 border-t-white/30 rounded-full animate-spin"></div>
    </div>

    <!-- Content -->
    <div v-else-if="babyStore.currentBaby" class="divide-y divide-white/5">
      
      <!-- Tabs -->
      <div class="flex border-b border-white/5">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTabChange(tab.id)"
          class="flex-1 py-3 text-center text-sm transition-colors relative"
          :class="activeTab === tab.id ? 'text-white/80' : 'text-white/20 hover:text-white/40'"
        >
          {{ tab.label }}
          <div v-if="activeTab === tab.id" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white/20 rounded-full"></div>
        </button>
      </div>

      <!-- Feedings -->
      <div v-if="activeTab === 'feedings'" class="px-4 py-4">
        <div v-if="feedings.length" class="space-y-2">
          <div v-for="f in feedings" :key="f.id" class="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors">
            <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <span class="text-emerald-500 text-sm">🍼</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white/80">{{ getFeedingLabel(f.type) }}</p>
              <p class="text-xs text-white/25">{{ formatDate(f.recorded_at) }} • {{ formatTime(f.recorded_at) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="py-10 text-center">
          <p class="text-sm text-white/20">Nenhuma alimentação registrada</p>
        </div>
      </div>

      <!-- Sleep -->
      <div v-if="activeTab === 'sleep'" class="px-4 py-4">
        <div v-if="sleepRecords.length" class="space-y-2">
          <div v-for="s in sleepRecords" :key="s.id" class="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors">
            <div class="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <span class="text-indigo-500 text-sm">😴</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white/80">Sono</p>
              <p class="text-xs text-white/25">{{ formatDate(s.start_time) }} • {{ formatTime(s.start_time) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="py-10 text-center">
          <p class="text-sm text-white/20">Nenhum sono registrado</p>
        </div>
      </div>

      <!-- Diapers -->
      <div v-if="activeTab === 'diapers'" class="px-4 py-4">
        <div v-if="diaperChanges.length" class="space-y-2">
          <div v-for="d in diaperChanges" :key="d.id" class="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors">
            <div class="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <span class="text-amber-500 text-sm">🧸</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white/80">{{ getDiaperLabel(d.type) }}</p>
              <p class="text-xs text-white/25">{{ formatDate(d.recorded_at) }} • {{ formatTime(d.recorded_at) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="py-10 text-center">
          <p class="text-sm text-white/20">Nenhuma fralda registrada</p>
        </div>
      </div>

      <!-- Growth -->
      <div v-if="activeTab === 'growth'" class="px-4 py-4">
        <div v-if="growthRecords.length" class="space-y-2">
          <div v-for="g in growthRecords" :key="g.id" class="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors">
            <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <span class="text-emerald-500 text-sm">📏</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white/80">{{ formatDate(g.recorded_at) }}</p>
              <p class="text-xs text-white/25 flex gap-2">
                <span v-if="g.weight">⚖️ {{ g.weight }} kg</span>
                <span v-if="g.height">📐 {{ g.height }} cm</span>
              </p>
            </div>
          </div>
        </div>
        <div v-else class="py-10 text-center">
          <p class="text-sm text-white/20">Nenhuma medida registrada</p>
        </div>
      </div>
    </div>

    <!-- Sem bebê -->
    <div v-else class="flex flex-col items-center justify-center py-20 px-4">
      <p class="text-white/30 text-sm">Cadastre um bebê para começar</p>
    </div>

    <!-- Modals -->
    <BabyForm v-if="showBabyForm" @close="showBabyForm = false" @saved="handleBabySaved" />
    <FeedingForm v-if="showFeedingForm" @close="showFeedingForm = false" @saved="handleFeedingSaved" />
    <SleepForm v-if="showSleepForm" @close="showSleepForm = false" @saved="handleSleepSaved" />
    <DiaperForm v-if="showDiaperForm" @close="showDiaperForm = false" @saved="handleDiaperSaved" />
    <GrowthForm v-if="showGrowthForm" @close="showGrowthForm = false" @saved="handleGrowthSaved" />
  </div>
</template>
