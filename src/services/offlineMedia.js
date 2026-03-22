const MAX_IMAGE_WIDTH = 1600
const MAX_IMAGE_HEIGHT = 1200
const JPEG_QUALITY = 0.82

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Nao foi possivel carregar a imagem selecionada.'))
      image.src = reader.result
    }
    reader.onerror = () => reject(reader.error ?? new Error('Nao foi possivel ler o arquivo da foto.'))
    reader.readAsDataURL(file)
  })
}

function shouldResize(width, height) {
  return width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT
}

async function optimizeImageBlob(file) {
  if (!file.type.startsWith('image/')) {
    return file
  }

  const image = await loadImage(file)
  const scale = Math.min(
    1,
    MAX_IMAGE_WIDTH / image.width,
    MAX_IMAGE_HEIGHT / image.height,
  )

  if (!shouldResize(image.width, image.height) && file.size <= 1024 * 1024) {
    return file
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * scale))
  canvas.height = Math.max(1, Math.round(image.height * scale))

  const context = canvas.getContext('2d')
  if (!context) {
    return file
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  const preferredType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => result ? resolve(result) : reject(new Error('Nao foi possivel comprimir a imagem.')),
      preferredType,
      JPEG_QUALITY,
    )
  })

  return blob
}

export async function fileToOfflinePhoto(file, index) {
  const blob = await optimizeImageBlob(file)
  return {
    idFoto: null,
    nrFoto: index + 1,
    nome: file.name,
    type: blob.type || file.type || 'image/jpeg',
    size: blob.size,
    orientacao: 'Paisagem/Horizontal',
    blob,
    src: URL.createObjectURL(blob),
  }
}

export function base64ToBlob(base64, mimeType = 'image/jpeg') {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new Blob([bytes], { type: mimeType })
}

function dataUrlToBlob(dataUrl) {
  const [metadata, base64] = dataUrl.split(',')
  const mimeType = metadata.match(/data:(.*?);base64/)?.[1] ?? 'image/jpeg'
  return base64ToBlob(base64, mimeType)
}

export async function blobToBase64(blob) {
  const buffer = await blob.arrayBuffer()
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }

  return btoa(binary)
}

export async function normalizePhotosForStorage(photos = []) {
  const normalized = []

  for (const [index, photo] of photos.entries()) {
    if (!photo) continue

    let blob = photo.blob ?? null
    if (!blob && typeof photo.src === 'string' && photo.src.startsWith('data:')) {
      blob = dataUrlToBlob(photo.src)
    }
    if (!blob && typeof photo.base64 === 'string') {
      blob = base64ToBlob(photo.base64, photo.type)
    }
    if (!blob && typeof photo.fotoBase64 === 'string') {
      blob = base64ToBlob(photo.fotoBase64, photo.type)
    }

    normalized.push({
      idFoto: photo.idFoto ?? null,
      nrFoto: photo.nrFoto ?? index + 1,
      nome: photo.nome ?? `foto-${index + 1}.jpg`,
      type: photo.type ?? blob?.type ?? 'image/jpeg',
      size: photo.size ?? blob?.size ?? null,
      orientacao: photo.orientacao ?? photo.dsOrientacao ?? 'Paisagem/Horizontal',
      blob,
    })
  }

  return normalized
}

export function attachPreviewUrls(payload) {
  const photos = (payload.fotos ?? []).map((photo) => {
    if (!photo?.blob) return { ...photo, src: photo?.src ?? null }
    return { ...photo, src: URL.createObjectURL(photo.blob) }
  })

  return { ...payload, fotos: photos }
}

export function revokePreviewUrls(payload) {
  for (const photo of payload?.fotos ?? []) {
    if (typeof photo?.src === 'string' && photo.src.startsWith('blob:')) {
      URL.revokeObjectURL(photo.src)
    }
  }
}

export async function normalizePayloadForStorage(payload) {
  return {
    ...payload,
    fotos: await normalizePhotosForStorage(payload.fotos ?? []),
  }
}
