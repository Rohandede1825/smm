import React, { useEffect, useState } from 'react'
import { api } from '../../api/client'

export default function AdminPayments() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  useEffect(()=>{ api('/admin/manual-payments').then((r)=> setRows(r.manualPayments||[])).catch((e)=> setError(e.message)) },[])
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Manual Payments</h1>
      {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/5 text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {rows.map(mp => (
              <tr key={mp._id} className="hover:bg-white/5">
                <td className="px-4 py-3">{mp.user?.email||mp.user}</td>
                <td className="px-4 py-3">₹{mp.amount}</td>
                <td className="px-4 py-3">{mp.method}</td>
                <td className="px-4 py-3">{mp.status}</td>
                <td className="px-4 py-3">{mp.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

