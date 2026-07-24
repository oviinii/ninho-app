<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowRight, 
  Baby, 
  Calendar, 
  Pill, 
  Syringe, 
  Users,
  Shield,
  Smartphone,
  Clock,
  Star,
  CheckCircle,
  ChevronRight,
  Heart,
  TrendingUp,
  Award,
  Zap,
  LogIn,
  Sparkles,
  Mail,
  MessageCircle
} from 'lucide-vue-next'

const router = useRouter()
const currentYear = ref(new Date().getFullYear())
const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
})

const features = [
  {
    icon: Baby,
    title: 'Diário do Bebê',
    description: 'Registre alimentação, sono, fraldas e acompanhe o desenvolvimento diário do seu bebê',
    color: 'from-emerald-500/20 to-emerald-500/5'
  },
  {
    icon: TrendingUp,
    title: 'Crescimento',
    description: 'Acompanhe peso, altura e perímetro cefálico com gráficos detalhados',
    color: 'from-blue-500/20 to-blue-500/5'
  },
  {
    icon: Calendar,
    title: 'Agenda Inteligente',
    description: 'Gerencie consultas, vacinas e compromissos com lembretes automáticos',
    color: 'from-purple-500/20 to-purple-500/5'
  },
  {
    icon: Pill,
    title: 'Medicamentos',
    description: 'Controle a medicação do seu bebê com lembretes de horários',
    color: 'from-rose-500/20 to-rose-500/5'
  },
  {
    icon: Syringe,
    title: 'Vacinas',
    description: 'Calendário vacinal completo com alertas de próximas doses',
    color: 'from-amber-500/20 to-amber-500/5'
  },
  {
    icon: Users,
    title: 'Família Conectada',
    description: 'Compartilhe informações com toda a família em um só lugar',
    color: 'from-indigo-500/20 to-indigo-500/5'
  }
]

