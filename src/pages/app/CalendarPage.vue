<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBabyStore } from '@/stores/baby'
import { supabase } from '@/lib/supabase'
import { Plus, ChevronRight, Filter, X } from 'lucide-vue-next'
import AppointmentForm from '@/components/AppointmentForm.vue'

const router = useRouter()
const babyStore = useBabyStore()
const loading = ref(true)
const showForm = ref(false)
const showEditForm = ref(false)
const editingAppointment = ref<any>(null)
const appointments = ref<any[]>([])
const filterType = ref('todos')
const filterStatus = ref('todos')

const loadAppointments = async () => {
  if (!babyStore.currentBaby) return
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('baby_id', babyStore.currentBaby.id)
      .order('start_time', { ascending: true })
    if (error) throw error
    appointments.value = data || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const getStatus = (app: any) => {
  const now = new Date()
  const start = new Date(app.start_time)
  const end = app.end_time ? new Date(app.end_time) : new Date(start.getTime() + 3600000)
  if (end < now) return { label: 'Realizado', class: 'text-white/25 bg-white/5' }
  if (start <= now && end >= now) return { label: 'Agora', class: 'text-amber-400 bg-amber-400/10' }
  return { label: 'Agendado', class: 'text-emerald-400 bg-emerald-400/10' }
}

const typeColors: Record<string, string> = {
  consulta: 'bg-blue-500/10 text-blue-400',
  exame: 'bg-purple-500/10 text-purple-400',
  vacina: 'bg-emerald-500/10 text-emerald-400',
  evento: 'bg-amber-500/10 text-amber-400',
  outro: 'bg-white/5 text-white/40'
}

const filteredAppointments = computed(() => {
  let result = appointments.value
  if (filterType.value !== 'todos') {
    result = result.filter(a => a.type === filterType.value)
  }
  if (filterStatus.value !== 'todos') {
    result = result.filter(a => getStatus(a).label === 
      (filterStatus.value === 'agendado' ? 'Agendado' : 
       filterStatus.value === 'realizado' ? 'Realizado' : 'Agora'))
  }
  return result
})

const handleSaved = async () => {
  showForm.value = false
  showEditForm.value = false
  editingAppointment.value = null
  await loadAppointments()
}

const handleEdit = (app: any) => {
  editingAppointment.value = JSON.parse(JSON.stringify(app))
  showEditForm.value = true
}

const handleDelete = async (id: string) => {
  if (!confirm('Excluir este compromisso?')) return
  try {
    await supabase.from('appointments').delete().eq('id', id)
    await loadAppointments()
  } catch (e) { console.error(e) }
}

const clearFilters = () => {
  filterType.value = 'todos'
  filterStatus.value = 'todos'
}

onMounted(async () => {
  await babyStore.loadBabies()
  await loadAppointments()
})

watch(() => babyStore.currentBabyId, async () => {
  if (babyStore.currentBabyId) await loadAppointments()
})
</script>

<template>
  <div class="pb-20 md:pb-0">
    <!-- Header -->
    <div class="flex items-center justify-between py-3 px-4 border-b border-white/5">
      <div>
        <p class="text-sm font-medium text-white">Agenda</p>
        <p class="text-xs text-white/40">Gerencie seus compromissos</p>
      </div>
      <button 
        @click="showForm = true"
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
      
      <!-- Filtros -->
      <div class="px-4 py-4">
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            v-for="type in [{ value: 'todos', label: 'Todos' }, { value: 'consulta', label: 'Consulta' }, { value: 'exame', label: 'Exame' }, { value: 'vacina', label: 'Vacina' }, { value: 'evento', label: 'Evento' }]"
            :key="type.value"
            @click="filterType = type.value"
            class="px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors"
            :class="filterType === type.value ? 'bg-white/10 text-white/80' : 'text-white/30 hover:text-white/50'"
          >
            {{ type.label }}
          </button>
          <div class="w-px h-4 bg-white/10 mx-1"></div>
          <button
            v-for="status in [{ value: 'todos', label: 'Todos' }, { value: 'agendado', label: 'Agendados' }, { value: 'andamento', label: 'Agora' }, { value: 'realizado', label: 'Realizados' }]"
            :key="status.value"
            @click="filterStatus = status.value"
            class="px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors"
            :class="filterStatus === status.value ? 'bg-white/10 text-white/80' : 'text-white/30 hover:text-white/50'"
          >
            {{ status.label }}
          </button>
          <button 
            v-if="filterType !== 'todos' || filterStatus !== 'todos'"
            @click="clearFilters"
            class="px-2 py-1 text-xs text-white/20 hover:text-white/40 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Lista -->
      <div class="px-4 py-4">
        <div v-if="filteredAppointments.length" class="space-y-2">
          <div 
            v-for="app in filteredAppointments" 
            :key="app.id"
            class="flex items-start gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              :class="typeColors[app.type] || 'bg-white/5 text-white/40'"
            >
              <span class="text-sm">{{ app.type === 'consulta' ? '🩺' : app.type === 'exame' ? '🔬' : app.type === 'vacina' ? '💉' : '📌' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-sm text-white/80 truncate">{{ app.title }}</p>
                  <p class="text-xs text-white/25">{{ formatDate(app.start_time) }} • {{ formatTime(app.start_time) }}</p>
                  <p v-if="app.location" class="text-xs text-white/20 mt-0.5">📍 {{ app.location }}</p>
                </div>
                <div class="flex items-center gap-1 flex-shrink-0">
                  <span class="text-[10px] px-2 py-0.5 rounded-full" :class="getStatus(app).class">
                    {{ getStatus(app).label }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <button @click="handleEdit(app)" class="text-xs text-white/20 hover:text-white/50 transition-colors">Editar</button>
                <span class="text-white/10">|</span>
                <button @click="handleDelete(app.id)" class="text-xs text-white/20 hover:text-rose-400/50 transition-colors">Excluir</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="py-10 text-center">
          <p class="text-sm text-white/20">Nenhum compromisso encontrado</p>
        </div>
      </div>
    </div>

    <!-- Sem bebê -->
    <div v-else class="flex flex-col items-center justify-center py-20 px-4">
      <p class="text-white/30 text-sm">Cadastre um bebê para começar</p>
    </div>

    <!-- Modals -->
    <AppointmentForm v-if="showForm" :appointment="null" @close="showForm = false" @saved="handleSaved" />
    <AppointmentForm v-if="showEditForm && editingAppointment" :appointment="editingAppointment" @close="showEditForm = false" @saved="handleSaved" />
  </div>
</template>
