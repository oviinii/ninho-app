<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useBabyStore } from '@/stores/baby'
import { supabase } from '@/lib/supabase'
import { Plus, ChevronRight } from 'lucide-vue-next'
import MedicationForm from '@/components/MedicationForm.vue'

const babyStore = useBabyStore()
const loading = ref(true)
const showForm = ref(false)
const showEditForm = ref(false)
const editingMedication = ref<any>(null)
const medications = ref<any[]>([])
const filterActive = ref('todos')

const loadMedications = async () => {
  if (!babyStore.currentBaby) return
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('baby_id', babyStore.currentBaby.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    medications.value = data || []
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

const filteredMeds = computed(() => {
  if (filterActive.value === 'todos') return medications.value
  const isActive = filterActive.value === 'active'
  return medications.value.filter(m => (m.active !== false) === isActive)
})

const handleSaved = async () => {
  showForm.value = false
  showEditForm.value = false
  editingMedication.value = null
  await loadMedications()
}

const handleEdit = (med: any) => {
  editingMedication.value = JSON.parse(JSON.stringify(med))
  showEditForm.value = true
}

const handleDelete = async (id: string) => {
  if (!confirm('Excluir este medicamento?')) return
  try {
    await supabase.from('medications').delete().eq('id', id)
    await loadMedications()
  } catch (e) { console.error(e) }
}

const toggleStatus = async (id: string, current: boolean) => {
  try {
    await supabase.from('medications').update({ active: !current }).eq('id', id)
    await loadMedications()
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  await babyStore.loadBabies()
  await loadMedications()
})

watch(() => babyStore.currentBabyId, async () => {
  if (babyStore.currentBabyId) await loadMedications()
})
</script>

<template>
  <div class="pb-20 md:pb-0">
    <!-- Header -->
    <div class="flex items-center justify-between py-3 px-4 border-b border-white/5">
      <div>
        <p class="text-sm font-medium text-white">Medicamentos</p>
        <p class="text-xs text-white/40">Controle a medicação</p>
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
        <div class="flex items-center gap-2">
          <button
            v-for="opt in [{ value: 'todos', label: 'Todos' }, { value: 'active', label: 'Ativos' }, { value: 'inactive', label: 'Finalizados' }]"
            :key="opt.value"
            @click="filterActive = opt.value"
            class="px-3 py-1 rounded-full text-xs transition-colors"
            :class="filterActive === opt.value ? 'bg-white/10 text-white/80' : 'text-white/30 hover:text-white/50'"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Lista -->
      <div class="px-4 py-4">
        <div v-if="filteredMeds.length" class="space-y-2">
          <div 
            v-for="med in filteredMeds" 
            :key="med.id"
            class="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors"
            :class="{ 'opacity-50': med.active === false }"
          >
            <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <span class="text-emerald-500 text-sm">💊</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-sm text-white/80 truncate">{{ med.name }}</p>
                  <p class="text-xs text-white/25">{{ med.dosage }} • {{ med.frequency }}</p>
                  <p v-if="med.instructions" class="text-xs text-white/20 mt-0.5">{{ med.instructions }}</p>
                </div>
                <div class="flex flex-col items-end gap-1 flex-shrink-0">
                  <span class="text-[10px] px-2 py-0.5 rounded-full" :class="med.active !== false ? 'bg-emerald-400/10 text-emerald-400' : 'bg-white/5 text-white/25'">
                    {{ med.active !== false ? 'Ativo' : 'Finalizado' }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <button @click="toggleStatus(med.id, med.active !== false)" class="text-xs text-white/20 hover:text-white/50 transition-colors">
                  {{ med.active !== false ? 'Finalizar' : 'Reativar' }}
                </button>
                <span class="text-white/10">|</span>
                <button @click="handleEdit(med)" class="text-xs text-white/20 hover:text-white/50 transition-colors">Editar</button>
                <span class="text-white/10">|</span>
                <button @click="handleDelete(med.id)" class="text-xs text-white/20 hover:text-rose-400/50 transition-colors">Excluir</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="py-10 text-center">
          <p class="text-sm text-white/20">Nenhum medicamento</p>
        </div>
      </div>
    </div>

    <!-- Sem bebê -->
    <div v-else class="flex flex-col items-center justify-center py-20 px-4">
      <p class="text-white/30 text-sm">Cadastre um bebê para começar</p>
    </div>

    <!-- Modals -->
    <MedicationForm v-if="showForm" :medication="null" @close="showForm = false" @saved="handleSaved" />
    <MedicationForm v-if="showEditForm && editingMedication" :medication="editingMedication" @close="showEditForm = false" @saved="handleSaved" />
  </div>
</template>
