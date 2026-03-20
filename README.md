# CPTM Ambiental — Vue Mobile

Versão mobile-first do sistema CPTM Ambiental, construída com **Vue 3 + Vite + Pinia** e suporte a PWA.

## Stack

| Tecnologia | Versão |
|---|---|
| Vue | 3.4 |
| Vue Router | 4 |
| Pinia | 2 |
| Vite | 5 |
| vite-plugin-pwa | 0.19 |

## Instalação e execução

```bash
# Entrar na pasta
cd vue-mobile

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (http://localhost:5173)
npm run dev

# Gerar build de produção (pasta dist/)
npm run build

# Visualizar o build gerado localmente
npm run preview
```

## Estrutura de arquivos

```
vue-mobile/
├── index.html                  # Shell HTML (monta #app)
├── package.json
├── vite.config.js              # Vite + PWA plugin
└── src/
    ├── main.js                 # Entry point
    ├── App.vue                 # Root: RouterView + NetworkBar + transições
    ├── router/
    │   └── index.js            # 5 rotas + guard de autenticação
    ├── stores/
    │   ├── auth.js             # Login, logout, onboarding (Pinia)
    │   └── inspecoes.js        # CRUD de inspeções + demo data (Pinia)
    ├── composables/
    │   ├── useNetwork.js       # Detecção online/offline
    │   ├── useSaudacao.js      # "Bom dia/tarde/noite"
    │   └── useSwipe.js         # Detecção de swipe touch
    ├── components/
    │   ├── BottomNav.vue       # Barra de navegação inferior
    │   ├── StatusBadge.vue     # Badge: rascunho | enviada | analisada
    │   ├── IconLeaf.vue        # Ícone SVG da folha
    │   ├── LogoBadge.vue       # Círculo verde com folha (logo)
    │   ├── NetworkBar.vue      # Barra de aviso offline
    │   └── formulario/
    │       ├── EtapaLocal.vue        # Etapa 1 — Linha, Estação, GPS
    │       ├── EtapaTipo.vue         # Etapa 2 — Tipo de ocorrência (grade)
    │       ├── EtapaQuestionario.vue # Etapa 3 — Questionário dinâmico
    │       ├── EtapaEvidencias.vue   # Etapa 4 — Câmera / galeria / grid
    │       └── EtapaFinalizacao.vue  # Etapa 5 — Resumo + checklist
    ├── views/
    │   ├── SplashView.vue      # Tela 1 — Splash animado
    │   ├── LoginView.vue       # Tela 2 — Login + esqueci senha
    │   ├── OnboardingView.vue  # Tela 3 — Carrossel 3 slides
    │   ├── DashboardView.vue   # Tela 4 — Painel + lista de inspeções
    │   └── FormularioView.vue  # Tela 5 — Formulário multi-etapas
    └── assets/
        └── styles/
            ├── variables.css   # Tokens de design (cores, espaços, tipografia)
            └── main.css        # Reset + componentes globais
```

## Credenciais de demonstração

Login com qualquer e-mail terminado em `@cptm.sp.gov.br` e senha de 6+ caracteres.

Exemplo:
- **E-mail:** `carlos@cptm.sp.gov.br`
- **Senha:** `senha123`

## PWA

O projeto gera automaticamente um `manifest.json` e service worker via **Workbox** ao executar `npm run build`. Para testar o PWA, use `npm run preview` após o build.

## Responsividade

- Layout mobile-first: testado de 320px a 428px (iPhone SE → iPhone 14 Pro Max)
- Safe areas para notch/Dynamic Island (`env(safe-area-inset-*)`)
- `min-height: 100dvh` (dynamic viewport units) para evitar problemas com barras do browser iOS
- Alvos de toque mínimos de 56px (WCAG 2.5.5)
- Transições suaves entre telas com `<Transition mode="out-in">`
