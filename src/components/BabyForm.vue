<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useBabyStore } from '@/stores/baby'
import { X, Loader2 } from 'lucide-vue-next'

const emit = defineEmits(['close', 'saved'])
const babyStore = useBabyStore()

const form = ref({
  name: '',
  birth_date: '',
  gender: 'female' as 'male' | 'female' | 'other' | null,
  blood_type: '',
  allergies: '',
  notes: '',
})

const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!form.value.name || !form.value.birth_date) {
    error.value = 'Preencha o nome e data de nascimento'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    // Buscar family_id do perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('family_id')
      .eq('id', user.id)
      .single()

    if (!profile?.family_id) {
      // Criar família se não existir
      const { data: family } = await supabase
        .from('families')
        .insert({ name: `Família ${user.email}` })
        .select()
        .single()
      
      if (!family) throw new Error('Erro ao criar família')
      
      // Atualizar perfil
      await supabase
        .from('profiles')
        .update({ family_id: family.id })
        .eq('id', user.id)
      
      profile.family_id = family.id
    }

    const result = await babyStore.createBaby({
      family_id: profile.family_id,
      name: form.value.name,
      birth_date: form.value.birth_date,
      gender: form.value.gender || null,
      blood_type: form.value.blood_type || null,
      allergies: form.value.allergies ? form.value.allergies.split(',').map(a => a.trim()) : null,
      notes: form.value.notes || null,
      photo_url: null,
    })

    if (result.success) {
      emit('saved')
      emit('close')
    } else {
      error.value = result.error || 'Erro ao cadastrar bebê'
    }
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
        <h2 class="text-xl font-bold text-white">Cadastrar Bebê</h2>
        <button @click="emit('close')" class="p-2 rounded-lg hover:bg-background-card transition-colors">
          <X class="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Nome do bebê *</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Digite o nome"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Data de nascimento *</label>
          <input
            v-model="form.birth_date"
            type="date"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Sexo</label>
          <div class="flex gap-3">
            <button
              v-for="option in [{ value: 'female', label: 'Menina' }, { value: 'male', label: 'Menino' }, { value: 'other', label: 'Outro' }]"
              :key="option.value"
              type="button"
              @click="form.gender = option.value as any"
              :class="[
                'flex-1 px-4 py-2 rounded-lg border transition-all duration-200',
                form.gender === option.value 
                  ? 'border-primary-500 bg-primary-500/10 text-primary-500' 
                  : 'border-border text-text-secondary hover:border-primary-500/50'
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Tipo sanguíneo</label>
          <select
            v-model="form.blood_type"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Selecione</option>
            <option v-for="type in ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Alergias</label>
          <input
            v-model="form.allergies"
            type="text"
            placeholder="Ex: Leite, Ovo (separar por vírgula)"
            class="w-full px-4 py-2.5 bg-background-card border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1.5">Observações</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Informações adicionais..."
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
            <span v-else>Cadastrar</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
