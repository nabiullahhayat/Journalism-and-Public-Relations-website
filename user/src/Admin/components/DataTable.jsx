function DataTable({ columns, data, renderRow }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-4 font-semibold text-slate-600">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {data.map((item) => {
            const row = renderRow(item)
            return (
              <tr key={item.id ?? item._id ?? JSON.stringify(item)} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 align-top text-slate-700">
                    {row[column.label] ?? row[column.key] ?? '-'}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
