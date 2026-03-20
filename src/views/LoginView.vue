<template>
  <main class="login" role="main">

    <!-- Header: CPTM brand band -->
    <header class="login__header" role="banner">
      <div class="login__logo">
        <span class="login__logo-text" aria-label="CPTM">CPTM</span>
        <LogoBadge :size="32" />
      </div>
      <p class="login__header-sub">Sistema de Controle Ambiental</p>
    </header>

    <!-- Form body -->
    <div class="login__body" role="region" aria-label="Formulário de acesso">

      <h1 class="login__title">Acesse sua conta</h1>
      <p class="login__desc">Use seu e-mail ou matrícula funcional</p>

      <!-- Demo credentials info -->
      <div class="login__demo" role="note" aria-label="Credenciais de demonstração">
        <strong>Funcionário:</strong> carlos.silva@cptm.sp.gov.br / cptm2024<br/>
        <strong>Gestor:</strong> gestor@cptm.sp.gov.br / gestor2024
      </div>

      <!-- Error message -->
      <Transition name="fade">
        <div v-if="erro" class="login__error" role="alert">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {{ erro }}
        </div>
      </Transition>

      <!-- Login form -->
      <form class="login__form" @submit.prevent="handleLogin" novalidate>

        <!-- Email / Matrícula -->
        <div class="campo-grupo">
          <label class="campo-label" for="email">E-mail ou Matrícula</label>
          <div class="campo-wrapper">
            <svg class="campo-icone" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <input
              id="email"
              v-model="form.email"
              type="email"
              inputmode="email"
              autocomplete="username"
              class="campo-input campo-input--icone"
              placeholder="seu@email.com"
              required
              aria-required="true"
              :aria-invalid="erro ? 'true' : undefined"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="campo-grupo">
          <label class="campo-label" for="senha">Senha</label>
          <div class="campo-wrapper">
            <svg class="campo-icone" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <input
              id="senha"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              class="campo-input campo-input--icone"
              style="padding-right: 52px"
              placeholder="••••••••"
              required
              aria-required="true"
              :aria-invalid="erro ? 'true' : undefined"
            />
            <button
              type="button"
              class="btn-toggle-senha"
              :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="showPassword = !showPassword"
            >
              <!-- Eye / eye-off -->
              <svg v-if="!showPassword" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Remember + Forgot -->
        <div class="login__options">
          <label class="checkbox-wrapper">
            <input v-model="form.remember" type="checkbox" />
            <span class="checkbox-label">Lembrar acesso</span>
          </label>
          <button type="button" class="login__forgot" @click="showForgot = true">
            Esqueci a senha
          </button>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          class="btn btn--primario login__btn-submit"
          :disabled="loading"
        >
          <svg v-if="!loading" viewBox="0 0 24 24" fill="white" width="22" height="22" aria-hidden="true">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
          <span v-if="loading" class="login__spinner" aria-hidden="true"></span>
          {{ loading ? 'Autenticando...' : 'Entrar' }}
        </button>

      </form>

      <!-- Footer note -->
      <footer class="login__footer">
        <p class="login__footer-text">
          Acesso restrito a colaboradores da CPTM<br/>
          Em caso de problemas, contate o suporte TI
        </p>
      </footer>
    </div>

    <!-- Forgot password modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showForgot"
          class="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-title"
          @click.self="showForgot = false"
        >
          <div class="modal-card">
            <h2 id="forgot-title" class="modal-title">Recuperar Senha</h2>
            <p class="modal-desc">
              Informe seu e-mail funcional e enviaremos as instruções de recuperação.
            </p>
            <div v-if="forgotMsg" class="modal-feedback" :class="forgotMsg.type">{{ forgotMsg.text }}</div>
            <form @submit.prevent="handleForgot" novalidate>
              <div class="campo-grupo">
                <label class="campo-label" for="forgot-email">E-mail</label>
                <input
                  id="forgot-email"
                  v-model="forgotEmail"
                  type="email"
                  inputmode="email"
                  autocomplete="email"
                  class="campo-input"
                  placeholder="seu@cptm.sp.gov.br"
                  required
                />
              </div>
              <div class="modal-actions">
                <button type="submit" class="btn btn--primario">Enviar Instruções</button>
                <button type="button" class="btn btn--secundario" @click="showForgot = false">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LogoBadge from '@/components/LogoBadge.vue'

const router  = useRouter()
const auth    = useAuthStore()

const form = reactive({ email: '', password: '', remember: false })
const erro    = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showForgot = ref(false)
const forgotEmail = ref('')
const forgotMsg   = ref(null)

async function handleLogin() {
  erro.value = ''
  if (!form.email.trim() || !form.password.trim()) {
    erro.value = 'Preencha e-mail e senha para continuar.'
    return
  }
  loading.value = true
  // Simulate async auth
  await new Promise(r => setTimeout(r, 800))
  const result = auth.login({ email: form.email, password: form.password })
  loading.value = false
  if (result.success) {
    if (auth.isGestor) {
      router.replace('/gestor')
    } else {
      router.replace(auth.needsOnboarding ? '/onboarding' : '/dashboard')
    }
  } else {
    erro.value = result.error || 'Credenciais inválidas.'
  }
}

