import React, { useEffect, useState } from 'react'
import { FiTrendingUp, FiSend, FiAlertCircle } from 'react-icons/fi'
import { api } from '../api/client'

export default function Withdrawals() {
  const [list, setList] = useState([])
  const [amount, setAmount] = useState('')
  const [fromBalance, setFromBalance] = useState('main')
  const [method, setMethod] = useState('upi')
  const [upi, setUpi] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const r = await api('/withdrawals')
      setList(r.withdrawals || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function requestWithdrawal() {
    setError('')
    try {
      const res = await api('/withdrawals', {
        method: 'POST',
        body: { amount: Number(amount), fromBalance, method, account: { upi } },
      })
      setAmount(''); setUpi('')
      setList([res.withdrawal, ...list])
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-lg shadow-brand-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-slate-900">Withdraw funds</h1>
            <p className="text-sm text-slate-600">Move balances to your bank via UPI after reaching the minimum limit.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">
            <FiTrendingUp className="text-brand-200" /> {list.length} requests
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-rose-600/40 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
            <FiAlertCircle className="text-lg" />
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_auto_auto]">
          <input
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            placeholder="Amount"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none"
          />
          <select value={fromBalance} onChange={(e)=>setFromBalance(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-white outline-none">
            <option value="main">Main</option>
            <option value="referral">Referral</option>
          </select>
          <input
            value={upi}
            onChange={(e)=>setUpi(e.target.value)}
            placeholder="UPI ID"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none"
          />
          <button onClick={requestWithdrawal} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-5 py-2 text-sm font-semibold text-white">
            <FiSend /> Request
          </button>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white shadow-lg shadow-brand-500/5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5 text-left text-sm text-slate-600">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.25em] text-slate-600">
              <tr>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">From</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td className="px-6 py-6 text-slate-400" colSpan={5}>Loading…</td></tr>
              ) : list.length === 0 ? (
                <tr><td className="px-6 py-6 text-slate-400" colSpan={5}>No withdrawals yet.</td></tr>
              ) : (
                list.map((w)=> (
                  <tr key={w._id} className="hover:bg-white/5">
                    <td className="px-6 py-4">₹{w.amount}</td>
                    <td className="px-6 py-4 capitalize">{w.fromBalance}</td>
                    <td className="px-6 py-4 uppercase">{w.method}</td>
                    <td className="px-6 py-4">{w.status}</td>
                    <td className="px-6 py-4">{new Date(w.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

