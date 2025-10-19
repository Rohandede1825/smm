import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiLock, FiMail, FiLoader } from 'react-icons/fi'
import { api, setToken } from '../api/client'

const formVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api('/auth/login', { method: 'POST', auth: false, body: { email, password } })
      setToken(res.accessToken)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Unable to log in right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative mx-auto grid w-full max-w-5xl items-center gap-12 rounded-[32px] border border-slate-200 bg-white p-8 shadow-float lg:grid-cols-[1.05fr_0.95fr]">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-1 text-[12px] font-semibold uppercase tracking-[0.3em] text-brand-700">
          Welcome back
        </span>
        <h1 className="font-display text-4xl font-bold text-slate-900">Sign in to orchestrate your growth.</h1>
        <p className="text-sm leading-6 text-slate-600 sm:text-base">
          Unlock your real-time dashboard, track every order, manage wallets, and respond instantly to client demand.
          You&apos;re moments away from full control.
        </p>
        <ul className="grid gap-3 text-sm text-slate-600">
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-xs text-brand-600">
              1
            </span>
            Live analytics across orders, balances, referrals, and support.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-xs text-brand-600">
              2
            </span>
            Automated Razorpay billing, invoices, and webhook-driven updates.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-xs text-brand-600">
              3
            </span>
            Admin, staff, and support roles with granular permissions.
          </li>
        </ul>
      </motion.div>

      <motion.form
        variants={formVariants}
        initial="hidden"
        animate="visible"
        onSubmit={onSubmit}
        className="relative flex flex-col gap-5 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="absolute -top-20 right-8 hidden h-32 w-32 rounded-full bg-brand-200/40 blur-3xl sm:block" />
        <h2 className="font-display text-2xl font-semibold text-slate-900">Log in</h2>
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">
            {error}
          </div>
        )}
        <label className="text-sm font-medium text-slate-600">
          Email
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FiMail className="text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </label>

        <label className="text-sm font-medium text-slate-600">
          Password
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FiLock className="text-slate-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="group mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              Sign in
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-brand-600 underline-offset-4 hover:underline">
            Create one now
          </Link>
        </p>
      </motion.form>
    </div>
  )
}
