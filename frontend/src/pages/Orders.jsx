import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiRefreshCw, FiAlertCircle, FiTrendingUp } from 'react-icons/fi'
import { api } from '../api/client'

const statusStyles = {
  pending: 'bg-amber-50 text-amber-600 border border-amber-200',
  processing: 'bg-sky-50 text-sky-600 border border-sky-200',
  completed: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-600 border border-rose-200',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api('/orders')
      .then((r) => {
        if (!active) return
        setOrders(r.orders ?? [])
        setError('')
      })
      .catch((e) => {
        if (!active) return
        setError(e.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const formatDate = (value) => {
    if (!value) return '—'
    try {
      return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(value))
    } catch {
      return value
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-float">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-slate-900">Order stream</h1>
            <p className="text-sm text-slate-600">
              Track every campaign at a glance. Live status, spend, and service details keep your operations in sync.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
            <FiTrendingUp className="text-brand-500" />
            {orders.length} orders synced
          </div>
        </div>
        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600">
            <FiAlertCircle className="text-lg" />
            {error}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.25em] text-slate-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      {Array.from({ length: 6 }).map((__, cell) => (
                        <td key={cell} className="px-6 py-4">
                          <div className="h-4 rounded bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}

              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    <div className="mx-auto flex max-w-md flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-xl text-brand-500">
                        <FiPackage />
                      </div>
                      <p>No orders yet. Launch your first service to see real-time tracking appear here.</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                orders.map((order) => {
                  const statusKey = (order.status || '').toLowerCase()
                  const statusClass = statusStyles[statusKey] || 'bg-slate-100 text-slate-600 border border-slate-200'
                  return (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800">{order._id}</td>
                      <td className="px-6 py-4 text-slate-600">{order.service?.name || order.service}</td>
                      <td className="px-6 py-4 text-slate-600">{order.quantity}</td>
                      <td className="px-6 py-4 text-brand-600 font-medium">₹{order.price}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                          <FiRefreshCw className={statusKey === 'processing' ? 'animate-spin-slow' : ''} />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(order.createdAt)}</td>
                    </motion.tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
