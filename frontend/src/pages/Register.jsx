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
    <div className="relative mx-auto grid w-full max-w-6xl items-start gap-12 rounded-[32px] border border-slate-200 bg-white p-8 shadow-float lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-1 text-[12px] font-semibold uppercase tracking-[0.3em] text-brand-700">
          Start Scaling
        </span>
        <h1 className="font-display text-4xl font-bold text-slate-900 sm:text-5xl">
          Create your SMM command center.
        </h1>
        <p className="text-sm leading-6 text-slate-600 sm:text-base">
          Onboard in minutes, connect Razorpay, invite your team, and activate a refined marketplace of premium social
          services. Our SMM platform accelerates agencies, resellers, and growth hackers alike.
        </p>
        <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-900">Admin & Staff controls</h3>
            <p className="mt-2 text-sm text-slate-600">
              Manage teams, approvals, and role-based dashboards effortlessly.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-900">Automated monetisation</h3>
            <p className="mt-2 text-sm text-slate-600">
              Razorpay deposits, referral rewards, and webhook-driven updates built in.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col gap-5 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm"
        onSubmit={onSubmit}
      >
        <div className="absolute -top-28 right-6 hidden h-36 w-36 rounded-full bg-brand-200/40 blur-3xl sm:block" />
        <h2 className="font-display text-2xl font-semibold text-slate-900">Create account</h2>
        {info && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
            {info}
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">
            {error}
          </div>
        )}
        <label className="text-sm font-medium text-slate-600">
          Full name
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FiUser className="text-slate-500" />
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Skyline Agency"
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </label>

        <label className="text-sm font-medium text-slate-600">
          Email
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FiMail className="text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@agency.com"
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
              placeholder="Choose something strong"
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </label>

        <label className="text-sm font-medium text-slate-600">
          Referral code (optional)
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <FiGift className="text-slate-500" />
            <input
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              placeholder="Have a partner hook-up?"
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
              Creating account...
            </>
          ) : (
            <>
              Launch dashboard
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </button>

        <p className="text-xs text-slate-500">
          Already have access?{' '}
          <Link to="/login" className="text-brand-600 underline-offset-4 hover:underline">
            Sign in instead
          </Link>
        </p>
      </motion.form>
    </div>
  )
}
