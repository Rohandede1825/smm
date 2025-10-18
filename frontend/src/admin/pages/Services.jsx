import React, { useEffect, useState } from 'react'
import { api } from '../../api/client'

export default function AdminServices() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => { api('/services').then((r)=> setRows(r.services||[])).catch((e)=> setError(e.message)) }, [])

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Services</h1>
      {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/5 text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Rate / 1K</th>
              <th className="px-4 py-3">Min</th>
              <th className="px-4 py-3">Max</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {rows.map(s => (
              <tr key={s._id} className="hover:bg-white/5">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.category?.name || s.category}</td>
                <td className="px-4 py-3">₹{s.pricePer1000}</td>
                <td className="px-4 py-3">{s.minQty}</td>
                <td className="px-4 py-3">{s.maxQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

