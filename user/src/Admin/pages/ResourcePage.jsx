import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { resourceMap } from '../config/resourceConfig'
import { createResource, deleteResource, getItemId, listResource, updateResource } from '../services/api'
import DataTable from '../components/DataTable'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import DeleteConfirmation from '../components/DeleteConfirmation'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import FormField from '../components/FormField'

const defaultPageSize = 8

function ResourcePage() {
  const { pageKey } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resource = resourceMap[pageKey]

  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [formValues, setFormValues] = useState({})
  const [filterStatus, setFilterStatus] = useState('all')
  const [statusMessage, setStatusMessage] = useState('')

  const searchQuery = searchParams.get('search') ?? ''
  const [searchTerm, setSearchTerm] = useState(searchQuery)

  useEffect(() => {
    setSearchTerm(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if (!resource) {
      navigate('/admin')
      return
    }

    const loadItems = async () => {
      setLoading(true)
      setError(null)
      setStatusMessage('')
      try {
        const list = await listResource(resource)
        setItems(Array.isArray(list) ? list : [])
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (resource.backend) {
      loadItems()
    } else {
      setItems([])
      setLoading(false)
    }
  }, [resource, navigate])

  const columns = useMemo(() => {
    if (!resource) return []
    return [{ label: 'Title', key: resource.fields[0]?.name ?? 'id' },
      { label: 'Status', key: 'status' },
      { label: 'Updated', key: 'updatedAt' },
      { label: 'Actions', key: 'actions', sortable: false }]
  }, [resource])

  const filteredItems = useMemo(() => {
    if (!resource) return []
    return items.filter((item) => {
      const term = searchTerm.toLowerCase()
      if (term) {
        return resource.searchFields.some((field) => {
          return String(item[field] ?? '').toLowerCase().includes(term)
        })
      }
      if (filterStatus === 'active') {
        return computeStatus(item) === 'Published'
      }
      if (filterStatus === 'draft') {
        return computeStatus(item) === 'Draft'
      }
      return true
    })
  }, [items, resource, searchTerm, filterStatus])

  const currentPageItems = useMemo(() => {
    const start = (page - 1) * defaultPageSize
    return filteredItems.slice(start, start + defaultPageSize)
  }, [filteredItems, page])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / defaultPageSize))

  function computeStatus(item) {
    if (item.status) return item.status
    if (item.active !== undefined) return item.active ? 'Published' : 'Draft'
    if (item.createdAt || item.updatedAt) return 'Published'
    return Number(getItemId(item) || 0) % 2 === 0 ? 'Draft' : 'Published'
  }

  const handleOpenAdd = () => {
    setFormValues(resource.fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}))
    setEditItem(null)
    setSelectedItem(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    setFormValues(resource.fields.reduce((acc, field) => ({ ...acc, [field.name]: item[field.name] ?? '' }), {}))
    setEditItem(item)
    setSelectedItem(null)
    setModalOpen(true)
  }

  const handleOpenView = (item) => {
    setSelectedItem(item)
    setEditItem(null)
    setModalOpen(true)
  }

  const handleDelete = (item) => {
    setDeleteItem(item)
  }

  const handleConfirmDelete = async () => {
    if (!deleteItem || !resource.backend) return
    setSaving(true)
    setError(null)
    try {
      await deleteResource(resource, getItemId(deleteItem))
      setItems((prev) => prev.filter((item) => getItemId(item) !== getItemId(deleteItem)))
      setDeleteItem(null)
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!resource.backend) {
      setStatusMessage('This resource is not backed by a configured API yet.')
      return
    }

    setSaving(true)
    setError(null)
    setStatusMessage('')
    try {
      const result = editItem
        ? await updateResource(resource, getItemId(editItem), formValues)
        : await createResource(resource, formValues)

      const list = await listResource(resource)
      const nextItems = Array.isArray(list) ? list : []

      if (nextItems.length > 0) {
        setItems(nextItems)
      } else if (result && typeof result === 'object') {
        setItems((prev) => {
          if (editItem) {
            return prev.map((item) => (getItemId(item) === getItemId(editItem) ? result : item))
          }
          return [...prev, result]
        })
      }

      setModalOpen(false)
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (!resource) {
    return <EmptyState title="Resource not found" description="Please select a valid admin section." />
  }

  return (
    <div className="space-y-6">
      <header className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[rgb(137,109,90)]">{resource.label}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{resource.description}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOpenAdd}
              disabled={!resource.backend}
              className="inline-flex items-center justify-center rounded-3xl bg-[rgb(209,168,137)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[rgb(137,109,90)] disabled:cursor-not-allowed disabled:bg-slate-200"
            >
              Add {resource.label.replace(/s$/, '')}
            </button>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <div className="flex items-center gap-3">
                <select
                  value={filterStatus}
                  onChange={(event) => setFilterStatus(event.target.value)}
                  className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-[rgb(209,168,137)] focus:outline-none focus:ring-2 focus:ring-[rgb(209,168,137)]/20"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-soft">
            {loading ? (
              <div className="flex min-h-[280px] items-center justify-center"><LoadingSpinner /></div>
            ) : filteredItems.length === 0 ? (
              <EmptyState title="No records found" description={resource.backend ? 'Create the first record to start managing this content.' : 'There is no backend integration for this page currently.'} />
            ) : (
              <>
                <DataTable
                  columns={columns}
                  data={currentPageItems}
                  renderRow={(item) => ({
                    Title: resource.fields[0] ? item[resource.fields[0].name] || '-' : getItemId(item),
                    Status: <StatusBadge status={computeStatus(item)} />,
                    Updated: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-',
                    Actions: (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleOpenView(item)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-white">View</button>
                        <button onClick={() => handleOpenEdit(item)} className="rounded-2xl border border-[rgb(209,168,137)] bg-[rgb(209,168,137)]/10 px-3 py-2 text-sm font-semibold text-[rgb(137,109,90)] transition hover:bg-[rgb(209,168,137)]/20">Edit</button>
                        <button onClick={() => handleDelete(item)} className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-100">Delete</button>
                      </div>
                    ),
                  })}
                />
                <Pagination current={page} total={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
            <p className="mt-3 text-sm text-slate-500">Manage this content using the controls above. Saved data is forwarded to the existing backend API.</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">Records: {filteredItems.length}</div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">Search: {searchTerm || 'None'}</div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">Route: {resource.path}</div>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-900">Support note</h3>
            <p className="mt-3 text-sm text-slate-500">
              {resource.backend ? 'Backend CRUD routes are used when available for this resource.' : 'Backend integration is not configured for this page yet.'}
            </p>
          </div>
        </aside>
      </section>

      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div>}
      {statusMessage && <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">{statusMessage}</div>}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? `Edit ${resource.label}` : selectedItem ? `${resource.label} details` : `Add ${resource.label}` }>
        {selectedItem && !editItem ? (
          <div className="space-y-4">
            {resource.fields.map((field) => (
              <div key={field.name} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                <p className="mt-2 text-sm text-slate-700">{selectedItem[field.name] ?? '-'}</p>
              </div>
            ))}
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {resource.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={String(formValues[field.name] ?? '')}
                onChange={(value) => setFormValues((prev) => ({ ...prev, [field.name]: value }))}
              />
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-3xl bg-[rgb(209,168,137)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[rgb(137,109,90)] disabled:cursor-not-allowed disabled:opacity-70">
                {saving ? 'Saving...' : editItem ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setModalOpen(false)} className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-700 transition hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        )}
      </Modal>

      <DeleteConfirmation
        open={Boolean(deleteItem)}
        title="Delete record"
        description="Are you sure you want to remove this record? This action cannot be undone."
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
        loading={saving}
      />
    </div>
  )
}

export default ResourcePage
