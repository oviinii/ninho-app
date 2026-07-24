<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useBabyStore } from '@/stores/baby'
import { X, Loader2 } from 'lucide-vue-next'

const emit = defineEmits(['close', 'saved'])
const babyStore = useBabyStore()

const form = ref({
  type: 'breast_left',
  duration: null as number | null,
  notes: '',
  recorded_at: new Date().toISOString().slice(0, 16),
})

const loading = ref(false)
const error = ref('')

const feedingTypes = [
  { id: 'breast_left', label: 'Seio Esquerdo', icon: '🤱' },
  { id: 'breast_right', label: 'Seio Direito', icon: '🤱' },
  { id: 'bottle', label: 'Mamadeira', icon: '🍼' },
  { id: 'baby_food', label: 'Papinha', icon: '🥣' },
  { id: 'fruit', label: 'Frutas', icon: '🍎' },
]

const handleSubmit = async () => {
  if (!babyStore.currentBaby) {
    error.value = 'Selecione um bebê primeiro'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { error: insertError } = await supabase
      .from('feedings')
      .insert({
        baby_id: babyStore.currentBaby.id,
        type: form.value.type,
        duration: form.value.duration || null,
        notes: form.value.notes || null,
        recorded_at: new Date(form.value.recorded_at).toISOString(),
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
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-background-surface border border-border rounded-2xl max-w-md w-full">
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-xl font-bold text-white">Registrar Mamada</h2>
        <button @click="emit('close')" class="p-2 rounded-lg hover:bg-background-card transition-colors">
          <X class="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-3">Tipo</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="type in feedingTypes"
              :key="type.id"
              type="button"
              @click="form.type = type.id"
              :class="[
                'p-3 rounded-lg border transition-all duration-200 text-center',
                form.type === type.id 
                  ? 'border-primary-500 bg-primary-500/10 text-primary-500' 
                  : 'border-border hover:border-primary-500/50'
              ]"
            >
              <div class="text-2xl">{{ type.icon }}</div>
              <span class="text-xs">{{ type.label }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Data e Hora</label>
          <input
            v-model="form.recorded_at"
            type="datetime-local"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Duração (minutos)</label>
          <input
            v-model.number="form.duration"
            type="number"
            min="0"
            placeholder="Ex: 15"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Observações</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Alguma observação..."
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
