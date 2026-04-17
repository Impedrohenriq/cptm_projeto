import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'cptm_notificacoes_v1'
const MAX_ITEMS = 40

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readStored() {
  if (typeof localStorage === 'undefined') return []
  return safeParse(localStorage.getItem(STORAGE_KEY) || '[]')
}

function persist(items) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `notif-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

function normalizeType(type) {
  if (type === 'success' || type === 'warning' || type === 'error' || type === 'info') {
    return type
  }

  return 'info'
}

export const useNotificacoesStore = defineStore('notificacoes', () => {
  const items = ref(readStored())

  const ordenadas = computed(() => [...items.value].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)))
  const naoLidas = computed(() => ordenadas.value.filter((item) => item.read !== true))
  const naoLidasCount = computed(() => naoLidas.value.length)

  function push(payload, { dedupeMs = 7000 } = {}) {
    const title = String(payload?.title || '').trim()
    const message = String(payload?.message || '').trim()

    if (!title || !message) {
      return null
    }

    const now = Date.now()
    const dedupeKey = String(payload?.dedupeKey || `${title}|${message}`)
    const existing = items.value.find((item) => item.dedupeKey === dedupeKey && now - item.createdAt < dedupeMs)

    if (existing) {
      return existing
    }

    const next = {
      id: makeId(),
      title,
      message,
      type: normalizeType(payload?.type),
      createdAt: now,
      read: false,
      dedupeKey,
      localId: payload?.localId ?? null,
    }

    items.value = [next, ...items.value].slice(0, MAX_ITEMS)
    persist(items.value)
    return next
  }

  function marcarComoLida(id) {
    items.value = items.value.map((item) => (item.id === id ? { ...item, read: true } : item))
    persist(items.value)
  }

  function marcarTodasComoLidas() {
    if (naoLidasCount.value === 0) return
    items.value = items.value.map((item) => ({ ...item, read: true }))
    persist(items.value)
  }

  function limpar() {
    items.value = []
    persist(items.value)
  }

  return {
    items,
    ordenadas,
    naoLidas,
    naoLidasCount,
    push,
    marcarComoLida,
    marcarTodasComoLidas,
    limpar,
  }
})
