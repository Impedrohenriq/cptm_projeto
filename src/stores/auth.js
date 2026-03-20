import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const AUTH_KEY = 'cptm_auth_ok'
const USER_KEY = 'cptm_user'
const ONBOARDING_KEY = 'cptm_onboarding_done'

// Demo user database (email → user profile)
const USUARIOS = {
  'carlos.silva@cptm.sp.gov.br': {
    id: 'u1',
    name: 'Carlos Silva',
    email: 'carlos.silva@cptm.sp.gov.br',
    password: 'cptm2024',
    role: 'Inspetor Ambiental',
    line: 'Linha 7-Rubi',
    initials: 'CS',
    isGestor: false,
  },
  'ana.paula@cptm.sp.gov.br': {
    id: 'u2',
    name: 'Ana Paula Rodrigues',
    email: 'ana.paula@cptm.sp.gov.br',
    password: 'cptm2024',
    role: 'Inspetora Ambiental',
    line: 'Linha 8-Diamante',
    initials: 'AR',
    isGestor: false,
  },
  'bruno.ferreira@cptm.sp.gov.br': {
    id: 'u3',
    name: 'Bruno Ferreira',
    email: 'bruno.ferreira@cptm.sp.gov.br',
    password: 'cptm2024',
    role: 'Inspetor Ambiental',
    line: 'Linha 9-Esmeralda',
    initials: 'BF',
    isGestor: false,
  },
  'fernanda.lima@cptm.sp.gov.br': {
    id: 'u4',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@cptm.sp.gov.br',
    password: 'cptm2024',
    role: 'Inspetora Ambiental',
    line: 'Linha 10-Turquesa',
    initials: 'FL',
    isGestor: false,
  },
  'gestor@cptm.sp.gov.br': {
    id: 'g1',
    name: 'Roberto Carvalho',
    email: 'gestor@cptm.sp.gov.br',
    password: 'gestor2024',
    role: 'Gestor Ambiental',
    line: 'Todas as Linhas',
    initials: 'RC',
    isGestor: true,
  },
}

export const useAuthStore = defineStore('auth', () => {
  const authenticated = ref(localStorage.getItem(AUTH_KEY) === 'true')
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))
  const onboardingDone = ref(localStorage.getItem(ONBOARDING_KEY) === 'true')

  const isAuthenticated = computed(() => authenticated.value)
  const currentUser = computed(() => user.value)
  const isGestor = computed(() => user.value?.isGestor === true)
  const needsOnboarding = computed(() => !onboardingDone.value && !isGestor.value)

  function login(credentials) {
    if (!credentials.email || !credentials.password) {
      return { success: false, error: 'Preencha todos os campos.' }
    }
    const found = USUARIOS[credentials.email.trim().toLowerCase()]
    if (!found || found.password !== credentials.password.trim()) {
      return { success: false, error: 'E-mail ou senha incorretos.' }
    }
    const { password: _, ...safeUser } = found
    authenticated.value = true
    user.value = safeUser
    localStorage.setItem(AUTH_KEY, 'true')
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser))
    return { success: true }
  }

  function logout() {
    authenticated.value = false
    user.value = null
    localStorage.setItem(AUTH_KEY, 'false')
    localStorage.removeItem(USER_KEY)
  }

  function completeOnboarding() {
    onboardingDone.value = true
    localStorage.setItem(ONBOARDING_KEY, 'true')
  }

  return { isAuthenticated, currentUser, isGestor, needsOnboarding, login, logout, completeOnboarding }
})
