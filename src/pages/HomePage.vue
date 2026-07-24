<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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
  Heart,
  TrendingUp,
  Award,
  Zap,
  LogIn,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  Mail,
  Instagram,
  Youtube,
  Twitter
} from 'lucide-vue-next'

const router = useRouter()
const currentYear = ref(new Date().getFullYear())
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const activeFaq = ref<number | null>(null)

const stats = [
  { value: 500, label: 'famílias atendidas', suffix: '+' },
  { value: 10, label: 'mil registros diários', suffix: 'K+' },
  { value: 98, label: '% de satisfação', suffix: '%' }
]

const features = [
  {
    icon: Baby,
    title: 'Diário do Bebê',
    description: 'Registre alimentação, sono, fraldas e acompanhe o desenvolvimento diário do seu bebê.',
    color: '#10b981'
  },
  {
    icon: TrendingUp,
    title: 'Crescimento',
    description: 'Acompanhe peso, altura e perímetro cefálico com gráficos detalhados e percentis.',
    color: '#3b82f6'
  },
  {
    icon: Calendar,
    title: 'Agenda',
    description: 'Gerencie consultas, vacinas e compromissos com lembretes automáticos.',
    color: '#8b5cf6'
  },
  {
    icon: Pill,
    title: 'Medicamentos',
    description: 'Controle a medicação do seu bebê com lembretes de horários precisos.',
    color: '#f43f5e'
  },
  {
    icon: Syringe,
    title: 'Vacinas',
    description: 'Calendário vacinal completo com alertas de próximas doses.',
    color: '#f59e0b'
  },
  {
    icon: Users,
    title: 'Família Conectada',
    description: 'Compartilhe informações com todos os cuidadores em um só lugar.',
    color: '#6366f1'
  }
]

const testimonials = [
  {
    name: 'Mariana Silva',
    role: 'Mãe da Laura, 6 meses',
    text: 'O Ninho App transformou a forma como acompanho o desenvolvimento da minha filha. Todas as informações em um só lugar, de forma simples e organizada.',
    rating: 5,
    avatar: 'M'
  },
  {
    name: 'Rafael Oliveira',
    role: 'Pai do Miguel, 1 ano',
    text: 'Excelente ferramenta para organização familiar. As notificações de vacinas são um salva-vidas para pais ocupados como eu.',
    rating: 5,
    avatar: 'R'
  },
  {
    name: 'Fernanda Costa',
    role: 'Mãe da Sofia, 3 meses',
    text: 'A interface é linda e intuitiva. Recomendo para todas as mães que querem organizar a rotina do bebê sem complicação.',
    rating: 5,
    avatar: 'F'
  }
]

const faqs = [
  {
    question: 'O Ninho App é gratuito?',
    answer: 'Oferecemos um plano gratuito com funcionalidades básicas. O plano premium dá acesso completo a todos os módulos e recursos avançados.'
  },
  {
    question: 'Como funciona o plano premium?',
    answer: 'O plano premium custa R$ 29,90 por mês e inclui acesso a todos os módulos, múltiplos bebês, convite para até 5 membros da família e suporte prioritário.'
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento. Sem multa, sem burocracia.'
  },
  {
    question: 'Meus dados estão seguros?',
    answer: 'Sim. Utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança da indústria. Seus dados são seus.'
  }
]

const steps = [
  {
    title: 'Assine o plano',
    description: 'Escolha o plano que melhor atende sua família e faça a assinatura.',
    icon: '💳'
  },
  {
    title: 'Crie sua conta',
    description: 'Após a assinatura, crie sua conta com o mesmo email utilizado no pagamento.',
    icon: '👤'
  },
  {
    title: 'Cadastre seu bebê',
    description: 'Adicione as informações do seu bebê e comece a registrar o desenvolvimento.',
    icon: '👶'
  },
  {
    title: 'Acompanhe o crescimento',
    description: 'Registre atividades diárias e veja o progresso do seu bebê em gráficos e relatórios.',
    icon: '📈'
  }
]

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  mobileMenuOpen.value = false
}

onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', handleScroll)
  
  // Animar contadores
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement
        const value = parseInt(target.dataset.value || '0')
        let current = 0
        const increment = Math.ceil(value / 60)
        const interval = setInterval(() => {
          current += increment
          if (current >= value) {
            current = value
            clearInterval(interval)
          }
          target.textContent = current + (target.dataset.suffix || '')
        }, 20)
      }
    })
  }, { threshold: 0.5 })
  
  document.querySelectorAll('[data-counter]').forEach(el => {
    observer.observe(el)
  })
})
</script>

