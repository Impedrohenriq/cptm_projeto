import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { autenticarUsuario, registrarUsuario } from '@/services/api'

const AUTH_KEY = 'cptm_auth_ok'
const USER_KEY = 'cptm_user'
const ONBOARDING_KEY = 'cptm_onboarding_done'

export const useAuthStore = defineStore('auth', () => {
  const authenticated = ref(localStorage.getItem(AUTH_KEY) === 'true')
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))
  const onboardingDone = ref(localStorage.getItem(ONBOARDING_KEY) === 'true')

  const isAuthenticated = computed(() => authenticated.value)
  const currentUser = computed(() => user.value)
  const isGestor = computed(() => user.value?.isGestor === true)
  const needsOnboarding = computed(() => !onboardingDone.value && !isGestor.value)

  function persistAuth(safeUser) {
    authenticated.value = true
    user.value = safeUser
    localStorage.setItem(AUTH_KEY, 'true')
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser))
  }

  function mapUser(apiUser) {
    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      role: apiUser.role,
      line: apiUser.line,
      initials: apiUser.initials,
      isGestor: apiUser.isGestor,
    }
  }

  async function login(credentials) {
    if (!credentials.email || !credentials.password) {
      return { success: false, error: 'Preencha todos os campos.' }
    }

    try {
      const response = await autenticarUsuario({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      })

      if (!response?.success || !response.user) {
        return { success: false, error: response?.error || 'Usuario ou senha invalida.' }
      }

      persistAuth(mapUser(response.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: error?.body?.error || error?.body?.Error || error?.message || 'Falha ao autenticar.' }
    }
  }

  async function register({ fullName, email, password, confirmPassword }) {
    if (!fullName || !email || !password || !confirmPassword) {
      return { success: false, error: 'Preencha todos os campos do cadastro.' }
    }

    try {
      const response = await registrarUsuario({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      })

      if (!response?.success || !response.user) {
        return { success: false, error: response?.error || 'Nao foi possivel criar o usuario.' }
      }

      persistAuth(mapUser(response.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: error?.body?.error || error?.body?.Error || error?.message || 'Falha ao criar cadastro.' }
    }
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

  return { isAuthenticated, currentUser, isGestor, needsOnboarding, login, register, logout, completeOnboarding }
})
