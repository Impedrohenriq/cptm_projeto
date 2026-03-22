import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'splash',
    component: () => import('@/views/SplashView.vue'),
    meta: { requiresAuth: false, transition: 'none' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('@/views/OnboardingView.vue'),
    meta: { requiresAuth: true, showBottomNav: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, showBottomNav: true }
  },
  {
    path: '/formulario',
    name: 'formulario',
    component: () => import('@/views/FormularioView.vue'),
    meta: { requiresAuth: true, showBottomNav: true }
  },
  {
    path: '/conta',
    name: 'conta',
    component: () => import('@/views/ContaView.vue'),
    meta: { requiresAuth: true, showBottomNav: true }
  },
  {
    path: '/gestor',
    name: 'gestor',
    component: () => import('@/views/GestorView.vue'),
    meta: { requiresAuth: true, requiresGestor: true, showBottomNav: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'instant' })
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // 1. Rota exige autenticação mas usuário não está logado → login
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login' }
  }

  // 2. Rota exige gestor mas usuário não é gestor → dashboard
  if (to.meta.requiresGestor && !auth.isGestor) {
    return { name: 'dashboard' }
  }

  // 3. Usuário autenticado ainda não completou o onboarding → forçar onboarding
  //    (exceto se já está indo para onboarding, login ou splash)
  const bypassOnboarding = ['onboarding', 'login', 'splash']
  if (
    to.meta.requiresAuth &&
    auth.isAuthenticated &&
    auth.needsOnboarding &&
    !bypassOnboarding.includes(to.name)
  ) {
    return { name: 'onboarding' }
  }
})

export default router
