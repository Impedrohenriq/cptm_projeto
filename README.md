# CPTM Frontend

Frontend mobile-first do formulario de efluentes em Vue 3 + Pinia + Vite PWA.

## O que mudou

A aplicacao agora usa um fluxo offline-first real.

Antes:

- autosave em `localStorage`
- fotos como `Data URL`
- falha de API podia deixar item com cara de enviado

Agora:

- payload, fila e fotos persistem no `IndexedDB`
- fotos ficam em `Blob`
- `syncStatus` explicito controla a interface
- o app so marca como sincronizado depois da confirmacao da API

## Estados de Sincronizacao

- `rascunho`
- `pendente_sync`
- `sincronizando`
- `sincronizado`
- `erro_sync`

## Principais Modulos

- `src/stores/inspecoes.js`
  - orquestra rascunho, fila, retry e reconciliacao com o servidor

- `src/services/offlineDb.js`
  - camada de IndexedDB para inspecoes, fila e metadados

- `src/services/offlineMedia.js`
  - prepara fotos offline, persiste em Blob e serializa para a API no envio

- `src/services/syncEngine.js`
  - sincroniza pendencias item a item

- `src/services/api.js`
  - health check, chamadas HTTP e mapeamento DTO

## Fluxo Offline-First

1. O usuario preenche o formulario
2. O autosave grava o rascunho no IndexedDB
3. Ao clicar em enviar sem conectividade util, o item vai para `pendente_sync`
4. O app escuta o evento `online`
5. Quando internet e API estiverem disponiveis, a fila e reenviada
6. Somente depois da resposta positiva da API o item vira `sincronizado`

## Health Check

O frontend consulta `GET /health` antes de sincronizar.

Nao basta `navigator.onLine` estar `true`.

## Fotos

- armazenadas como `Blob` no IndexedDB
- preview recriado ao reabrir o formulario
- convertidas para Base64 apenas no envio
- compatibilidade preservada com o backend atual

## Como testar

```bash
npm install
npm run build
npm run dev
```

Cenarios importantes:

1. preencher offline e recarregar a pagina
2. anexar fotos offline e recarregar a pagina
3. enviar offline e validar `pendente_sync`
4. desligar apenas a API com internet ativa e validar fila parada
5. usar retry manual no dashboard
6. voltar com internet + API e confirmar sincronizacao automatica
