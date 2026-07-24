<script setup lang="ts">
import { ref } from 'vue'
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
  CheckCircle
} from 'lucide-vue-next'

const router = useRouter()
const currentYear = ref(new Date().getFullYear())

const features = [
  {
    icon: Baby,
    title: 'Diário do Bebê',
    description: 'Alimentação, sono, fraldas e desenvolvimento em um só lugar'
  },
  {
    icon: Calendar,
    title: 'Agenda',
    description: 'Consultas, vacinas e compromissos organizados'
  },
  {
    icon: Pill,
    title: 'Medicamentos',
    description: 'Controle de medicação com lembretes'
  },
  {
    icon: Syringe,
    title: 'Vacinas',
    description: 'Calendário vacinal com alertas de próximas doses'
  },
  {
    icon: Users,
    title: 'Família',
    description: 'Compartilhe informações com toda a família'
  }
]

const testimonials = [
  {
    name: 'Mariana Silva',
    role: 'Mãe da Laura',
    text: 'O Ninho App transformou a forma como acompanho minha filha. Tudo em um só lugar!',
    avatar: 'M'
  },
  {
    name: 'Rafael Oliveira',
    role: 'Pai do Miguel',
    text: 'Excelente para organização familiar. As notificações de vacinas são um salva-vidas!',
    avatar: 'R'
  }
]
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f]">
    <!-- Hero -->
    <section class="relative px-4 pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden">
      <div class="max-w-3xl mx-auto text-center relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-white/40 mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Disponível agora
        </div>
        <h1 class="text-3xl md:text-5xl font-light text-white leading-tight tracking-tight">
          Cuide do seu bebê com
          <span class="text-white/60">amor e tecnologia</span>
        </h1>
        <p class="text-white/30 text-sm md:text-base mt-4 max-w-md mx-auto leading-relaxed">
          O ecossistema completo para acompanhar o desenvolvimento do seu bebê e conectar toda a família.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-3 mt-8">
          <button 
            @click="router.push('/checkout')"
            class="px-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-white/80 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            Assinar agora
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
        <div class="flex flex-wrap justify-center gap-6 mt-8 text-xs text-white/20">
          <span class="flex items-center gap-1.5"><Shield class="w-3 h-3" /> Dados seguros</span>
          <span class="flex items-center gap-1.5"><Smartphone class="w-3 h-3" /> 100% Mobile</span>
          <span class="flex items-center gap-1.5"><Clock class="w-3 h-3" /> 24/7 disponível</span>
        </div>
      </div>
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </section>

    <!-- Features -->
    <section class="px-4 py-12 border-t border-white/5">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-xs font-medium text-white/20 uppercase tracking-wider text-center mb-8">Funcionalidades</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div v-for="f in features" :key="f.title" class="p-4 rounded-lg bg-white/3 hover:bg-white/5 transition-colors text-center">
            <div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <component :is="f.icon" class="w-4 h-4 text-white/40" />
            </div>
            <h3 class="text-sm font-medium text-white/70">{{ f.title }}</h3>
            <p class="text-xs text-white/20 mt-1 leading-relaxed">{{ f.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="px-4 py-12 border-t border-white/5">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-xs font-medium text-white/20 uppercase tracking-wider text-center mb-8">Depoimentos</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="t in testimonials" :key="t.name" class="p-4 rounded-lg bg-white/3">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 text-sm font-medium">
                {{ t.avatar }}
              </div>
              <div>
                <p class="text-sm text-white/70">{{ t.name }}</p>
                <p class="text-xs text-white/20">{{ t.role }}</p>
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

    <!-- Pricing -->
    <section class="px-4 py-12 border-t border-white/5">
      <div class="max-w-md mx-auto text-center">
        <h2 class="text-xs font-medium text-white/20 uppercase tracking-wider mb-6">Planos</h2>
        <div class="p-6 rounded-xl bg-white/5 border border-white/10">
          <div class="flex items-center gap-2 justify-center mb-4">
            <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">Premium</span>
          </div>
          <div class="text-3xl font-light text-white">R$ 29,90</div>
          <div class="text-sm text-white/30">por mês</div>
          <ul class="mt-6 space-y-2 text-left">
            <li v-for="item in ['Acesso completo a todos os módulos', 'Múltiplos bebês', 'Convide até 5 membros', 'Suporte prioritário']" :key="item" class="flex items-center gap-2 text-sm text-white/50">
              <CheckCircle class="w-4 h-4 text-emerald-400 flex-shrink-0" />
              {{ item }}
            </li>
          </ul>
          <button 
            @click="router.push('/checkout')"
            class="w-full mt-6 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-white/70 text-sm font-medium transition-colors"
          >
            Assinar agora
          </button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="px-4 py-12 border-t border-white/5">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-xl md:text-2xl font-light text-white/80">Pronto para começar?</h2>
        <p class="text-sm text-white/20 mt-2">Junte-se a outras famílias que já usam o Ninho App</p>
        <button 
          @click="router.push('/checkout')"
          class="mt-6 px-8 py-3 bg-white/10 hover:bg-white/15 rounded-lg text-white/80 text-sm font-medium transition-colors"
        >
          Assinar agora
        </button>
        <p class="text-xs text-white/10 mt-4">Cancelamento a qualquer momento</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-4 py-6 border-t border-white/5">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/20">
        <div class="flex items-center gap-2">
          <span class="text-sm">👶</span>
          <span>Ninho App</span>
        </div>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-white/40 transition-colors">Sobre</a>
          <a href="#" class="hover:text-white/40 transition-colors">Privacidade</a>
          <a href="#" class="hover:text-white/40 transition-colors">Contato</a>
        </div>
        <span>© {{ currentYear }}</span>
      </div>
    </footer>
  </div>
</template>
