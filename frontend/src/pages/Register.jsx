import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiGift, FiArrowRight, FiLoader } from 'react-icons/fi'
import { api } from '../api/client'

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referral, setReferral] = useState('')
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      const res = await api('/auth/register', {
        method: 'POST',
        auth: false,
        body: { name, email, password, referral },
      })
      if (res?.message?.toLowerCase().includes('verify')) {
        setInfo(res.message)
      } else {
        navigate('/login')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative mx-auto grid w-full max-w-6xl items-start gap-12 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-xl shadow-brand-500/10 backdrop-blur-lg lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[12px] font-semibold uppercase tracking-[0.35em] text-slate-200">
          Start Scaling
        </span>
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Create your Instant SMM command center.
        </h1>
        <p className="text-sm leading-6 text-slate-300 sm:text-base">
          Onboard in minutes, connect Razorpay, invite your team, and activate a refined marketplace of premium social
          services. Instant SMM accelerates agencies, resellers, and growth hackers alike.
        </p>
        <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-5">
            <h3 className="font-semibold text-white">Admin & Staff controls</h3>
            <p className="mt-2 text-sm text-slate-300">
              Manage teams, approvals, and role-based dashboards effortlessly.
            </p>
          </div>
          <div className="rounded-3xl border border-white/5 bg-white/5 p-5">
            <h3 className="font-semibold text-white">Automated monetisation</h3>
            <p className="mt-2 text-sm text-slate-300">
              Razorpay deposits, referral rewards, and webhook-driven updates built in.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass relative flex flex-col gap-5 rounded-[28px] p-8"
        onSubmit={onSubmit}
      >
        <div className="absolute -top-28 right-6 hidden h-36 w-36 rounded-full bg-gradient-to-br from-accent-500/60 to-brand-500/50 blur-3xl sm:block" />
        <h2 className="font-display text-2xl font-semibold text-white">Create account</h2>
        {info && (
          <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {info}
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-rose-700/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}
        <label className="text-sm font-medium text-slate-200">
          Full name
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
            <FiUser className="text-slate-400" />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Skyline Agency"
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </label>

        <label className="text-sm font-medium text-slate-200">
          Email
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
            <FiMail className="text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@agency.com"
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
              placeholder="Choose something strong"
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </label>

        <label className="text-sm font-medium text-slate-200">
          Referral code (optional)
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
            <FiGift className="text-slate-400" />
            <input
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              placeholder="Have a partner hook-up?"
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
              Creating account...
            </>
          ) : (
            <>
              Launch dashboard
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-xs text-slate-400">
          Already have access?{' '}
          <Link to="/login" className="text-brand-200 underline-offset-4 hover:underline">
            Sign in instead
          </Link>
        </p>
      </motion.form>
    </div>
  )
}
