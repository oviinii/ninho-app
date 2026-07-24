<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useBabyStore } from '@/stores/baby'
import { supabase } from '@/lib/supabase'
import { Plus, ChevronRight } from 'lucide-vue-next'
import VaccineForm from '@/components/VaccineForm.vue'

const babyStore = useBabyStore()
const loading = ref(true)
const showForm = ref(false)
const showEditForm = ref(false)
const editingVaccine = ref<any>(null)
const vaccines = ref<any[]>([])
const filterStatus = ref('todos')

const loadVaccines = async () => {
  if (!babyStore.currentBaby) return
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('vaccines')
      .select('*')
      .eq('baby_id', babyStore.currentBaby.id)
      .order('administered_at', { ascending: false })
    if (error) throw error
    vaccines.value = data || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const isOverdue = (v: any) => {
  if (!v.next_due) return false
  return new Date(v.next_due) < new Date()
}

const isUpcoming = (v: any) => {
  if (!v.next_due) return false
  const diff = new Date(v.next_due).getTime() - new Date().getTime()
  return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000
}

const getStatus = (v: any) => {
  if (isOverdue(v)) return { label: 'Vencida', class: 'text-rose-400 bg-rose-400/10' }
  if (isUpcoming(v)) return { label: 'Próxima', class: 'text-amber-400 bg-amber-400/10' }
  return { label: 'Em dia', class: 'text-emerald-400 bg-emerald-400/10' }
}

const filteredVaccines = computed(() => {
  let result = vaccines.value
  if (filterStatus.value === 'overdue') result = result.filter(v => isOverdue(v))
  else if (filterStatus.value === 'upcoming') result = result.filter(v => isUpcoming(v))
  else if (filterStatus.value === 'upToDate') result = result.filter(v => !isOverdue(v) && !isUpcoming(v))
  return result
})

const handleSaved = async () => {
  showForm.value = false
  showEditForm.value = false
  editingVaccine.value = null
  await loadVaccines()
}

const handleEdit = (v: any) => {
  editingVaccine.value = JSON.parse(JSON.stringify(v))
  showEditForm.value = true
}

const handleDelete = async (id: string) => {
  if (!confirm('Excluir esta vacina?')) return
  try {
    await supabase.from('vaccines').delete().eq('id', id)
    await loadVaccines()
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  await babyStore.loadBabies()
  await loadVaccines()
})

watch(() => babyStore.currentBabyId, async () => {
  if (babyStore.currentBabyId) await loadVaccines()
})
</script>

<template>
  <div class="pb-20 md:pb-0">
    <!-- Header -->
    <div class="flex items-center justify-between py-3 px-4 border-b border-white/5">
      <div>
        <p class="text-sm font-medium text-white">Vacinas</p>
        <p class="text-xs text-white/40">Calendário vacinal</p>
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
      
      <!-- Filtros -->
      <div class="px-4 py-4">
        <div class="flex items-center gap-2">
          <button
            v-for="opt in [{ value: 'todos', label: 'Todos' }, { value: 'overdue', label: 'Vencidas' }, { value: 'upcoming', label: 'Próximas' }, { value: 'upToDate', label: 'Em dia' }]"
            :key="opt.value"
            @click="filterStatus = opt.value"
            class="px-3 py-1 rounded-full text-xs transition-colors"
            :class="filterStatus === opt.value ? 'bg-white/10 text-white/80' : 'text-white/30 hover:text-white/50'"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Lista -->
      <div class="px-4 py-4">
        <div v-if="filteredVaccines.length" class="space-y-2">
          <div 
            v-for="v in filteredVaccines" 
            :key="v.id"
            class="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors"
          >
            <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <span class="text-emerald-500 text-sm">💉</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-sm text-white/80 truncate">{{ v.name }}</p>
                  <p class="text-xs text-white/25">
                    Aplicação: {{ formatDate(v.administered_at) }}
                    <span v-if="v.next_due">• Próxima: {{ formatDate(v.next_due) }}</span>
                  </p>
                  <p v-if="v.clinic" class="text-xs text-white/20 mt-0.5">📍 {{ v.clinic }}</p>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap" :class="getStatus(v).class">
                  {{ getStatus(v).label }}
                </span>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <button @click="handleEdit(v)" class="text-xs text-white/20 hover:text-white/50 transition-colors">Editar</button>
                <span class="text-white/10">|</span>
                <button @click="handleDelete(v.id)" class="text-xs text-white/20 hover:text-rose-400/50 transition-colors">Excluir</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="py-10 text-center">
          <p class="text-sm text-white/20">Nenhuma vacina registrada</p>
        </div>
      </div>
    </div>

    <!-- Sem bebê -->
    <div v-else class="flex flex-col items-center justify-center py-20 px-4">
      <p class="text-white/30 text-sm">Cadastre um bebê para começar</p>
    </div>

    <!-- Modals -->
    <VaccineForm v-if="showForm" :vaccine="null" @close="showForm = false" @saved="handleSaved" />
    <VaccineForm v-if="showEditForm && editingVaccine" :vaccine="editingVaccine" @close="showEditForm = false" @saved="handleSaved" />
  </div>
</template>
