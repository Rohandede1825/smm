import React, { useEffect, useState } from 'react'
import { api } from '../../api/client'

export default function AdminLogs() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  useEffect(()=>{ api('/admin/logs').then((r)=> setRows(r.logs||[])).catch((e)=> setError(e.message)) }, [])
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Admin Logs</h1>
      {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/5 text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {rows.map(l => (
              <tr key={l._id} className="hover:bg-white/5">
                <td className="px-4 py-3">{l.action}</td>
                <td className="px-4 py-3">{l.role}</td>
                <td className="px-4 py-3">{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

