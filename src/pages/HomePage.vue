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
  LogIn,
  ChevronDown,
  Menu,
  X
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
    color: '#10b981',
    bg: 'bg-emerald-50'
  },
  {
    icon: TrendingUp,
    title: 'Crescimento',
    description: 'Acompanhe peso, altura e perímetro cefálico com gráficos detalhados e percentis.',
    color: '#3b82f6',
    bg: 'bg-blue-50'
  },
  {
    icon: Calendar,
    title: 'Agenda',
    description: 'Gerencie consultas, vacinas e compromissos com lembretes automáticos.',
    color: '#8b5cf6',
    bg: 'bg-purple-50'
  },
  {
    icon: Pill,
    title: 'Medicamentos',
    description: 'Controle a medicação do seu bebê com lembretes de horários precisos.',
    color: '#f43f5e',
    bg: 'bg-rose-50'
  },
  {
    icon: Syringe,
    title: 'Vacinas',
    description: 'Calendário vacinal completo com alertas de próximas doses.',
    color: '#f59e0b',
    bg: 'bg-amber-50'
  },
  {
    icon: Users,
    title: 'Família Conectada',
    description: 'Compartilhe informações com todos os cuidadores em um só lugar.',
    color: '#6366f1',
    bg: 'bg-indigo-50'
  }
]

const testimonials = [
  {
    name: 'Mariana Silva',
    role: 'Mãe da Laura, 6 meses',
    text: 'O Ninho App transformou a forma como acompanho o desenvolvimento da minha filha. Todas as informações em um só lugar, de forma simples e organizada.',
    rating: 5,
    avatar: 'M',
    color: 'bg-emerald-100 text-emerald-600'
  },
  {
    name: 'Rafael Oliveira',
    role: 'Pai do Miguel, 1 ano',
    text: 'Excelente ferramenta para organização familiar. As notificações de vacinas são um salva-vidas para pais ocupados como eu.',
    rating: 5,
    avatar: 'R',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    name: 'Fernanda Costa',
    role: 'Mãe da Sofia, 3 meses',
    text: 'A interface é linda e intuitiva. Recomendo para todas as mães que querem organizar a rotina do bebê sem complicação.',
    rating: 5,
    avatar: 'F',
    color: 'bg-purple-100 text-purple-600'
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
    icon: '💳',
    color: 'bg-emerald-100 text-emerald-600'
  },
  {
    title: 'Crie sua conta',
    description: 'Após a assinatura, crie sua conta com o mesmo email utilizado no pagamento.',
    icon: '👤',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Cadastre seu bebê',
    description: 'Adicione as informações do seu bebê e comece a registrar o desenvolvimento.',
    icon: '👶',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Acompanhe o crescimento',
    description: 'Registre atividades diárias e veja o progresso do seu bebê em gráficos e relatórios.',
    icon: '📈',
    color: 'bg-amber-100 text-amber-600'
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
})

onUnmounted(() => {
  window.removeEventListener('scroll', () => {})
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- NAVBAR -->
    <header 
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="scrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-2' : 'bg-transparent py-4'"
    >
      <div class="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl">👶</span>
          <span class="text-sm font-medium text-gray-800 tracking-tight">Ninho</span>
        </div>

        <nav class="hidden md:flex items-center gap-6 text-sm">
          <button @click="scrollToSection('features')" class="text-gray-500 hover:text-gray-800 transition-colors">Funcionalidades</button>
          <button @click="scrollToSection('pricing')" class="text-gray-500 hover:text-gray-800 transition-colors">Planos</button>
          <button @click="scrollToSection('testimonials')" class="text-gray-500 hover:text-gray-800 transition-colors">Depoimentos</button>
          <button @click="scrollToSection('faq')" class="text-gray-500 hover:text-gray-800 transition-colors">FAQ</button>
        </nav>

        <div class="flex items-center gap-3">
          <button 
            @click="router.push('/auth/login')"
            class="text-sm text-gray-400 hover:text-gray-600 transition-colors hidden md:block"
          >
            Entrar
          </button>
          <button 
            @click="router.push('/checkout')"
            class="px-4 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors"
          >
            Começar
          </button>
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden text-gray-500 hover:text-gray-800 transition-colors p-1"
          >
            <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        v-if="mobileMenuOpen"
        class="md:hidden bg-white border-b border-gray-100 px-4 py-6 space-y-4"
      >
        <button @click="scrollToSection('features')" class="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors py-2">Funcionalidades</button>
        <button @click="scrollToSection('pricing')" class="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors py-2">Planos</button>
        <button @click="scrollToSection('testimonials')" class="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors py-2">Depoimentos</button>
        <button @click="scrollToSection('faq')" class="block w-full text-left text-gray-600 hover:text-gray-900 transition-colors py-2">FAQ</button>
        <div class="flex gap-3 pt-4 border-t border-gray-100">
          <button @click="router.push('/auth/login')" class="flex-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors border border-gray-200 rounded-lg">Entrar</button>
          <button @click="router.push('/checkout')" class="flex-1 px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors">Começar</button>
        </div>
      </div>
    </header>

    <!-- HERO -->
    <section class="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/30 rounded-full blur-3xl -translate-y-1/4"></div>
        <div class="absolute bottom-0 left-0 w-1/3 h-1/2 bg-purple-50/20 rounded-full blur-3xl translate-y-1/4"></div>
      </div>

      <div class="max-w-6xl mx-auto px-4 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-xs text-emerald-700 mb-6">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Disponível agora
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 leading-[1.05] tracking-tight mb-4">
              Cuide do seu bebê com
              <span class="text-emerald-600 block">amor e tecnologia</span>
            </h1>
            <p class="text-gray-500 text-base max-w-md leading-relaxed mb-8">
              O ecossistema completo para acompanhar o desenvolvimento do seu bebê, registrar momentos especiais e conectar toda a família.
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <button 
                @click="router.push('/checkout')"
                class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Começar agora
                <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button 
                @click="scrollToSection('features')"
                class="px-8 py-3 border border-gray-200 hover:border-gray-300 rounded-xl text-gray-500 text-sm transition-all duration-300"
              >
                Ver funcionalidades
              </button>
            </div>
            <div class="flex flex-wrap gap-4 mt-8 text-xs text-gray-400">
              <span class="flex items-center gap-1.5"><Shield class="w-3.5 h-3.5" /> Dados seguros</span>
              <span class="flex items-center gap-1.5"><Smartphone class="w-3.5 h-3.5" /> 100% mobile</span>
              <span class="flex items-center gap-1.5"><Clock class="w-3.5 h-3.5" /> Suporte 24/7</span>
            </div>
            <div class="mt-6">
              <button 
                @click="router.push('/auth/login')"
                class="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5 group"
              >
                <LogIn class="w-3 h-3" />
                Já tem uma conta? <span class="text-emerald-600 group-hover:text-emerald-700">Faça login</span>
              </button>
            </div>
          </div>

          <div class="relative">
            <div class="aspect-[4/3] rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden p-4">
              <div class="grid grid-cols-3 gap-3 h-full">
                <div class="col-span-2 space-y-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-emerald-100"></div>
                    <div class="flex-1">
                      <div class="h-3 w-24 bg-gray-200 rounded"></div>
                      <div class="h-2 w-16 bg-gray-100 rounded mt-1"></div>
                    </div>
                  </div>
                  <div class="bg-emerald-50 rounded-lg p-3 space-y-2 border border-emerald-100">
                    <div class="h-2 w-20 bg-emerald-200/50 rounded"></div>
                    <div class="h-6 w-16 bg-emerald-300/30 rounded"></div>
                  </div>
                  <div class="grid grid-cols-3 gap-2">
                    <div class="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                      <div class="text-lg mb-1">🍼</div>
                      <div class="h-2 w-8 bg-gray-200 rounded mx-auto"></div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                      <div class="text-lg mb-1">😴</div>
                      <div class="h-2 w-8 bg-gray-200 rounded mx-auto"></div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                      <div class="text-lg mb-1">🧸</div>
                      <div class="h-2 w-8 bg-gray-200 rounded mx-auto"></div>
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="bg-purple-50 rounded-lg p-3 h-full flex flex-col justify-between border border-purple-100">
                    <div>
                      <div class="h-2 w-12 bg-purple-200/50 rounded mb-2"></div>
                      <div class="h-4 w-8 bg-purple-300/30 rounded"></div>
                    </div>
                    <div class="h-2 w-full bg-purple-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="bg-gray-50/50 border-y border-gray-100 py-12">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <p class="text-3xl md:text-4xl font-light text-gray-900">{{ stat.value }}{{ stat.suffix }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section id="features" class="py-20">
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-14">
          <span class="text-xs font-medium text-emerald-600 uppercase tracking-wider">Funcionalidades</span>
          <h2 class="text-3xl font-light text-gray-900 mt-2">Tudo que você precisa</h2>
          <p class="text-gray-400 text-sm mt-2">Ferramentas completas para cuidar do desenvolvimento do seu bebê</p>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div 
            v-for="(f, index) in features" 
            :key="f.title" 
            class="group p-5 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300 cursor-default"
          >
            <div class="flex items-start gap-3">
              <div :class="['w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', f.bg]">
                <component :is="f.icon" class="w-4 h-4" :style="{ color: f.color }" />
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-800">{{ f.title }}</h3>
                <p class="text-xs text-gray-400 mt-1 leading-relaxed">{{ f.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="bg-gray-50/50 border-y border-gray-100 py-20">
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center mb-14">
          <span class="text-xs font-medium text-emerald-600 uppercase tracking-wider">Como funciona</span>
          <h2 class="text-3xl font-light text-gray-900 mt-2">Comece em poucos passos</h2>
        </div>

        <div class="grid md:grid-cols-4 gap-6">
          <div v-for="(step, index) in steps" :key="index" class="text-center">
            <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-3', step.color]">
              {{ step.icon }}
            </div>
            <div class="relative">
              <div v-if="index < steps.length - 1" class="hidden md:block absolute top-[-24px] left-[calc(50%+32px)] w-[calc(100%-64px)] h-px bg-gray-200"></div>
              <p class="text-sm font-medium text-gray-800">{{ step.title }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section id="pricing" class="py-20">
      <div class="max-w-md mx-auto px-4">
        <div class="text-center mb-10">
          <span class="text-xs font-medium text-emerald-600 uppercase tracking-wider">Planos</span>
          <h2 class="text-3xl font-light text-gray-900 mt-2">Escolha o plano certo</h2>
        </div>

        <div class="relative p-6 rounded-xl bg-emerald-50 border border-emerald-200 hover:border-emerald-300 transition-all duration-300">
          <div class="absolute top-0 right-0">
            <span class="inline-block px-3 py-0.5 bg-emerald-600 text-white text-xs rounded-bl-xl rounded-tr-xl">Popular</span>
          </div>
          <div class="flex items-center gap-2 justify-center mb-3">
            <span class="px-2 py-0.5 rounded-full bg-emerald-200/50 text-emerald-700 text-xs">Premium</span>
          </div>
          <div class="text-4xl font-light text-gray-900 text-center">R$ 29,90</div>
          <div class="text-sm text-gray-400 text-center">por mês</div>
          <ul class="mt-6 space-y-2">
            <li v-for="item in ['Acesso completo a todos os módulos', 'Múltiplos bebês', 'Convide até 5 membros', 'Suporte prioritário']" :key="item" class="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle class="w-4 h-4 text-emerald-500 flex-shrink-0" />
              {{ item }}
            </li>
          </ul>
          <button 
            @click="router.push('/checkout')"
            class="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white text-sm font-medium transition-colors"
          >
            Assinar agora
          </button>
          <p class="text-xs text-gray-400 text-center mt-3">Sem fidelidade • Cancelamento a qualquer momento</p>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section id="testimonials" class="bg-gray-50/50 border-y border-gray-100 py-20">
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-xs font-medium text-emerald-600 uppercase tracking-wider">Depoimentos</span>
          <h2 class="text-3xl font-light text-gray-900 mt-2">O que as famílias dizem</h2>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div v-for="t in testimonials" :key="t.name" class="p-5 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300">
            <div class="flex items-center gap-3 mb-3">
              <div :class="['w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium', t.color]">
                {{ t.avatar }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800">{{ t.name }}</p>
                <p class="text-xs text-gray-400">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-sm text-gray-500 leading-relaxed">"{{ t.text }}"</p>
            <div class="flex gap-0.5 mt-3">
              <Star v-for="n in 5" :key="n" class="w-3 h-3 fill-amber-400 text-amber-400" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="py-20">
      <div class="max-w-2xl mx-auto px-4">
        <div class="text-center mb-12">
          <span class="text-xs font-medium text-emerald-600 uppercase tracking-wider">FAQ</span>
          <h2 class="text-3xl font-light text-gray-900 mt-2">Dúvidas frequentes</h2>
        </div>

        <div class="space-y-2">
          <div v-for="(faq, index) in faqs" :key="index" class="border border-gray-100 rounded-lg overflow-hidden">
            <button 
              @click="activeFaq = activeFaq === index ? null : index"
              class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span class="text-sm text-gray-700">{{ faq.question }}</span>
              <ChevronDown 
                class="w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0"
                :class="activeFaq === index ? 'rotate-180' : ''"
              />
            </button>
            <div 
              class="overflow-hidden transition-all duration-300"
              :style="{ maxHeight: activeFaq === index ? '200px' : '0' }"
            >
              <p class="px-4 pb-3 text-sm text-gray-500 leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="bg-emerald-600 py-20">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <div class="flex justify-center mb-4">
          <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Heart class="w-5 h-5 text-white" />
          </div>
        </div>
        <h2 class="text-3xl font-light text-white">Pronto para transformar a rotina do seu bebê?</h2>
        <p class="text-emerald-100/70 text-sm mt-2">Junte-se a +500 famílias que já usam o Ninho App</p>
        <button 
          @click="router.push('/checkout')"
          class="mt-6 px-8 py-3 bg-white hover:bg-emerald-50 rounded-xl text-emerald-700 text-sm font-medium transition-colors inline-flex items-center gap-2 group"
        >
          Assinar agora
          <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
        <p class="text-emerald-100/50 text-xs mt-3">Sem fidelidade • Cancelamento a qualquer momento</p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-gray-100 py-8 bg-white">
      <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <div class="flex items-center gap-2">
          <span class="text-sm">👶</span>
          <span>Ninho App</span>
        </div>
        <div class="flex items-center gap-6">
          <a href="#" class="hover:text-gray-600 transition-colors">Sobre</a>
          <a href="#" class="hover:text-gray-600 transition-colors">Privacidade</a>
          <a href="#" class="hover:text-gray-600 transition-colors">Contato</a>
          <a href="#" class="hover:text-gray-600 transition-colors">Suporte</a>
        </div>
        <span>© {{ currentYear }}</span>
      </div>
    </footer>
  </div>
</template>
