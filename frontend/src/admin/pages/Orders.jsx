import React, { useEffect, useState } from 'react'
import { api } from '../../api/client'

export default function AdminOrders() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api('/admin/orders').then((r)=> setRows(r.orders||[])).catch((e)=> setError(e.message))
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Orders</h1>
      {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/5 text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {rows.map(o => (
              <tr key={o._id} className="hover:bg-white/5">
                <td className="px-4 py-3">{o._id}</td>
                <td className="px-4 py-3">{o.user?.email||o.user}</td>
                <td className="px-4 py-3">{o.service?.name||o.service}</td>
                <td className="px-4 py-3">{o.quantity}</td>
                <td className="px-4 py-3">₹{o.price}</td>
                <td className="px-4 py-3">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

