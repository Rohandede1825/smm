import React, { useEffect, useState } from 'react'
import { api } from '../../api/client'

export default function AdminProviders() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { api('/admin/providers').then((r)=> setRows(r.providers||[])).catch((e)=> setError(e.message)) }, [])
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Providers</h1>
      {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/5 text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Base URL</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {rows.map(p => (
              <tr key={p._id} className="hover:bg-white/5">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.baseUrl}</td>
                <td className="px-4 py-3">{p.type}</td>
                <td className="px-4 py-3">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

