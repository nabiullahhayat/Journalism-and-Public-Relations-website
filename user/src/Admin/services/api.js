const API_BASE = import.meta.env.VITE_API_URL ?? ''

const normalizeResponse = async (response) => {
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText || 'Failed to load data'
    throw new Error(message)
  }
  return data
}

const buildUrl = (resource, action, id) => {
  const basePath = `${API_BASE}/api/v1/${resource.path}`
  if (action === 'list') {
    return resource.listPath ? `${basePath}${resource.listPath}` : basePath
  }
  if (action === 'get') {
    return `${basePath}/${id}`
  }
  if (action === 'create') {
    return `${basePath}/create`
  }
  if (action === 'update') {
    return `${basePath}/update/${id}`
  }
  if (action === 'delete') {
    return `${basePath}/delete/${id}`
  }
  return basePath
}

const request = async (url, options = {}) => {
  const response = await fetch(url, options)
  return normalizeResponse(response)
}

const getResourceId = (item) => item.id || item._id || null

export const listResource = async (resource) => {
  if (!resource.backend) {
    return []
  }
  const url = buildUrl(resource, 'list')
  try {
    const data = await request(url)
    const payload = data?.data ?? data
    if (Array.isArray(payload)) {
      return payload
    }
    if (payload && typeof payload === 'object') {
      return [payload]
    }
    return []
  } catch {
    return []
  }
}

export const createResource = async (resource, payload) => {
  if (!resource.backend) {
    throw new Error('Backend endpoint not available for this resource')
  }
  const url = buildUrl(resource, 'create')
  const data = await request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return data?.data ?? data
}

export const updateResource = async (resource, id, payload) => {
  if (!resource.backend) {
    throw new Error('Backend endpoint not available for this resource')
  }
  const url = buildUrl(resource, 'update', id)
  const data = await request(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return data?.data ?? data
}

export const deleteResource = async (resource, id) => {
  if (!resource.backend) {
    throw new Error('Backend endpoint not available for this resource')
  }
  const url = buildUrl(resource, 'delete', id)
  const data = await request(url, {
    method: 'DELETE',
  })
  return data
}

export const getItemId = getResourceId
