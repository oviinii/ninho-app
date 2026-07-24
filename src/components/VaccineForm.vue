<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useBabyStore } from '@/stores/baby'
import { X, Loader2, Syringe, Calendar, MapPin, Hash, AlertCircle } from 'lucide-vue-next'

const props = defineProps<{
  vaccine?: any
}>()

const emit = defineEmits(['close', 'saved'])
const babyStore = useBabyStore()

const isEditing = computed(() => !!props.vaccine)

const form = ref({
  name: '',
  dose: null as number | null,
  batch_number: '',
  clinic: '',
  administered_at: '',
  next_due: '',
  notes: '',
})

const loading = ref(false)
const error = ref('')

const vaccineOptions = [
  { value: 'BCG', label: 'BCG' },
  { value: 'Hepatite B', label: 'Hepatite B' },
  { value: 'Pentavalente', label: 'Pentavalente' },
  { value: 'VIP (Poliomielite)', label: 'VIP (Poliomielite)' },
  { value: 'VOP (Poliomielite)', label: 'VOP (Poliomielite)' },
  { value: 'Pneumocócica 10', label: 'Pneumocócica 10' },
  { value: 'Meningocócica C', label: 'Meningocócica C' },
  { value: 'Febre Amarela', label: 'Febre Amarela' },
  { value: 'Tríplice Viral', label: 'Tríplice Viral' },
  { value: 'Tetra Viral', label: 'Tetra Viral' },
  { value: 'DTP', label: 'DTP' },
  { value: 'Influenza', label: 'Influenza' },
  { value: 'Rotavírus', label: 'Rotavírus' },
  { value: 'Outra', label: 'Outra' },
]

const isFormValid = computed(() => {
  return form.value.name && form.value.administered_at
})

onMounted(() => {
  if (props.vaccine) {
    console.log('📝 Preenchendo formulário com dados da vacina:', props.vaccine)
    form.value = {
      name: props.vaccine.name || '',
      dose: props.vaccine.dose || null,
      batch_number: props.vaccine.batch_number || '',
      clinic: props.vaccine.clinic || '',
      administered_at: props.vaccine.administered_at || '',
      next_due: props.vaccine.next_due || '',
      notes: props.vaccine.notes || '',
    }
  }
})

const handleSubmit = async () => {
  if (!babyStore.currentBaby) {
    error.value = 'Selecione um bebê primeiro'
    return
  }

  if (!isFormValid.value) {
    error.value = 'Preencha o nome da vacina e a data de aplicação'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const data = {
      name: form.value.name,
      dose: form.value.dose || null,
      batch_number: form.value.batch_number || null,
      clinic: form.value.clinic || null,
      administered_at: form.value.administered_at,
      next_due: form.value.next_due || null,
      notes: form.value.notes || null,
    }

    console.log('📤 Dados a serem salvos:', data)

    let result
    if (isEditing.value) {
      console.log('🔄 Atualizando vacina ID:', props.vaccine.id)
      
      // USANDO .select() PARA RETORNAR OS DADOS ATUALIZADOS
      const { data: updatedData, error: updateError } = await supabase
        .from('vaccines')
        .update(data)
        .eq('id', props.vaccine.id)
        .select() // <-- IMPORTANTE: adicionar .select()
      
      if (updateError) {
        console.error('❌ Erro no update:', updateError)
        throw updateError
      }
      
      console.log('✅ Vacina atualizada! Dados retornados:', updatedData)
      result = { data: updatedData, error: null }
    } else {
      console.log('➕ Criando nova vacina...')
      const { data: insertedData, error: insertError } = await supabase
        .from('vaccines')
        .insert({
          ...data,
          baby_id: babyStore.currentBaby.id
        })
        .select()
      
      if (insertError) {
        console.error('❌ Erro no insert:', insertError)
        throw insertError
      }
      
      console.log('✅ Vacina criada! Dados retornados:', insertedData)
      result = { data: insertedData, error: null }
    }

    if (result.error) throw result.error
    
    // Verificar se os dados foram realmente salvos
    console.log('🔍 Verificando se os dados foram salvos...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('vaccines')
      .select('*')
      .eq('id', props.vaccine.id || result.data?.[0]?.id)
      .single()
    
    if (verifyError) {
      console.error('❌ Erro ao verificar:', verifyError)
    } else {
      console.log('✅ Dados verificados no banco:', verifyData)
    }

    emit('saved')
    emit('close')
  } catch (err: any) {
    console.error('❌ Erro ao salvar:', err)
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
          {{ isEditing ? 'Editar Vacina' : 'Registrar Vacina' }}
        </h2>
        <button @click="emit('close')" class="p-2 rounded-lg hover:bg-background-card transition-colors">
          <X class="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Nome da Vacina *</label>
          <div class="relative">
            <Syringe class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <select
              v-model="form.name"
              class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
              required
            >
              <option value="">Selecione a vacina</option>
              <option v-for="opt in vaccineOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Dose</label>
          <input
            v-model.number="form.dose"
            type="number"
            min="1"
            placeholder="Ex: 1, 2, 3..."
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Data de Aplicação *</label>
          <div class="relative">
            <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              v-model="form.administered_at"
              type="date"
              class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Próxima Dose</label>
          <div class="relative">
            <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              v-model="form.next_due"
              type="date"
              class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Número do Lote</label>
          <div class="relative">
            <Hash class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              v-model="form.batch_number"
              type="text"
              placeholder="Ex: 1234567"
              class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Clínica / Local</label>
          <div class="relative">
            <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              v-model="form.clinic"
              type="text"
              placeholder="Ex: Posto de Saúde Central"
              class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Observações</label>
          <div class="relative">
            <AlertCircle class="absolute left-3 top-3 w-4 h-4 text-text-muted" />
            <textarea
              v-model="form.notes"
              rows="2"
              placeholder="Ex: Reação no local, febre após a vacina..."
              class="w-full pl-10 pr-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
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
