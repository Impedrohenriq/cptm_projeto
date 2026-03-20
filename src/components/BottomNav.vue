<template>
  <nav class="bottom-nav" role="navigation" aria-label="Navegação principal">

    <!-- Painel -->
    <button
      class="nav-item"
      :class="{ ativo: active === 'dashboard' }"
      aria-label="Painel"
      :aria-current="active === 'dashboard' ? 'page' : undefined"
      @click="$router.push('/dashboard')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
      </svg>
      <span>Painel</span>
    </button>

    <!-- Botão central Nova Inspeção -->
    <div class="nav-item nav-item--central">
      <button
        class="nav-central-btn"
        aria-label="Nova inspeção"
        @click="$router.push('/formulario')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="white">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
      </button>
      <span>Nova</span>
    </div>

    <!-- Histórico -->
    <button
      class="nav-item"
      :class="{ ativo: active === 'historico' }"
      aria-label="Histórico de inspeções"
      @click="$router.push('/dashboard')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
      </svg>
      <span>Histórico</span>
    </button>

  </nav>
</template>

<script setup>
defineProps({
  active: { type: String, default: 'dashboard' }
})
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(var(--bottom-nav-h) + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  background: var(--cptm-branco);
  border-top: 1px solid var(--cptm-cinza-borda);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  box-shadow: 0 -4px 12px rgba(0,0,0,.08);
  max-width: 480px;
  /* Centre on wider screens */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

/* Full-width on narrow screens */
@media (max-width: 480px) {
  .bottom-nav {
    transform: none;
    left: 0;
    width: 100%;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  padding: var(--s-sm) var(--s-md);
  border-radius: var(--r-md);
  background: none;
  border: none;
  flex: 1;
  color: var(--cptm-cinza-claro);
  -webkit-tap-highlight-color: transparent;
  transition: background-color var(--t-fast);
}
.nav-item:hover { background: var(--cptm-cinza-fundo); }

.nav-item svg {
  width: 24px;
  height: 24px;
  transition: color var(--t-fast);
}
.nav-item span {
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.nav-item.ativo { color: var(--cptm-vermelho); }
.nav-item.ativo span { font-weight: 700; }

/* Central button */
.nav-item--central {
  position: relative;
  top: -16px;
  flex: none;
}
.nav-central-btn {
  width: 56px;
  height: 56px;
  background: var(--cptm-vermelho);
  border-radius: 50%;
  border: 4px solid var(--cptm-branco);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(200,16,46,.45);
  transition: transform var(--t-fast);
  -webkit-tap-highlight-color: transparent;
}
.nav-central-btn:active { transform: scale(0.92); }
.nav-central-btn svg { width: 26px; height: 26px; }
.nav-item--central span {
  display: block;
  margin-top: 6px;
  font-size: 0.65rem;
  color: var(--cptm-cinza-claro);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: center;
}
</style>
