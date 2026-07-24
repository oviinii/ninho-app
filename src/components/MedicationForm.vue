<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useBabyStore } from '@/stores/baby'
import { X, Loader2, Pill, Clock, Calendar, AlertCircle } from 'lucide-vue-next'

const props = defineProps<{
  medication?: any
}>()

const emit = defineEmits(['close', 'saved'])
const babyStore = useBabyStore()

const isEditing = computed(() => !!props.medication)

const form = ref({
  name: '',
  dosage: '',
  frequency: '',
  start_date: '',
  end_date: '',
  instructions: '',
  active: true,
})

const loading = ref(false)
const error = ref('')

const frequencyOptions = [
  { value: 'Uma vez ao dia', label: 'Uma vez ao dia' },
  { value: 'Duas vezes ao dia', label: 'Duas vezes ao dia' },
  { value: 'Três vezes ao dia', label: 'Três vezes ao dia' },
  { value: 'Quatro vezes ao dia', label: 'Quatro vezes ao dia' },
  { value: 'A cada 6 horas', label: 'A cada 6 horas' },
  { value: 'A cada 8 horas', label: 'A cada 8 horas' },
  { value: 'A cada 12 horas', label: 'A cada 12 horas' },
  { value: 'Quando necessário', label: 'Quando necessário' },
]

const isFormValid = computed(() => {
  return form.value.name && form.value.dosage && form.value.frequency
})

onMounted(() => {
  if (props.medication) {
    form.value = {
      name: props.medication.name || '',
      dosage: props.medication.dosage || '',
      frequency: props.medication.frequency || '',
      start_date: props.medication.start_date || '',
      end_date: props.medication.end_date || '',
      instructions: props.medication.instructions || '',
      active: props.medication.active !== false,
    }
  }
})

const handleSubmit = async () => {
  if (!babyStore.currentBaby) {
    error.value = 'Selecione um bebê primeiro'
    return
  }

  if (!isFormValid.value) {
    error.value = 'Preencha o nome, dosagem e frequência'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const data = {
      baby_id: babyStore.currentBaby.id,
      name: form.value.name,
      dosage: form.value.dosage,
      frequency: form.value.frequency,
      start_date: form.value.start_date || null,
      end_date: form.value.end_date || null,
      instructions: form.value.instructions || null,
      active: form.value.active,
    }

    let result
    if (isEditing.value) {
      const { error: updateError } = await supabase
        .from('medications')
        .update(data)
        .eq('id', props.medication.id)
      
      result = { error: updateError }
    } else {
      const { error: insertError } = await supabase
        .from('medications')
        .insert(data)
      
      result = { error: insertError }
    }

    if (result.error) throw result.error

    emit('saved')
    emit('close')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-background-surface border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-xl font-bold text-white">
          {{ isEditing ? 'Editar Medicamento' : 'Adicionar Medicamento' }}
        </h2>
        <button @click="emit('close')" class="p-2 rounded-lg hover:bg-background-card transition-colors">
          <X class="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Nome do Medicamento *</label>
          <div class="relative">
            <Pill class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              v-model="form.name"
              type="text"
              placeholder="Ex: Dipirona"
              class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Dosagem *</label>
          <input
            v-model="form.dosage"
            type="text"
            placeholder="Ex: 20mg/kg"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Frequência *</label>
          <div class="relative">
            <Clock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <select
              v-model="form.frequency"
              class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              required
            >
              <option value="">Selecione a frequência</option>
              <option v-for="opt in frequencyOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1.5">Data de Início</label>
            <div class="relative">
              <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                v-model="form.start_date"
                type="date"
                class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-text-secondary mb-1.5">Data de Fim</label>
            <div class="relative">
              <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                v-model="form.end_date"
                type="date"
                class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Instruções</label>
          <div class="relative">
            <AlertCircle class="absolute left-3 top-3 w-4 h-4 text-text-muted" />
            <textarea
              v-model="form.instructions"
              rows="2"
              placeholder="Ex: Tomar após as refeições"
              class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <label class="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input
              v-model="form.active"
              type="checkbox"
              class="rounded border-border bg-background-card text-primary-500 focus:ring-primary-500"
            />
            Medicamento ativo
          </label>
        </div>

        <div v-if="error" class="text-sm text-status-danger bg-status-danger/10 px-3 py-2 rounded-lg">
          {{ error }}
        </div>

        <div class="flex gap-3 pt-4">
          <button type="button" @click="emit('close')" class="flex-1 px-4 py-2.5 border border-border rounded-lg text-text-secondary hover:text-text hover:bg-background-card transition-all duration-200">
            Cancelar
          </button>
          <button type="submit" class="flex-1 btn-primary flex items-center justify-center gap-2" :disabled="loading">
            <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
            <span v-else>{{ isEditing ? 'Atualizar' : 'Salvar' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