const testimonials = [
  {
    name: 'Mariana Silva',
    role: 'Mãe da Laura (6 meses)',
    text: 'O Ninho App transformou a forma como acompanho o desenvolvimento da minha filha. Todas as informações em um só lugar!',
    rating: 5,
    avatar: 'M'
  },
  {
    name: 'Rafael Oliveira',
    role: 'Pai do Miguel (1 ano)',
    text: 'Excelente ferramenta para organização familiar. As notificações de vacinas são um salva-vidas!',
    rating: 5,
    avatar: 'R'
  },
  {
    name: 'Fernanda Costa',
    role: 'Mãe da Sofia (3 meses)',
    text: 'Interface linda e intuitiva. Recomendo para todas as mães que querem organizar a rotina do bebê.',
    rating: 5,
    avatar: 'F'
  }
]

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
    
    <!-- HERO SECTION -->
    <section class="relative px-4 pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      <!-- Background decorations -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <!-- Floating particles -->
        <div class="absolute top-20 left-10 w-2 h-2 bg-emerald-400/20 rounded-full animate-float"></div>
        <div class="absolute top-40 right-20 w-3 h-3 bg-purple-400/20 rounded-full animate-float" style="animation-delay: 1s"></div>
        <div class="absolute bottom-20 left-1/3 w-2 h-2 bg-blue-400/20 rounded-full animate-float" style="animation-delay: 0.5s"></div>
      </div>

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <!-- Left Column -->
          <div 
            class="text-center md:text-left"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400/70 mb-4 md:mb-6 animate-pulse">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              +500 famílias confiam
            </div>

            <!-- Headline -->
            <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.1] tracking-tight mb-4">
              Cuide do seu bebê com
              <span class="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block">
                amor e tecnologia
              </span>
            </h1>

            <!-- Subheadline -->
            <p class="text-white/30 text-sm md:text-base max-w-md mx-auto md:mx-0 leading-relaxed mb-6">
              O ecossistema completo para acompanhar o desenvolvimento do seu bebê, 
              registrar momentos especiais e conectar toda a família.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button 
                @click="router.push('/checkout')"
                class="group px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 hover:from-emerald-500/30 hover:to-emerald-500/20 rounded-lg text-white/80 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 border border-emerald-500/20 hover:border-emerald-500/30 hover:scale-[1.02]"
              >
                <Sparkles class="w-4 h-4 text-emerald-400" />
                Assinar agora
                <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button 
                @click="scrollToSection('features')"
                class="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 text-sm transition-all duration-300 hover:text-white/60"
              >
                Conhecer funcionalidades
              </button>
            </div>

            <!-- Trust indicators -->
            <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-6 text-xs text-white/20">
              <span class="flex items-center gap-1.5"><Shield class="w-3.5 h-3.5" /> Dados seguros</span>
              <span class="flex items-center gap-1.5"><Smartphone class="w-3.5 h-3.5" /> 100% Mobile</span>
              <span class="flex items-center gap-1.5"><Clock class="w-3.5 h-3.5" /> Suporte 24/7</span>
            </div>

            <!-- Login Link -->
            <div class="mt-6 flex items-center justify-center md:justify-start gap-2 text-xs text-white/20 hover:text-white/40 transition-colors cursor-pointer" @click="router.push('/auth/login')">
              <LogIn class="w-3.5 h-3.5" />
              <span>Já tem uma conta? <span class="text-emerald-400/50 hover:text-emerald-400">Faça login</span></span>
            </div>
          </div>

          <!-- Right Column - Dashboard Preview -->
          <div 
            class="relative"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <div class="aspect-[4/3] rounded-xl bg-gradient-to-br from-white/5 to-white/3 border border-white/5 overflow-hidden p-4 backdrop-blur-sm">
              <div class="grid grid-cols-3 gap-3 h-full">
                <div class="col-span-2 space-y-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/30 to-emerald-400/10"></div>
                    <div class="flex-1">
                      <div class="h-3 w-24 bg-white/10 rounded animate-pulse"></div>
                      <div class="h-2 w-16 bg-white/5 rounded mt-1"></div>
                    </div>
                  </div>
                  <div class="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-lg p-3 space-y-2 border border-emerald-500/10">
                    <div class="h-2 w-20 bg-white/10 rounded"></div>
                    <div class="h-6 w-16 bg-gradient-to-r from-emerald-400/30 to-emerald-400/10 rounded"></div>
                    <div class="h-2 w-24 bg-white/5 rounded"></div>
                  </div>
                  <div class="grid grid-cols-3 gap-2">
                    <div class="bg-white/5 rounded-lg p-2 text-center hover:bg-white/10 transition-colors cursor-default">
                      <div class="text-lg mb-1">🍼</div>
                      <div class="h-2 w-8 bg-white/10 rounded mx-auto"></div>
                    </div>
                    <div class="bg-white/5 rounded-lg p-2 text-center hover:bg-white/10 transition-colors cursor-default">
                      <div class="text-lg mb-1">😴</div>
                      <div class="h-2 w-8 bg-white/10 rounded mx-auto"></div>
                    </div>
                    <div class="bg-white/5 rounded-lg p-2 text-center hover:bg-white/10 transition-colors cursor-default">
                      <div class="text-lg mb-1">🧸</div>
                      <div class="h-2 w-8 bg-white/10 rounded mx-auto"></div>
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg p-3 h-full flex flex-col justify-between border border-purple-500/10">
                    <div>
                      <div class="h-2 w-12 bg-white/10 rounded mb-2"></div>
                      <div class="h-4 w-8 bg-purple-400/20 rounded"></div>
                    </div>
                    <div class="h-2 w-full bg-white/5 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Decorative glow -->
            <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl animate-pulse-slow"></div>
            <div class="absolute -top-4 -left-4 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl animate-pulse-slow" style="animation-delay: 1s"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- SOCIAL PROOF - Stats -->
    <section 
      class="border-t border-white/5 py-8"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-2xl font-light text-white bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">500+</p>
            <p class="text-xs text-white/20">Famílias atendidas</p>
          </div>
          <div>
            <p class="text-2xl font-light text-white bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">10K+</p>
            <p class="text-xs text-white/20">Registros diários</p>
          </div>
          <div>
            <p class="text-2xl font-light text-white bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">98%</p>
            <p class="text-xs text-white/20">Satisfação</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section 
      id="features" 
      class="border-t border-white/5 py-16"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-xs font-medium text-white/20 uppercase tracking-wider">Funcionalidades</span>
          <h2 class="text-2xl md:text-3xl font-light text-white mt-2">
            Tudo que você precisa em um só lugar
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-3">
          <div 
            v-for="(f, index) in features" 
            :key="f.title" 
            class="p-4 rounded-lg bg-gradient-to-br from-white/3 to-white/5 hover:bg-white/5 transition-all duration-300 group cursor-default border border-white/5 hover:border-white/10"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 100"
          >
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <component :is="f.icon" class="w-4 h-4 text-white/30" />
            </div>
            <h3 class="text-sm font-medium text-white/70">{{ f.title }}</h3>
            <p class="text-xs text-white/20 mt-1 leading-relaxed">{{ f.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section 
      class="border-t border-white/5 py-16"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <div class="max-w-md mx-auto px-4">
        <div class="text-center mb-8">
          <span class="text-xs font-medium text-white/20 uppercase tracking-wider">Planos</span>
          <h2 class="text-2xl font-light text-white mt-2">Escolha o plano certo</h2>
        </div>

        <div class="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/3 border border-white/10 relative overflow-hidden hover:border-emerald-500/20 transition-all duration-300">
          <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
          
          <div class="relative">
            <div class="flex items-center gap-2 justify-center mb-4">
              <span class="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">Premium</span>
            </div>
            <div class="text-4xl font-light text-white text-center">R$ 29,90</div>
            <div class="text-sm text-white/30 text-center">por mês</div>

            <ul class="mt-6 space-y-2">
              <li v-for="item in ['Acesso completo a todos os módulos', 'Múltiplos bebês', 'Convide até 5 membros', 'Suporte prioritário']" :key="item" class="flex items-center gap-2 text-sm text-white/50">
                <CheckCircle class="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {{ item }}
              </li>
            </ul>

            <button 
              @click="router.push('/checkout')"
              class="w-full mt-6 py-3 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 hover:from-emerald-500/30 hover:to-emerald-500/20 rounded-lg text-white/70 text-sm font-medium transition-all duration-300 hover:scale-[1.02] border border-emerald-500/20 hover:border-emerald-500/30"
            >
              Assinar agora
            </button>
            <p class="text-xs text-white/10 text-center mt-3">Cancelamento a qualquer momento</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section 
      class="border-t border-white/5 py-16"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center mb-10">
          <span class="text-xs font-medium text-white/20 uppercase tracking-wider">Depoimentos</span>
          <h2 class="text-2xl font-light text-white mt-2">O que as famílias dizem</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div 
            v-for="(t, index) in testimonials" 
            :key="t.name" 
            class="p-4 rounded-lg bg-gradient-to-br from-white/3 to-white/5 hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-white/10"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 150"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 flex items-center justify-center text-white/40 text-sm font-medium">
                {{ t.avatar }}
              </div>
              <div>
                <p class="text-sm text-white/70">{{ t.name }}</p>
                <p class="text-xs text-white/20">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-sm text-white/30 leading-relaxed">"{{ t.text }}"</p>
            <div class="flex gap-0.5 mt-3">
              <Star v-for="n in 5" :key="n" class="w-3 h-3 fill-emerald-400/20 text-emerald-400/20" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section 
      class="border-t border-white/5 py-16"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <div class="max-w-2xl mx-auto px-4 text-center">
        <div class="p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/3 border border-white/5">
          <h2 class="text-xl md:text-2xl font-light text-white">Pronto para transformar a rotina do seu bebê?</h2>
          <p class="text-sm text-white/20 mt-2">Junte-se a +500 famílias que já usam o Ninho App</p>
          <button 
            @click="router.push('/checkout')"
            class="mt-6 px-8 py-3 bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 hover:from-emerald-500/30 hover:to-emerald-500/20 rounded-lg text-white/70 text-sm font-medium transition-all duration-300 hover:scale-[1.02] inline-flex items-center gap-2 border border-emerald-500/20 hover:border-emerald-500/30"
          >
            <Sparkles class="w-4 h-4 text-emerald-400" />
            Assinar agora
            <ArrowRight class="w-4 h-4" />
          </button>
          <p class="text-xs text-white/10 mt-4">Sem fidelidade • Cancelamento a qualquer momento</p>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-white/5 py-6">
      <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/20">
        <div class="flex items-center gap-2">
          <span class="text-sm">👶</span>
          <span>Ninho App</span>
        </div>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-white/40 transition-colors">Sobre</a>
          <a href="#" class="hover:text-white/40 transition-colors">Privacidade</a>
          <a href="#" class="hover:text-white/40 transition-colors">Contato</a>
          <a href="#" class="hover:text-white/40 transition-colors">Suporte</a>
        </div>
        <span>© {{ currentYear }}</span>
      </div>
    </footer>
  </div>
</template>
