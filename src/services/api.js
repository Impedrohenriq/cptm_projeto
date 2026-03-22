import { blobToBase64 } from '@/services/offlineMedia.js'

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'
const ENDPOINT = `${BASE}/api/formularios-efluente`
const HEALTH_ENDPOINT = `${BASE}/health`
const AUTH_ENDPOINT = `${BASE}/api/auth`

function headers() {
  return { 'Content-Type': 'application/json' }
}

function buildApiError({ status, message, body, isNetworkError = false }) {
  const error = new Error(message)
  error.status = status
  error.body = body
  error.isNetworkError = isNetworkError
  return error
}

async function parseErrorBody(res) {
  const text = await res.text().catch(() => '')

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function checarResposta(res) {
  if (res.ok) {
    return res.status === 204 ? null : res.json()
  }

  const body = await parseErrorBody(res)
  const message = typeof body === 'string'
    ? `[${res.status}] ${body}`
    : `[${res.status}] ${body?.title ?? body?.message ?? res.statusText}`

  throw buildApiError({ status: res.status, message, body })
}

async function fetchJson(url, options = {}) {
  try {
    const response = await fetch(url, options)
    return await checarResposta(response)
  } catch (error) {
    if (error instanceof TypeError) {
      throw buildApiError({
        status: 0,
        message: 'Falha de rede ao acessar a API.',
        isNetworkError: true,
      })
    }

    throw error
  }
}

export function buildChavePrimariaMa(inspecao) {
  const ano = inspecao.dataEmissao
    ? new Date(inspecao.dataEmissao).getFullYear()
    : new Date().getFullYear()

  const linhaNum = (inspecao.linha ?? '').match(/\d+/)?.[0]?.padStart(2, '0') ?? '00'
  const sigla = (inspecao.nomeContratada ?? '')
    .split(' - ')
    .pop()
    ?.replace(/\s/g, '')
    .substring(0, 10) ?? 'CPTM'
  const numero = String(inspecao.numFormulario ?? 1).padStart(6, '0')

  return inspecao.chavePrimariaMa ?? `EEA.EF-A.${ano}-L.${linhaNum}-${sigla}-N.${numero}`
}

function normalizePhotoMime(photo) {
  return photo.type || photo.blob?.type || 'image/jpeg'
}

async function serializeFoto(photo, index) {
  const fotoBase64 = photo.blob
    ? await blobToBase64(photo.blob)
    : photo.base64 ?? photo.fotoBase64 ?? null

  return {
    idFoto: photo.idFoto ?? null,
    nrFoto: photo.nrFoto ?? index + 1,
    fotoBase64,
    dsOrientacao: photo.orientacao ?? photo.dsOrientacao ?? 'Paisagem/Horizontal',
    mimeType: normalizePhotoMime(photo),
  }
}

export async function paraDto(inspecao) {
  const chavePrimariaMa = buildChavePrimariaMa(inspecao)
  const isoData = (valor) => valor ? new Date(valor).toISOString() : new Date().toISOString()

  return {
    chavePrimariaMa,
    nrElementoMonit: String(inspecao.emNumero ?? 1).padStart(6, '0'),
    nmElementoMonit: inspecao.emNome ?? null,
    nmContratada: inspecao.nomeContratada ?? '',
    nrContrato: inspecao.numContrato ?? null,
    nmLocalEscopo: inspecao.localEscopo ?? null,
    nmRepresentante: inspecao.representante ?? null,
    sgAreaMeioAmbiente: inspecao.siglaArea ?? null,
    nmAreaGestoraCptm: inspecao.nomeAreaGestora ?? null,
    cdIdentAreaGestora: inspecao.idAreaGestora ?? null,
    sgAreaGestoraCptm: inspecao.siglaAreaGestora ?? null,
    nmSupervisoraAmbiental: inspecao.nomeSupervisora ?? null,
    nmAutorCadastramento: inspecao.autorCadastro ?? '',
    nmResponsavelTecnico: inspecao.responsavelTecnico ?? '',
    nrRegistroProfissional: inspecao.registroProfissional ?? null,
    dsDocRespTecnica: inspecao.docRT ?? null,
    dsNaturezaPga: inspecao.naturezaPGA ?? null,
    dsTipoFormulario: 'Formulario de Cadastramento - FDC (FDC-EEA.EF)',
    dtEmissaoFormulario: isoData(inspecao.dataEmissao),
    nrFormulario: String(inspecao.numFormulario ?? 1).padStart(6, '0'),
    nmAutorFormulario: inspecao.autorFormulario ?? null,
    nmArquivoFdc: inspecao.nomeArquivoFdc ?? null,
    cdArquivoFdc: inspecao.codigoArquivoFdc ?? null,
    dtCadastramento: isoData(inspecao.dataCadastramento),
    hrCadastramento: inspecao.horaCadastramento ?? null,
    nmMunicipio: inspecao.municipio ?? null,
    nmLinhaCptm: inspecao.linha ?? null,
    nmEstacaoCptm: inspecao.estacao ?? null,
    nrViaLinhaCptm: inspecao.via ?? null,
    dsTrechoSentidoCptm: inspecao.trechoSentido ?? null,
    nrKmPoste: inspecao.kmPoste ?? null,
    nrLatitude: inspecao.latitude ?? null,
    nrLongitude: inspecao.longitude ?? null,
    dsTipoAtividadeList: inspecao.tipoAtividadeListada ?? null,
    dsTipoAtividadeNlist: inspecao.tipoAtividadeNaoListada ?? null,
    dsTipoDraList: inspecao.tipoDRAListado ?? null,
    dsTipoDraNlist: inspecao.tipoDRANaoListado ?? null,
    cdIdentificadorDra: inspecao.codigoDRA ?? null,
    dtValidadeDra: inspecao.dataValidadeDRA ? new Date(inspecao.dataValidadeDRA).toISOString() : null,
    dsTipoAtividadeCptm: inspecao.tipoAtividadeCPTM ?? null,
    nmLocalEdificacao: inspecao.nomeLocal ?? null,
    dsLocalComplemento: inspecao.complementoLocal ?? null,
    dsOrigemEfluente: inspecao.origemEfluente ?? null,
    dsFonteGeradora: inspecao.fonteGeradora ?? null,
    nrQuantidadeLitros: inspecao.quantidadeLitros ?? null,
    dsTipoDestinacao: inspecao.tipoDestinacao ?? null,
    dsTipoVeiculo: inspecao.tipoVeiculo ?? null,
    cdPlacaVeiculo: inspecao.placaVeiculo ?? null,
    cdGuiaRemessa: inspecao.codigoGuiaRemessa ?? null,
    nrDistanciaViaM: inspecao.distanciaVia ?? null,
    dsObservacoesCadastro: inspecao.observacoesGerais ?? null,
    fotos: await Promise.all((inspecao.fotos ?? []).map((foto, index) => serializeFoto(foto, index))),
  }
}

export function doDto(dto) {
  const dataCadastro = dto.dtCadastramento?.split('T')[0]
  const horaCadastro = dto.hrCadastramento

  let uploadedAt = Date.now()
  if (dataCadastro) {
    const horario = horaCadastro && /^\d{2}:\d{2}$/.test(horaCadastro) ? `${horaCadastro}:00` : '00:00:00'
    const parsed = new Date(`${dataCadastro}T${horario}`)
    if (!Number.isNaN(parsed.getTime())) {
      uploadedAt = parsed.getTime()
    }
  }

  return {
    chavePrimariaMa: dto.chavePrimariaMa,
    nomeContratada: dto.nmContratada,
    numContrato: dto.nrContrato,
    localEscopo: dto.nmLocalEscopo,
    representante: dto.nmRepresentante,
    siglaArea: dto.sgAreaMeioAmbiente,
    nomeAreaGestora: dto.nmAreaGestoraCptm,
    idAreaGestora: dto.cdIdentAreaGestora,
    siglaAreaGestora: dto.sgAreaGestoraCptm,
    nomeSupervisora: dto.nmSupervisoraAmbiental,
    autorCadastro: dto.nmAutorCadastramento,
    responsavelTecnico: dto.nmResponsavelTecnico,
    registroProfissional: dto.nrRegistroProfissional,
    docRT: dto.dsDocRespTecnica,
    naturezaPGA: dto.dsNaturezaPga,
    dataEmissao: dto.dtEmissaoFormulario?.split('T')[0],
    numFormulario: parseInt(dto.nrFormulario, 10),
    autorFormulario: dto.nmAutorFormulario,
    nomeArquivoFdc: dto.nmArquivoFdc,
    codigoArquivoFdc: dto.cdArquivoFdc,
    dataCadastramento: dataCadastro,
    horaCadastramento: horaCadastro,
    uploadedAt,
    emNumero: parseInt(dto.nrElementoMonit, 10),
    emNome: dto.nmElementoMonit,
    municipio: dto.nmMunicipio,
    linha: dto.nmLinhaCptm,
    estacao: dto.nmEstacaoCptm,
    via: dto.nrViaLinhaCptm,
    trechoSentido: dto.dsTrechoSentidoCptm,
    kmPoste: dto.nrKmPoste,
    latitude: dto.nrLatitude,
    longitude: dto.nrLongitude,
    tipoAtividadeListada: dto.dsTipoAtividadeList,
    tipoAtividadeNaoListada: dto.dsTipoAtividadeNlist,
    tipoDRAListado: dto.dsTipoDraList,
    tipoDRANaoListado: dto.dsTipoDraNlist,
    codigoDRA: dto.cdIdentificadorDra,
    dataValidadeDRA: dto.dtValidadeDra?.split('T')[0],
    tipoAtividadeCPTM: dto.dsTipoAtividadeCptm,
    nomeLocal: dto.nmLocalEdificacao,
    complementoLocal: dto.dsLocalComplemento,
    origemEfluente: dto.dsOrigemEfluente,
    fonteGeradora: dto.dsFonteGeradora,
    quantidadeLitros: dto.nrQuantidadeLitros,
    tipoDestinacao: dto.dsTipoDestinacao,
    tipoVeiculo: dto.dsTipoVeiculo,
    placaVeiculo: dto.cdPlacaVeiculo,
    codigoGuiaRemessa: dto.cdGuiaRemessa,
    distanciaVia: dto.nrDistanciaViaM,
    observacoesGerais: dto.dsObservacoesCadastro,
    fotos: (dto.fotos ?? []).map((foto) => ({
      idFoto: foto.idFoto,
      nrFoto: foto.nrFoto,
      base64: foto.fotoBase64,
      orientacao: foto.dsOrientacao,
      type: foto.mimeType ?? 'image/jpeg',
    })),
    photosHydrated: Array.isArray(dto.fotos),
  }
}

export async function healthCheck() {
  try {
    const response = await fetch(HEALTH_ENDPOINT, { cache: 'no-store' })

    if (!response.ok) {
      throw buildApiError({
        status: response.status,
        message: `[${response.status}] Health check indisponivel.`,
      })
    }

    return true
  } catch (error) {
    if (error instanceof TypeError) {
      throw buildApiError({
        status: 0,
        message: 'Falha de rede ao consultar o health check da API.',
        isNetworkError: true,
      })
    }

    throw error
  }
}

export async function listar(pagina = 1, tamanho = 50) {
  const data = await fetchJson(`${ENDPOINT}?pagina=${pagina}&tamanho=${tamanho}`, {
    headers: headers(),
  })

  return (data.itens ?? data.Itens ?? []).map(doDto)
}

export async function buscarPorChave(chavePrimariaMa) {
  const data = await fetchJson(`${ENDPOINT}/${encodeURIComponent(chavePrimariaMa)}`, {
    headers: headers(),
  })

  return doDto(data)
}

export async function criar(inspecao) {
  const dto = await paraDto(inspecao)
  const data = await fetchJson(ENDPOINT, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(dto),
  })

  return doDto(data)
}

export async function atualizar(inspecao) {
  const dto = await paraDto(inspecao)
  await fetchJson(`${ENDPOINT}/${encodeURIComponent(dto.chavePrimariaMa)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(dto),
  })
}

export async function excluir(chavePrimariaMa) {
  await fetchJson(`${ENDPOINT}/${encodeURIComponent(chavePrimariaMa)}`, {
    method: 'DELETE',
    headers: headers(),
  })
}

export async function registrarUsuario({ fullName, email, password, confirmPassword }) {
  return fetchJson(`${AUTH_ENDPOINT}/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      fullName,
      email,
      password,
      confirmPassword,
    }),
  })
}

export async function autenticarUsuario({ email, password }) {
  return fetchJson(`${AUTH_ENDPOINT}/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      email,
      password,
    }),
  })
}
