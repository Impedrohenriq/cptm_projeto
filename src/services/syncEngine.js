import * as api from '@/services/api.js'

async function recoverConflictWithUpdate(payload) {
  await api.atualizar(payload)
  try {
    return await api.buscarPorChave(payload.chavePrimariaMa)
  } catch {
    return payload
  }
}

export async function syncInspectionRecord(record) {
  const payload = record.payload ?? record
  const operation = record.pendingOperation ?? (record.serverConfirmed ? 'update' : 'create')

  if (operation === 'create') {
    try {
      return {
        syncedPayload: await api.criar(payload),
        resolvedOperation: 'update',
      }
    } catch (error) {
      if (error?.status === 409) {
        return {
          syncedPayload: await recoverConflictWithUpdate(payload),
          resolvedOperation: 'update',
        }
      }
      throw error
    }
  }

  try {
    await api.atualizar(payload)
    return {
      syncedPayload: await api.buscarPorChave(payload.chavePrimariaMa).catch(() => payload),
      resolvedOperation: 'update',
    }
  } catch (error) {
    if (error?.status === 404) {
      return {
        syncedPayload: await api.criar(payload),
        resolvedOperation: 'update',
      }
    }
    throw error
  }
}

export function isRetryableSyncError(error) {
  if (!error) return false
  if (error.isNetworkError) return true
  if (typeof error.status !== 'number') return true
  return error.status >= 500 || error.status === 408 || error.status === 429
}

export function toSyncErrorMessage(error) {
  if (!error) return 'Falha desconhecida durante a sincronizacao.'
  if (error.isNetworkError) return 'Sem conexao com a API. O item permaneceu na fila local.'
  if (error.status === 400) return 'A API rejeitou o payload. Revise os dados antes de tentar novamente.'
  if (error.status === 404) return 'O registro nao foi encontrado no servidor durante a atualizacao.'
  if (error.status === 409) return 'Conflito detectado ao sincronizar o registro.'
  if (error.status >= 500) return 'A API respondeu com erro interno. O item permaneceu na fila local.'
  return error.message ?? 'Falha ao sincronizar o registro.'
}