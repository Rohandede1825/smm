import React, { useEffect, useState } from 'react'
import { api } from '../../api/client'

export default function AdminUsers() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

  async function load() {
    try {
      const r = await api(`/admin/users${q ? `?q=${encodeURIComponent(q)}` : ''}`)
      setRows(r.users || [])
    } catch (e) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Users</h1>
      {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
      <div className="flex gap-3">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search name/email" className="flex-1 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none"/>
        <button onClick={load} className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2 text-sm font-semibold text-white">Search</button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/5 text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Wallet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {rows.map(u => (
              <tr key={u._id} className="hover:bg-white/5">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3 capitalize">{u.status}</td>
                <td className="px-4 py-3">₹{u.walletBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

