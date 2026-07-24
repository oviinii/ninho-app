import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { supabase } from '@/lib/supabase'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../pages/PublicCheckoutPage.vue'),
  },
  {
    path: '/payment/success',
    name: 'payment-success',
    component: () => import('../pages/PaymentSuccessPage.vue'),
  },
  {
    path: '/payment/cancel',
    name: 'payment-cancel',
    component: () => import('../pages/SubscriptionCancelPage.vue'),
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../pages/auth/LoginPage.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../pages/auth/RegisterPage.vue'),
      },
    ],
  },
  {
    path: '/app',
    name: 'app',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../pages/app/DashboardPage.vue'),
      },
      {
        path: 'baby',
        name: 'Diário do Bebê',
        component: () => import('../pages/app/BabyDiaryPage.vue'),
      },
      {
        path: 'calendar',
        name: 'Agenda',
        component: () => import('../pages/app/CalendarPage.vue'),
      },
      {
        path: 'medications',
        name: 'Medicamentos',
        component: () => import('../pages/app/MedicationsPage.vue'),
      },
      {
        path: 'vaccines',
        name: 'Vacinas',
        component: () => import('../pages/app/VaccinesPage.vue'),
      },
      {
        path: 'growth',
        name: 'Crescimento',
        component: () => import('../pages/app/GrowthPage.vue'),
      },
    ],
  },
  {
    path: '/subscription',
    name: 'subscription',
    component: () => import('../pages/SubscriptionPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const isAuthenticated = !!session

    // Se estiver na página de checkout e já estiver autenticado, redirecionar para dashboard
    if (to.path === '/checkout' && isAuthenticated) {
      next({ name: 'Dashboard' })
      return
    }

    // Proteger rotas do app
    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'login' })
      return
    }

    // Redirecionar login para dashboard se já autenticado
    if (to.path.startsWith('/auth') && isAuthenticated) {
      next({ name: 'Dashboard' })
      return
    }

    next()
  } catch (error) {
    console.error('Erro no guard de navegação:', error)
    next()
  }
})

export default router
// Adicionar no array de routes:
{
  path: '/access-instructions',
  name: 'access-instructions',
  component: () => import('../pages/AccessInstructionsPage.vue')
},
