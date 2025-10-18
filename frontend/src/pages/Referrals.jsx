import React, { useEffect, useState } from 'react'
import { FiGift, FiRefreshCw, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { api } from '../api/client'

export default function Referrals() {
  const [code, setCode] = useState('')
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(true)
  const baseUrl = window.location.origin

  async function load() {
    setLoading(true)
    setError('')
    try {
      const r = await api('/referrals/me')
      setCode(r.referralCode)
      setBalance(r.referralBalance || 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function moveToWallet() {
    setError('')
    setInfo('')
    try {
      const amt = amount ? Number(amount) : undefined
      const r = await api('/referrals/withdraw-to-wallet', { method: 'POST', body: amt ? { amount: amt } : {} })
      setBalance(r.referralBalance)
      setInfo('Referral balance moved to wallet successfully.')
      setAmount('')
    } catch (e) {
      setError(e.message)
    }
  }

  const referralLink = `${baseUrl}/register?ref=${encodeURIComponent(code)}`

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-lg shadow-brand-500/10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl font-semibold text-white">Referral program</h1>
            <p className="text-sm text-slate-300">Invite users and earn a commission on their deposits.</p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 hover:border-white/20">
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-rose-600/40 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
            <FiAlertCircle className="text-lg" />
            {error}
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Your referral code</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white">
              <FiGift className="text-brand-200" />
              {loading ? 'Loading…' : code}
            </div>
            <p className="mt-3 text-xs text-slate-400">Share link:</p>
            <code className="mt-1 block max-w-full overflow-x-auto rounded-xl bg-black/30 px-3 py-2 text-xs text-slate-200">{referralLink}</code>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Referral balance</p>
            <p className="mt-2 font-display text-3xl font-semibold text-white">₹{balance}</p>
            <div className="mt-4 flex items-center gap-3">
              <input
                value={amount}
                onChange={(e)=>setAmount(e.target.value)}
                placeholder="Amount (leave empty to move all)"
                className="flex-1 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none"
              />
              <button onClick={moveToWallet} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2 text-sm font-semibold text-white">
                Move to wallet
              </button>
            </div>
            {info && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                <FiCheckCircle /> {info}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

