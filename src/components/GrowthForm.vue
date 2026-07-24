<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useBabyStore } from '@/stores/baby'
import { X, Loader2 } from 'lucide-vue-next'

const emit = defineEmits(['close', 'saved'])
const babyStore = useBabyStore()

const form = ref({
  weight: null as number | null,
  height: null as number | null,
  head_circumference: null as number | null,
  recorded_at: new Date().toISOString().split('T')[0],
  notes: '',
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!babyStore.currentBaby) {
    error.value = 'Selecione um bebê primeiro'
    return
  }

  if (!form.value.weight && !form.value.height && !form.value.head_circumference) {
    error.value = 'Preencha pelo menos uma medida'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { error: insertError } = await supabase
      .from('growth_records')
      .insert({
        baby_id: babyStore.currentBaby.id,
        weight: form.value.weight || null,
        height: form.value.height || null,
        head_circumference: form.value.head_circumference || null,
        recorded_at: form.value.recorded_at,
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
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-background-surface border border-border rounded-2xl max-w-md w-full">
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-xl font-bold text-white">Registrar Medidas</h2>
        <button @click="emit('close')" class="p-2 rounded-lg hover:bg-background-card transition-colors">
          <X class="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Data da medição</label>
          <input
            v-model="form.recorded_at"
            type="date"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Peso (kg)</label>
          <input
            v-model.number="form.weight"
            type="number"
            step="0.01"
            min="0"
            placeholder="Ex: 3.5"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Altura (cm)</label>
          <input
            v-model.number="form.height"
            type="number"
            step="0.1"
            min="0"
            placeholder="Ex: 50.0"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Perímetro Cefálico (cm)</label>
          <input
            v-model.number="form.head_circumference"
            type="number"
            step="0.1"
            min="0"
            placeholder="Ex: 35.0"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Observações</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Alguma observação sobre as medidas..."
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
