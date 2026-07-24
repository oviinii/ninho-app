<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { 
  LayoutDashboard, 
  Baby, 
  Calendar, 
  Pill, 
  Syringe, 
  LineChart,
  LogOut,
  User,
  Settings,
  Menu,
  X
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const sidebarOpen = ref(false)
const isMobile = ref(false)

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { name: 'Diário do Bebê', icon: Baby, path: '/app/baby' },
  { name: 'Agenda', icon: Calendar, path: '/app/calendar' },
  { name: 'Medicamentos', icon: Pill, path: '/app/medications' },
  { name: 'Vacinas', icon: Syringe, path: '/app/vaccines' },
  { name: 'Crescimento', icon: LineChart, path: '/app/growth' },
]

const handleLogout = async () => {
  await authStore.signOut()
  router.push('/auth/login')
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    sidebarOpen.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="min-h-screen bg-background flex">
    <!-- Sidebar Mobile Overlay -->
    <div 
      v-if="isMobile && sidebarOpen"
      @click="closeSidebar"
      class="fixed inset-0 bg-black/50 z-40"
    />

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-72 bg-background-surface border-r border-border transition-transform duration-300',
        isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo com botão fechar no mobile -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-border">
          <div class="flex items-center gap-3">
            <span class="text-2xl">👶</span>
            <span class="text-xl font-bold text-white">Ninho App</span>
          </div>
          <button 
            v-if="isMobile"
            @click="closeSidebar"
            class="p-2 rounded-lg hover:bg-background-card transition-colors"
          >
            <X class="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <!-- Navegação -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <router-link
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            @click="closeSidebar"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:text-text hover:bg-background-card transition-all duration-200"
            active-class="text-primary-500 bg-primary-500/10"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ item.name }}</span>
          </router-link>
        </nav>

        <!-- Footer -->
        <div class="border-t border-border p-4 space-y-2">
          <div class="flex items-center gap-3 px-4 py-2">
            <div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-semibold text-primary-500">
                {{ authStore.user?.email?.[0]?.toUpperCase() || 'U' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium truncate">
                {{ authStore.user?.user_metadata?.full_name || 'Usuário' }}
              </p>
              <p class="text-text-secondary text-xs truncate">
                {{ authStore.user?.email }}
              </p>
            </div>
          </div>
          
          <button 
            @click="handleLogout"
            class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-text-secondary hover:text-status-danger hover:bg-status-danger/10 transition-all duration-200"
          >
            <LogOut class="w-5 h-5" />
            <span class="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Conteúdo Principal -->
    <div class="flex-1 lg:ml-72">
      <!-- Header Mobile -->
      <header class="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div class="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div class="flex items-center gap-3">
            <button 
              @click="toggleSidebar"
              class="p-2 rounded-lg hover:bg-background-card transition-colors"
            >
              <Menu class="w-5 h-5 text-text-secondary" />
            </button>
            <span class="text-white font-semibold text-sm md:text-base lg:hidden">
              Ninho App
            </span>
          </div>
          
          <div class="flex items-center gap-2">
            <button class="p-2 rounded-lg hover:bg-background-card transition-colors">
              <Settings class="w-5 h-5 text-text-secondary" />
            </button>
            <div class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary-500/20 flex items-center justify-center">
              <span class="text-xs md:text-sm font-semibold text-primary-500">
                {{ authStore.user?.email?.[0]?.toUpperCase() || 'U' }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Conteúdo com padding responsivo -->
      <main class="p-4 md:p-6 max-w-7xl mx-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
