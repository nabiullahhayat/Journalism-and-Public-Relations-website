function DeleteConfirmation({ open, title, description, onCancel, onConfirm, loading }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-3 text-sm text-slate-600">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={onConfirm} disabled={loading} className="rounded-3xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-70">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
          <button onClick={onCancel} className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmation
