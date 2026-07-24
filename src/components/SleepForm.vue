<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useBabyStore } from '@/stores/baby'
import { X, Loader2 } from 'lucide-vue-next'

const emit = defineEmits(['close', 'saved'])
const babyStore = useBabyStore()

const form = ref({
  start_time: new Date().toISOString().slice(0, 16),
  end_time: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
  quality: 'good',
  notes: '',
})

const loading = ref(false)
const error = ref('')

const qualityOptions = [
  { value: 'excellent', label: 'Excelente', icon: '🌟' },
  { value: 'good', label: 'Bom', icon: '👍' },
  { value: 'fair', label: 'Regular', icon: '😐' },
  { value: 'poor', label: 'Ruim', icon: '😟' },
]

const handleSubmit = async () => {
  if (!babyStore.currentBaby) {
    error.value = 'Selecione um bebê primeiro'
    return
  }

  if (new Date(form.value.end_time) <= new Date(form.value.start_time)) {
    error.value = 'O horário de fim deve ser após o início'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { error: insertError } = await supabase
      .from('sleep_records')
      .insert({
        baby_id: babyStore.currentBaby.id,
        start_time: new Date(form.value.start_time).toISOString(),
        end_time: new Date(form.value.end_time).toISOString(),
        quality: form.value.quality,
        notes: form.value.notes || null,
      })

    if (insertError) throw insertError

    emit('saved')
    emit('close')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const calculateDuration = () => {
  const start = new Date(form.value.start_time)
  const end = new Date(form.value.end_time)
  const diff = (end.getTime() - start.getTime()) / 1000 / 60
  return Math.round(diff)
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-background-surface border border-border rounded-2xl max-w-md w-full">
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-xl font-bold text-white">Registrar Sono</h2>
        <button @click="emit('close')" class="p-2 rounded-lg hover:bg-background-card transition-colors">
          <X class="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Início do sono</label>
          <input
            v-model="form.start_time"
            type="datetime-local"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Fim do sono</label>
          <input
            v-model="form.end_time"
            type="datetime-local"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div v-if="form.start_time && form.end_time" class="bg-background-card rounded-lg p-3 text-center">
          <p class="text-text-secondary text-sm">Duração estimada</p>
          <p class="text-white text-xl font-bold">{{ calculateDuration() }} minutos</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-3">Qualidade do sono</label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="option in qualityOptions"
              :key="option.value"
              type="button"
              @click="form.quality = option.value"
              :class="[
                'p-2 rounded-lg border transition-all duration-200 text-center',
                form.quality === option.value 
                  ? 'border-primary-500 bg-primary-500/10' 
                  : 'border-border hover:border-primary-500/50'
              ]"
            >
              <div class="text-xl">{{ option.icon }}</div>
              <span class="text-xs text-text-secondary">{{ option.label }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Observações</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Alguma observação sobre o sono..."
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
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
            <span v-else>Salvar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
