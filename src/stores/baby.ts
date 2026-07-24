import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useBabyStore = defineStore('baby', () => {
  const babies = ref<any[]>([])
  const currentBabyId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const currentBaby = computed(() => {
    return babies.value.find(b => b.id === currentBabyId.value) || null
  })

  const loadBabies = async () => {
    console.log('🔄 [loadBabies] Iniciando...')
    loading.value = true
    error.value = null
    
    try {
      // 1. Verificar usuário
      console.log('🔄 [loadBabies] Verificando usuário...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('❌ [loadBabies] Erro ao buscar usuário:', userError)
        throw new Error('Erro ao buscar usuário: ' + userError.message)
      }
      
      if (!user) {
        console.error('❌ [loadBabies] Usuário não autenticado')
        throw new Error('Usuário não autenticado')
      }
      
      console.log('✅ [loadBabies] Usuário:', user.id, user.email)

      // 2. Buscar perfil
      console.log('🔄 [loadBabies] Buscando perfil...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      console.log('📝 [loadBabies] Perfil:', profile, 'Erro:', profileError)

      // 3. Se não tiver perfil, criar
      if (!profile) {
        console.log('🔄 [loadBabies] Criando perfil...')
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
            })
            .select()
            .single()

          if (createError) {
            console.error('❌ [loadBabies] Erro ao criar perfil:', createError)
            throw createError
          }
          
          console.log('✅ [loadBabies] Perfil criado:', newProfile)
          
          // Buscar ou criar família
          const { data: family, error: familyError } = await supabase
            .from('families')
            .insert({
              name: `Família ${user.email?.split('@')[0] || user.id.slice(0, 8)}`,
              plan: 'free'
            })
            .select()
            .single()

          if (familyError) {
            console.error('❌ [loadBabies] Erro ao criar família:', familyError)
            throw familyError
          }

          console.log('✅ [loadBabies] Família criada:', family)

          // Atualizar perfil com family_id
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ family_id: family.id })
            .eq('id', user.id)

          if (updateError) {
            console.error('❌ [loadBabies] Erro ao atualizar perfil:', updateError)
            throw updateError
          }

          // Buscar bebês
          const { data: babiesData, error: babiesError } = await supabase
            .from('babies')
            .select('*')
            .eq('family_id', family.id)

          if (babiesError) {
            console.error('❌ [loadBabies] Erro ao buscar bebês:', babiesError)
            throw babiesError
          }

          console.log('✅ [loadBabies] Bebês encontrados:', babiesData?.length || 0)
          babies.value = babiesData || []
          
        } catch (err) {
          console.error('❌ [loadBabies] Erro ao criar perfil/família:', err)
          throw err
        }
      } else {
        // 4. Perfil existe, buscar bebês
        console.log('✅ [loadBabies] Perfil encontrado:', profile)
        
        if (!profile.family_id) {
          console.log('🔄 [loadBabies] Perfil sem family_id, criando família...')
          const { data: family, error: familyError } = await supabase
            .from('families')
            .insert({
              name: `Família ${user.email?.split('@')[0] || user.id.slice(0, 8)}`,
              plan: 'free'
            })
            .select()
            .single()

          if (familyError) {
            console.error('❌ [loadBabies] Erro ao criar família:', familyError)
            throw familyError
          }

          await supabase
            .from('profiles')
            .update({ family_id: family.id })
            .eq('id', user.id)

          profile.family_id = family.id
        }

        console.log('🔄 [loadBabies] Buscando bebês da família:', profile.family_id)
        const { data: babiesData, error: babiesError } = await supabase
          .from('babies')
          .select('*')
          .eq('family_id', profile.family_id)

        if (babiesError) {
          console.error('❌ [loadBabies] Erro ao buscar bebês:', babiesError)
          throw babiesError
        }

        console.log('✅ [loadBabies] Bebês encontrados:', babiesData?.length || 0)
        babies.value = babiesData || []
      }

      // 5. Selecionar primeiro bebê
      if (babies.value.length > 0) {
        currentBabyId.value = babies.value[0].id
        console.log('✅ [loadBabies] Bebê selecionado:', currentBabyId.value)
      }

      console.log('✅ [loadBabies] Finalizado com sucesso!')
      
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar bebês'
      console.error('❌ [loadBabies] Erro final:', err)
    } finally {
      loading.value = false
      console.log('🔄 [loadBabies] loading = false')
    }
  }

  const createBaby = async (babyData: any) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: createError } = await supabase
        .from('babies')
        .insert(babyData)
        .select()
        .single()

      if (createError) throw createError

      babies.value.push(data)
      currentBabyId.value = data.id
      return { success: true, data }
    } catch (err: any) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const setCurrentBaby = (id: string) => {
    currentBabyId.value = id
  }

  return {
    babies,
    currentBabyId,
    loading,
    error,
    currentBaby,
    loadBabies,
    createBaby,
    setCurrentBaby,
  }
})