<template>
  <div class="bg-[#0a0a0f] min-h-screen overflow-x-hidden">
    
    <!-- NAVBAR -->
    <header 
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5 py-2' : 'py-4'"
    >
      <div class="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2 text-white">
          <span class="text-xl">👶</span>
          <span class="text-sm font-medium tracking-tight">Ninho</span>
        </div>

        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-6 text-sm">
          <button @click="scrollToSection('features')" class="text-white/30 hover:text-white/60 transition-colors">Funcionalidades</button>
          <button @click="scrollToSection('pricing')" class="text-white/30 hover:text-white/60 transition-colors">Planos</button>
          <button @click="scrollToSection('testimonials')" class="text-white/30 hover:text-white/60 transition-colors">Depoimentos</button>
          <button @click="scrollToSection('faq')" class="text-white/30 hover:text-white/60 transition-colors">FAQ</button>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <button 
            @click="router.push('/auth/login')"
            class="text-sm text-white/30 hover:text-white/60 transition-colors hidden md:block"
          >
            Entrar
          </button>
          <button 
            @click="router.push('/checkout')"
            class="px-4 py-1.5 text-sm bg-white/10 hover:bg-white/15 rounded-lg text-white/80 transition-colors hidden md:block"
          >
            Começar
          </button>
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden text-white/50 hover:text-white/80 transition-colors p-1"
          >
            <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div 
        v-if="mobileMenuOpen"
        class="md:hidden bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5 px-4 py-6 space-y-4"
      >
        <button @click="scrollToSection('features')" class="block w-full text-left text-white/50 hover:text-white/80 transition-colors py-2">Funcionalidades</button>
        <button @click="scrollToSection('pricing')" class="block w-full text-left text-white/50 hover:text-white/80 transition-colors py-2">Planos</button>
        <button @click="scrollToSection('testimonials')" class="block w-full text-left text-white/50 hover:text-white/80 transition-colors py-2">Depoimentos</button>
        <button @click="scrollToSection('faq')" class="block w-full text-left text-white/50 hover:text-white/80 transition-colors py-2">FAQ</button>
        <div class="flex gap-3 pt-4 border-t border-white/5">
          <button @click="router.push('/auth/login')" class="flex-1 px-4 py-2 text-sm text-white/30 hover:text-white/60 transition-colors border border-white/10 rounded-lg">Entrar</button>
          <button @click="router.push('/checkout')" class="flex-1 px-4 py-2 text-sm bg-white/10 hover:bg-white/15 rounded-lg text-white/80 transition-colors">Começar</button>
        </div>
      </div>
    </header>

    <!-- HERO -->
    <section class="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_#10b98108_0%,_transparent_60%)]"></div>
        <div class="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_#8b5cf608_0%,_transparent_60%)]"></div>
      </div>

      <div class="max-w-6xl mx-auto px-4 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          
          <!-- Left -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-white/30 mb-6">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Disponível agora
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[1.05] tracking-tight mb-4">
              Cuide do seu bebê com
              <span class="block text-white/40">amor e tecnologia</span>
            </h1>
            <p class="text-white/30 text-base max-w-md leading-relaxed mb-8">
              O ecossistema completo para acompanhar o desenvolvimento do seu bebê, registrar momentos especiais e conectar toda a família.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <button 
                @click="router.push('/checkout')"
                class="px-8 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Começar agora
                <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button 
                @click="scrollToSection('features')"
                class="px-8 py-3 border border-white/5 hover:border-white/10 rounded-xl text-white/30 text-sm transition-all duration-300"
              >
                Ver funcionalidades
              </button>
            </div>
            <div class="flex flex-wrap gap-4 mt-8 text-xs text-white/15">
              <span class="flex items-center gap-1.5"><Shield class="w-3.5 h-3.5" /> Dados seguros</span>
              <span class="flex items-center gap-1.5"><Smartphone class="w-3.5 h-3.5" /> 100% mobile</span>
              <span class="flex items-center gap-1.5"><Clock class="w-3.5 h-3.5" /> Suporte 24/7</span>
            </div>
            <div class="mt-6">
              <button 
                @click="router.push('/auth/login')"
                class="text-xs text-white/15 hover:text-white/30 transition-colors flex items-center gap-1.5 group"
              >
                <LogIn class="w-3 h-3" />
                Já tem uma conta? <span class="text-white/30 group-hover:text-white/50">Faça login</span>
              </button>
            </div>
          </div>

          <!-- Right - Mockup -->
          <div class="relative">
            <div class="aspect-[4/3] rounded-xl bg-gradient-to-br from-white/5 to-white/3 border border-white/5 overflow-hidden p-4">
              <div class="grid grid-cols-3 gap-3 h-full">
                <div class="col-span-2 space-y-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-white/5"></div>
                    <div class="flex-1">
                      <div class="h-3 w-24 bg-white/10 rounded"></div>
                      <div class="h-2 w-16 bg-white/5 rounded mt-1"></div>
                    </div>
                  </div>
                  <div class="bg-white/5 rounded-lg p-3 space-y-2">
                    <div class="h-2 w-20 bg-white/10 rounded"></div>
                    <div class="h-6 w-16 bg-white/15 rounded"></div>
                  </div>
                  <div class="grid grid-cols-3 gap-2">
                    <div class="bg-white/5 rounded-lg p-2 text-center">
                      <div class="text-lg mb-1">🍼</div>
                      <div class="h-2 w-8 bg-white/10 rounded mx-auto"></div>
                    </div>
                    <div class="bg-white/5 rounded-lg p-2 text-center">
                      <div class="text-lg mb-1">😴</div>
                      <div class="h-2 w-8 bg-white/10 rounded mx-auto"></div>
                    </div>
                    <div class="bg-white/5 rounded-lg p-2 text-center">
                      <div class="text-lg mb-1">🧸</div>
                      <div class="h-2 w-8 bg-white/10 rounded mx-auto"></div>
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="bg-white/5 rounded-lg p-3 h-full flex flex-col justify-between">
                    <div>
                      <div class="h-2 w-12 bg-white/10 rounded mb-2"></div>
                      <div class="h-4 w-8 bg-white/15 rounded"></div>
                    </div>
                    <div class="h-2 w-full bg-white/5 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
            <div class="absolute -top-4 -left-4 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS - Social Proof -->
    <section class="border-t border-white/5 py-12">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <p 
              class="text-3xl md:text-4xl font-light text-white"
              :data-counter="true"
              :data-value="stat.value"
              :data-suffix="stat.suffix"
            >
              0
            </p>
            <p class="text-xs text-white/15 mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section id="features" class="border-t border-white/5 py-20">
      <div class="max-w-5xl mx-auto px-4">
        <div class="max-w-md mx-auto text-center mb-14">
          <span class="text-xs font-medium text-white/15 uppercase tracking-wider">Funcionalidades</span>
          <h2 class="text-2xl md:text-3xl font-light text-white mt-2">Tudo que você precisa</h2>
          <p class="text-white/15 text-sm mt-2">Ferramentas completas para cuidar do desenvolvimento do seu bebê</p>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div 
            v-for="(f, index) in features" 
            :key="f.title" 
            class="group p-5 rounded-xl bg-white/3 hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-white/10 cursor-default"
            :style="{ 'transition-delay': `${index * 50}ms` }"
          >
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <component :is="f.icon" class="w-4 h-4" :style="{ color: f.color }" />
              </div>
              <div>
                <h3 class="text-sm font-medium text-white/70">{{ f.title }}</h3>
                <p class="text-xs text-white/15 mt-1 leading-relaxed">{{ f.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="border-t border-white/5 py-20 bg-white/3">
      <div class="max-w-4xl mx-auto px-4">
        <div class="max-w-md mx-auto text-center mb-14">
          <span class="text-xs font-medium text-white/15 uppercase tracking-wider">Como funciona</span>
          <h2 class="text-2xl md:text-3xl font-light text-white mt-2">Comece em poucos passos</h2>
        </div>

        <div class="grid md:grid-cols-4 gap-6">
          <div v-for="(step, index) in steps" :key="index" class="text-center">
            <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl mx-auto mb-3">
              {{ step.icon }}
            </div>
            <div class="relative">
              <div v-if="index < steps.length - 1" class="hidden md:block absolute top-[-24px] left-[calc(50%+32px)] w-[calc(100%-64px)] h-px bg-white/5"></div>
              <p class="text-sm font-medium text-white/70">{{ step.title }}</p>
              <p class="text-xs text-white/15 mt-1">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section id="pricing" class="border-t border-white/5 py-20">
      <div class="max-w-md mx-auto px-4">
        <div class="text-center mb-10">
          <span class="text-xs font-medium text-white/15 uppercase tracking-wider">Planos</span>
          <h2 class="text-2xl font-light text-white mt-2">Escolha o plano certo</h2>
        </div>

        <div class="relative p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
          <div class="absolute top-0 right-0">
            <span class="inline-block px-3 py-0.5 bg-white/5 text-white/20 text-xs rounded-bl-xl rounded-tr-xl">Popular</span>
          </div>
          <div class="flex items-center gap-2 justify-center mb-3">
            <span class="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-xs">Premium</span>
          </div>
          <div class="text-4xl font-light text-white text-center">R$ 29,90</div>
          <div class="text-sm text-white/20 text-center">por mês</div>
          <ul class="mt-6 space-y-2">
            <li v-for="item in ['Acesso completo a todos os módulos', 'Múltiplos bebês', 'Convide até 5 membros', 'Suporte prioritário']" :key="item" class="flex items-center gap-2 text-sm text-white/40">
              <CheckCircle class="w-4 h-4 text-emerald-400/50 flex-shrink-0" />
              {{ item }}
            </li>
          </ul>
          <button 
            @click="router.push('/checkout')"
            class="w-full mt-6 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-white/70 text-sm font-medium transition-colors"
          >
            Assinar agora
          </button>
          <p class="text-xs text-white/10 text-center mt-3">Sem fidelidade • Cancelamento a qualquer momento</p>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section id="testimonials" class="border-t border-white/5 py-20 bg-white/3">
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-xs font-medium text-white/15 uppercase tracking-wider">Depoimentos</span>
          <h2 class="text-2xl font-light text-white mt-2">O que as famílias dizem</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div v-for="t in testimonials" :key="t.name" class="p-5 rounded-xl bg-white/3 hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-white/10">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/30 text-sm font-medium">
                {{ t.avatar }}
              </div>
              <div>
                <p class="text-sm text-white/70">{{ t.name }}</p>
                <p class="text-xs text-white/15">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-sm text-white/30 leading-relaxed">"{{ t.text }}"</p>
            <div class="flex gap-0.5 mt-3">
              <Star v-for="n in 5" :key="n" class="w-3 h-3 fill-white/10 text-white/10" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="border-t border-white/5 py-20">
      <div class="max-w-2xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-xs font-medium text-white/15 uppercase tracking-wider">FAQ</span>
          <h2 class="text-2xl font-light text-white mt-2">Dúvidas frequentes</h2>
        </div>

        <div class="space-y-2">
          <div v-for="(faq, index) in faqs" :key="index" class="border border-white/5 rounded-lg overflow-hidden">
            <button 
              @click="activeFaq = activeFaq === index ? null : index"
              class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
            >
              <span class="text-sm text-white/60">{{ faq.question }}</span>
              <ChevronDown 
                class="w-4 h-4 text-white/20 transition-transform duration-300 flex-shrink-0"
                :class="activeFaq === index ? 'rotate-180' : ''"
              />
            </button>
            <div 
              class="overflow-hidden transition-all duration-300"
              :style="{ maxHeight: activeFaq === index ? '200px' : '0' }"
            >
              <p class="px-4 pb-3 text-sm text-white/20 leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="border-t border-white/5 py-20 bg-white/3">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <div class="p-8 rounded-xl bg-white/3 border border-white/5">
          <div class="flex justify-center mb-4">
            <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Heart class="w-5 h-5 text-white/30" />
            </div>
          </div>
          <h2 class="text-xl md:text-2xl font-light text-white">Pronto para transformar a rotina do seu bebê?</h2>
          <p class="text-sm text-white/15 mt-2">Junte-se a +500 famílias que já usam o Ninho App</p>
          <button 
            @click="router.push('/checkout')"
            class="mt-6 px-8 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-white/70 text-sm font-medium transition-colors inline-flex items-center gap-2 group"
          >
            Assinar agora
            <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <p class="text-xs text-white/10 mt-3">Sem fidelidade • Cancelamento a qualquer momento</p>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-white/5 py-8">
      <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/15">
        <div class="flex items-center gap-2">
          <span class="text-sm">👶</span>
          <span>Ninho App</span>
        </div>
        <div class="flex items-center gap-6">
          <a href="#" class="hover:text-white/30 transition-colors">Sobre</a>
          <a href="#" class="hover:text-white/30 transition-colors">Privacidade</a>
          <a href="#" class="hover:text-white/30 transition-colors">Contato</a>
          <a href="#" class="hover:text-white/30 transition-colors">Suporte</a>
        </div>
        <span>© {{ currentYear }}</span>
      </div>
    </footer>

  </div>
</template>
