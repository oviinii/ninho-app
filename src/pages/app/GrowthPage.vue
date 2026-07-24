<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useBabyStore } from '@/stores/baby'
import { supabase } from '@/lib/supabase'
import { Plus, ChevronRight } from 'lucide-vue-next'
import GrowthForm from '@/components/GrowthForm.vue'

const babyStore = useBabyStore()
const loading = ref(true)
const showForm = ref(false)
const showEditForm = ref(false)
const editingGrowth = ref<any>(null)
const growthRecords = ref<any[]>([])

const loadGrowth = async () => {
  if (!babyStore.currentBaby) return
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('growth_records')
      .select('*')
      .eq('baby_id', babyStore.currentBaby.id)
      .order('recorded_at', { ascending: false })
    if (error) throw error
    growthRecords.value = data || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const handleSaved = async () => {
  showForm.value = false
  showEditForm.value = false
  editingGrowth.value = null
  await loadGrowth()
}

const handleEdit = (g: any) => {
  editingGrowth.value = JSON.parse(JSON.stringify(g))
  showEditForm.value = true
}

const handleDelete = async (id: string) => {
  if (!confirm('Excluir este registro?')) return
  try {
    await supabase.from('growth_records').delete().eq('id', id)
    await loadGrowth()
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  await babyStore.loadBabies()
  await loadGrowth()
})

watch(() => babyStore.currentBabyId, async () => {
  if (babyStore.currentBabyId) await loadGrowth()
})
</script>

<template>
  <div class="pb-20 md:pb-0">
    <!-- Header -->
    <div class="flex items-center justify-between py-3 px-4 border-b border-white/5">
      <div>
        <p class="text-sm font-medium text-white">Crescimento</p>
        <p class="text-xs text-white/40">Acompanhe as medidas</p>
      </div>
      <button 
        @click="showForm = true"
        class="px-4 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-white/80 text-sm font-medium transition-colors"
      >
        + Nova
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-6 h-6 border-2 border-white/10 border-t-white/30 rounded-full animate-spin"></div>
    </div>

    <!-- Content -->
    <div v-else-if="babyStore.currentBaby" class="divide-y divide-white/5">
      
      <!-- Última medida destacada -->
      <div v-if="growthRecords.length" class="px-4 py-5">
        <div class="grid grid-cols-3 gap-2">
          <div class="p-3 rounded-lg bg-white/5 text-center">
            <p class="text-xs text-white/30">Peso</p>
            <p class="text-lg font-medium text-white">{{ growthRecords[0]?.weight || '--' }}</p>
            <p class="text-xs text-white/20">kg</p>
          </div>
          <div class="p-3 rounded-lg bg-white/5 text-center">
            <p class="text-xs text-white/30">Altura</p>
            <p class="text-lg font-medium text-white">{{ growthRecords[0]?.height || '--' }}</p>
            <p class="text-xs text-white/20">cm</p>
          </div>
          <div class="p-3 rounded-lg bg-white/5 text-center">
            <p class="text-xs text-white/30">PC</p>
            <p class="text-lg font-medium text-white">{{ growthRecords[0]?.head_circumference || '--' }}</p>
            <p class="text-xs text-white/20">cm</p>
          </div>
        </div>
        <p class="text-xs text-white/20 text-center mt-3">Última medição: {{ formatDate(growthRecords[0]?.recorded_at) }}</p>
      </div>

      <!-- Histórico -->
      <div class="px-4 py-4">
        <h2 class="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Histórico</h2>
        <div v-if="growthRecords.length" class="space-y-2">
          <div 
            v-for="g in growthRecords" 
            :key="g.id"
            class="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors"
          >
            <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <span class="text-emerald-500 text-sm">📏</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-sm text-white/80">{{ formatDate(g.recorded_at) }}</p>
                  <p class="text-xs text-white/25 flex gap-3">
                    <span v-if="g.weight">⚖️ {{ g.weight }} kg</span>
                    <span v-if="g.height">📐 {{ g.height }} cm</span>
                    <span v-if="g.head_circumference">📏 {{ g.head_circumference }} cm</span>
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <button @click="handleEdit(g)" class="text-xs text-white/20 hover:text-white/50 transition-colors">Editar</button>
                <span class="text-white/10">|</span>
                <button @click="handleDelete(g.id)" class="text-xs text-white/20 hover:text-rose-400/50 transition-colors">Excluir</button>
              </div>
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
    <GrowthForm v-if="showForm" :growth="null" @close="showForm = false" @saved="handleSaved" />
    <GrowthForm v-if="showEditForm && editingGrowth" :growth="editingGrowth" @close="showEditForm = false" @saved="handleSaved" />
  </div>
</template>
