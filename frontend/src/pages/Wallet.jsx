import React, { useEffect, useMemo, useState } from 'react'
import { FiCreditCard, FiPlusCircle, FiAlertCircle, FiCheckCircle, FiDownload } from 'react-icons/fi'
import { api } from '../api/client'

const statusPills = {
  completed: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  pending: 'bg-amber-50 text-amber-600 border border-amber-200',
  failed: 'bg-rose-50 text-rose-600 border border-rose-200',
}

function useScript(src) {
  return useMemo(() => {
    let el = document.querySelector(`script[src="${src}"]`)
    if (el) return { loaded: true }
    el = document.createElement('script')
    el.src = src
    el.async = true
    document.body.appendChild(el)
    return { loaded: true }
  }, [src])
}

export default function Wallet() {
  const [txns, setTxns] = useState([])
  const [amount, setAmount] = useState('')
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  useScript('https://checkout.razorpay.com/v1/checkout.js')

  useEffect(() => {
    let active = true
    api('/wallet/transactions')
      .then((r) => {
        if (!active) return
        setTxns(r.transactions ?? [])
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

  useEffect(() => {
    api('/users/me').then((r)=> setMe(r.user)).catch(()=>{})
  }, [])

  async function createDeposit() {
    setError('')
    setInfo('')
    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) {
      setError('Enter a valid amount greater than zero.')
      return
    }
    setCreating(true)
    try {
      const res = await api('/wallet/deposit/order', { method: 'POST', body: { amount: numericAmount } })
      const { order, keyId } = res
      // Open Razorpay Checkout
      if (window.Razorpay && keyId && order?.id) {
        const rzOpts = {
          key: keyId,
          amount: order.amount, // in paise
          currency: order.currency || 'INR',
          name: 'SMM',
          description: 'Wallet deposit',
          order_id: order.id,
          prefill: {
            name: me?.name || 'User',
            email: me?.email || '',
          },
          theme: { color: '#4d6aff' },
          handler: function () {
            setInfo('Payment successful. Updating history…')
            // quick refresh + short polling to reflect success in history
            const refresh = () => api('/wallet/transactions').then((r)=> setTxns(r.transactions||[])).catch(()=>{})
            refresh()
            let tries = 0
            const iv = setInterval(() => {
              tries += 1
              refresh()
              if (tries >= 5) clearInterval(iv)
            }, 2000)
          },
          modal: {
            ondismiss: function () {
              setInfo('Checkout closed before completing payment.')
            }
          }
        }
        const rzp = new window.Razorpay(rzOpts)
        rzp.open()
      } else {
        setInfo(`Razorpay order created: ${order?.id}. Open checkout to capture payment.`)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setCreating(false)
    }
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
      Number.isFinite(value) ? value : 0
    )

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
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-lg shadow-brand-500/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-slate-900">Wallet & Billing</h1>
            <p className="text-sm text-slate-600">
              Manage deposits, referral earnings, and audit-ready transaction logs from a single control hub.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">
            <FiCreditCard className="text-brand-200" />
            Securely backed by Razorpay
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3">
            <FiPlusCircle className="text-slate-400" />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter an amount to deposit"
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={createDeposit}
            disabled={creating}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {creating ? (
              <>
                <FiDownload className="animate-spin" />
                Creating order...
              </>
            ) : (
              <>
                Add funds
                <FiPlusCircle />
              </>
            )}
          </button>
        </div>

        {info && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-600">
            <FiCheckCircle className="text-lg" />
            {info}
          </div>
        )}
        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600">
            <FiAlertCircle className="text-lg" />
            {error}
          </div>
        )}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white shadow-lg shadow-brand-500/5">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">Transaction history</h2>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Wallet · Razorpay · Referrals</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-600">
            {txns.length} records
          </span>
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex animate-pulse items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 rounded bg-slate-100" />
                      <div className="h-3 w-24 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="h-4 w-16 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : txns.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No transactions logged yet. Deposits, withdrawals, and order debits will appear instantly.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {txns.map((txn) => {
                const pillClass = statusPills[txn.status?.toLowerCase()] || 'bg-slate-100 text-slate-600 border border-slate-200'
                return (
                  <div key={txn._id} className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-lg text-brand-600">
                        <FiCreditCard />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 capitalize">
                          {txn.type} <span className="text-xs text-slate-500">• {txn.status}</span>
                        </p>
                        <p className="text-xs text-slate-500">{formatDate(txn.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-sm text-slate-700 sm:flex-row sm:items-center sm:gap-4">
                      <span className="font-medium text-brand-600">{formatCurrency(txn.amount)}</span>
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${pillClass}`}>
                        {txn.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
