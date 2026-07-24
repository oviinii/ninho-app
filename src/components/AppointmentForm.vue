<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useBabyStore } from '@/stores/baby'
import { X, Loader2, Calendar, Clock, MapPin, Stethoscope, User } from 'lucide-vue-next'

const props = defineProps<{
  appointment?: any
}>()

const emit = defineEmits(['close', 'saved'])
const babyStore = useBabyStore()

const isEditing = computed(() => !!props.appointment)

const form = ref({
  title: '',
  description: '',
  type: 'consulta',
  location: '',
  start_time: '',
  end_time: '',
  all_day: false,
  reminder: true,
  notes: '',
})

const loading = ref(false)
const error = ref('')

const appointmentTypes = [
  { value: 'consulta', label: 'Consulta Médica', icon: Stethoscope },
  { value: 'exame', label: 'Exame', icon: User },
  { value: 'vacina', label: 'Vacina', icon: Calendar },
  { value: 'evento', label: 'Evento', icon: Calendar },
  { value: 'outro', label: 'Outro', icon: Calendar },
]

const isFormValid = computed(() => {
  return form.value.title && form.value.start_time
})

onMounted(() => {
  if (props.appointment) {
    form.value = {
      title: props.appointment.title || '',
      description: props.appointment.description || '',
      type: props.appointment.type || 'consulta',
      location: props.appointment.location || '',
      start_time: props.appointment.start_time ? props.appointment.start_time.slice(0, 16) : '',
      end_time: props.appointment.end_time ? props.appointment.end_time.slice(0, 16) : '',
      all_day: props.appointment.all_day || false,
      reminder: props.appointment.reminder !== false,
      notes: props.appointment.notes || '',
    }
  } else {
    form.value.start_time = new Date().toISOString().slice(0, 16)
    form.value.end_time = new Date(Date.now() + 3600000).toISOString().slice(0, 16)
  }
})

const handleSubmit = async () => {
  if (!babyStore.currentBaby) {
    error.value = 'Selecione um bebê primeiro'
    return
  }

  if (!isFormValid.value) {
    error.value = 'Preencha o título e a data/hora'
    return
  }

  if (form.value.end_time && new Date(form.value.end_time) <= new Date(form.value.start_time)) {
    error.value = 'O horário de fim deve ser após o início'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const data = {
      baby_id: babyStore.currentBaby.id,
      title: form.value.title,
      description: form.value.description || null,
      type: form.value.type,
      location: form.value.location || null,
      start_time: new Date(form.value.start_time).toISOString(),
      end_time: form.value.end_time ? new Date(form.value.end_time).toISOString() : null,
      all_day: form.value.all_day,
      reminder: form.value.reminder,
      notes: form.value.notes || null,
    }

    let result
    if (isEditing.value) {
      const { data: updatedData, error: updateError } = await supabase
        .from('appointments')
        .update(data)
        .eq('id', props.appointment.id)
        .select()
      
      if (updateError) throw updateError
      result = { data: updatedData, error: null }
    } else {
      const { data: insertedData, error: insertError } = await supabase
        .from('appointments')
        .insert(data)
        .select()
      
      if (insertError) throw insertError
      result = { data: insertedData, error: null }
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
          {{ isEditing ? 'Editar Compromisso' : 'Adicionar Compromisso' }}
        </h2>
        <button @click="emit('close')" class="p-2 rounded-lg hover:bg-background-card transition-colors">
          <X class="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Título *</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Ex: Consulta com pediatra"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Tipo</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="type in appointmentTypes"
              :key="type.value"
              type="button"
              @click="form.type = type.value"
              :class="[
                'p-2 rounded-lg border transition-all duration-200 text-center',
                form.type === type.value 
                  ? 'border-primary-500 bg-primary-500/10 text-primary-500' 
                  : 'border-border hover:border-primary-500/50'
              ]"
            >
              <component :is="type.icon" class="w-5 h-5 mx-auto mb-1" />
              <span class="text-xs">{{ type.label }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Data e Hora de Início *</label>
          <input
            v-model="form.start_time"
            type="datetime-local"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Data e Hora de Fim</label>
          <input
            v-model="form.end_time"
            type="datetime-local"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Local</label>
          <div class="relative">
            <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              v-model="form.location"
              type="text"
              placeholder="Ex: Hospital São Paulo"
              class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Descrição</label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Detalhes adicionais sobre o compromisso..."
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Observações</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Observações importantes..."
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input
              v-model="form.all_day"
              type="checkbox"
              class="rounded border-border bg-background-card text-primary-500 focus:ring-primary-500"
            />
            Dia inteiro
          </label>
          <label class="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input
              v-model="form.reminder"
              type="checkbox"
              class="rounded border-border bg-background-card text-primary-500 focus:ring-primary-500"
            />
            Lembrar
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
