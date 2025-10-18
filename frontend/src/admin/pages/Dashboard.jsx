import React, { useEffect, useState } from 'react'
import { api } from '../../api/client'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/admin/overview').then(setData).catch((e) => setError(e.message))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Admin Dashboard</h1>
      {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
      {data && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card title="Users" value={data.users} />
          <Card title="Orders" value={data.orders} />
          <Card title="Total Deposits" value={`₹${data.totalDeposits}`} />
        </div>
      )}
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-slate-300">{title}</div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
    </div>
  )
}

