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
    <div className="relative mx-auto grid w-full max-w-5xl items-center gap-12 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-xl shadow-brand-500/10 backdrop-blur-lg lg:grid-cols-[1.05fr_0.95fr]">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[12px] font-semibold uppercase tracking-[0.35em] text-slate-200">
          Welcome back
        </span>
        <h1 className="font-display text-4xl font-bold text-white">Sign in to orchestrate your growth.</h1>
        <p className="text-sm leading-6 text-slate-300 sm:text-base">
          Unlock your real-time dashboard, track every order, manage wallets, and respond instantly to client demand.
          You&apos;re moments away from full control.
        </p>
        <ul className="grid gap-3 text-sm text-slate-300">
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs text-brand-200">
              1
            </span>
            Instant analytics across orders, balances, referrals, and support.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs text-brand-200">
              2
            </span>
            Automated Razorpay billing, invoices, and webhook-driven updates.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs text-brand-200">
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
        className="glass relative flex flex-col gap-5 rounded-[28px] p-8"
      >
        <div className="absolute -top-20 right-8 hidden h-32 w-32 rounded-full bg-gradient-to-br from-brand-500/60 to-accent-500/40 blur-3xl sm:block" />
        <h2 className="font-display text-2xl font-semibold text-white">Log in</h2>
        {error && (
          <div className="rounded-xl border border-rose-700/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}
        <label className="text-sm font-medium text-slate-200">
          Email
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
            <FiMail className="text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </label>

        <label className="text-sm font-medium text-slate-200">
          Password
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
            <FiLock className="text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="group mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/40 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
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

        <p className="text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-brand-200 underline-offset-4 hover:underline">
            Create one now
          </Link>
        </p>
      </motion.form>
    </div>
  )
}