async function handleForgot() {
  if (!forgotEmail.value.trim()) {
    forgotMsg.value = { type: 'modal-feedback--erro', text: 'Informe seu e-mail.' }
    return
  }
  forgotMsg.value = { type: 'modal-feedback--sucesso', text: 'Instruções enviadas! Verifique seu e-mail.' }
  setTimeout(() => { showForgot.value = false; forgotMsg.value = null }, 2000)
}
</script>

<style scoped>
/* ---- Screen layout ---- */
.login {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--cptm-branco);
}

/* ---- Header ---- */
.login__header {
  background: linear-gradient(160deg, #C8102E 0%, #9B0B22 100%);
  padding: calc(48px + var(--safe-top)) var(--s-lg) 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}
/* Wave curve */
.login__header::after {
  content: '';
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 200%;
  height: 100px;
  background: var(--cptm-branco);
  border-radius: 50%;
}
.login__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1;
}
.login__logo-text {
  font-size: clamp(1.5rem, 7vw, 2rem);
  font-weight: 900;
  color: white;
  letter-spacing: 0.1em;
  line-height: 1;
}
.login__header-sub {
  font-size: clamp(0.68rem, 2.5vw, 0.8rem);
  color: rgba(255,255,255,.75);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  z-index: 1;
}

/* ---- Body ---- */
.login__body {
  flex: 1;
  padding: 48px var(--s-lg) var(--s-xl);
  display: flex;
  flex-direction: column;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  animation: fadeInUp 0.45s 0.1s ease both;
}
.login__title {
  font-size: var(--txt-xl);
  font-weight: 800;
  color: var(--cptm-cinza-escuro);
  margin-bottom: 6px;
}
.login__desc {
  font-size: var(--txt-sm);
  color: var(--cptm-cinza-claro);
  margin-bottom: var(--s-xl);
}
.login__demo {
  margin-top: calc(var(--s-md) * -1);
  margin-bottom: var(--s-lg);
  padding: var(--s-sm) var(--s-md);
  border-radius: var(--r-md);
  background: var(--status-enviada-bg);
  border: 1px solid #90CAF9;
  color: var(--status-enviada);
  font-size: var(--txt-xs);
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1.5;
}
.login__form {
  display: flex;
  flex-direction: column;
}

/* Toggle senha */
.btn-toggle-senha {
  position: absolute;
  right: var(--s-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--cptm-cinza-claro);
  padding: var(--s-xs);
  display: flex;
  border-radius: var(--r-sm);
  min-height: auto;
  width: auto;
}
.btn-toggle-senha:hover { color: var(--cptm-cinza-medio); }

/* Options row */
.login__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--s-lg);
  margin-top: var(--s-xs);
  flex-wrap: wrap;
  gap: var(--s-sm);
}
.login__forgot {
  font-size: var(--txt-sm);
  color: var(--cptm-vermelho);
  font-weight: 600;
  cursor: pointer;
  background: none;
  border: none;
  text-decoration: underline;
  text-underline-offset: 2px;
  min-height: auto;
  width: auto;
  padding: 0;
}
.login__forgot:hover { color: var(--cptm-vermelho-escuro); }

/* Submit */
.login__btn-submit {
  margin-bottom: var(--s-lg);
  font-size: var(--txt-lg);
}
.login__btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.login__spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Error */
.login__error {
  display: flex;
  align-items: center;
  gap: var(--s-sm);
  background: #FFEBEE;
  border: 1.5px solid var(--cptm-vermelho);
  border-radius: var(--r-md);
  padding: var(--s-md);
  margin-bottom: var(--s-md);
  font-size: var(--txt-sm);
  color: var(--cptm-vermelho-escuro);
  font-weight: 500;
}
.login__error svg { width: 20px; height: 20px; flex-shrink: 0; }

/* Footer */
.login__footer {
  margin-top: auto;
  text-align: center;
  padding: var(--s-md) 0 calc(var(--s-xl) + var(--safe-bottom));
}
.login__footer-text {
  font-size: var(--txt-xs);
  color: var(--cptm-cinza-claro);
  line-height: 1.6;
}

/* Modal */
.modal-title {
  font-size: var(--txt-lg);
  font-weight: 800;
  color: var(--cptm-cinza-escuro);
  margin-bottom: 8px;
}
.modal-desc {
  font-size: var(--txt-sm);
  color: var(--cptm-cinza-claro);
  margin-bottom: var(--s-lg);
}
.modal-feedback {
  border-radius: var(--r-md);
  padding: var(--s-sm) var(--s-md);
  margin-bottom: var(--s-md);
  font-size: var(--txt-sm);
  font-weight: 600;
  border: 1.5px solid transparent;
}
.modal-feedback--erro {
  background: #FFEBEE;
  border-color: var(--cptm-vermelho);
  color: var(--cptm-vermelho-escuro);
}
.modal-feedback--sucesso {
  background: var(--verde-suave);
  border-color: var(--verde-principal);
  color: var(--verde-hover);
}
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: var(--s-sm);
  margin-top: var(--s-md);
}

/* Transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
