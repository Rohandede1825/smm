import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiKey, FiRefreshCw, FiCopy, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { api } from '../api/client'

export default function Profile() {
  const [me, setMe] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    let active = true
    api('/users/me')
      .then((r) => {
        if (!active) return
        setMe(r.user)
        setName(r.user.name || '')
        setEmail(r.user.email || '')
        setApiKey(r.user.apiKey || '')
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

  async function save() {
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      await api('/users/me', { method: 'PATCH', body: { name, email } })
      setSuccess('Profile updated successfully.')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function genKey() {
    setError('')
    setSuccess('')
    setGenerating(true)
    try {
      const r = await api('/users/api-key', { method: 'POST' })
      setApiKey(r.apiKey)
      setSuccess('Generated a fresh API key.')
    } catch (e) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const copyKey = async () => {
    if (!apiKey) return
    try {
      await navigator.clipboard.writeText(apiKey)
      setSuccess('API key copied to clipboard.')
    } catch {
      setError('Unable to copy API key. Copy manually instead.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-float">
        <h1 className="font-display text-3xl font-semibold text-slate-900">Profile & Credentials</h1>
        <p className="text-sm text-slate-600">
          Keep your operator details fresh and manage API access for automated order placement or partner integrations.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600">
          <FiAlertCircle className="text-lg" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-600">
          <FiCheckCircle className="text-lg" />
          {success}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <h2 className="font-display text-2xl font-semibold text-slate-900">Account details</h2>
          {loading ? (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-16 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : me ? (
            <div className="mt-6 space-y-5">
              <label className="text-sm font-medium text-slate-600">
                Name
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <FiUser className="text-slate-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    placeholder="Your name"
                  />
                </div>
              </label>

              <label className="text-sm font-medium text-slate-600">
                Email
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <FiMail className="text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    placeholder="you@agency.com"
                  />
                </div>
              </label>

              <button
                onClick={save}
                disabled={saving}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save changes
                    <FiCheckCircle />
                  </>
                )}
              </button>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">Profile data unavailable.</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <h2 className="font-display text-2xl font-semibold text-slate-900">API access</h2>
          <p className="mt-2 text-sm text-slate-600">
            Generate personal API keys for scripted orders or partner integrations. Protect them like passwords.
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg text-brand-600">
                    <FiKey />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Current API key</p>
                    <p className="text-xs text-slate-400">Rotate regularly and never share it publicly.</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.35em] ${apiKey ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                  {apiKey ? 'Active' : 'None'}
                </span>
              </div>
              <code className="mt-4 block max-w-full overflow-x-auto rounded-xl bg-slate-900/90 px-4 py-3 font-mono text-xs text-emerald-100">
                {apiKey || 'Generate a key to begin using the developer API.'}
              </code>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={genKey}
                  disabled={generating}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {generating ? (
                    <>
                      <FiRefreshCw className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate new key
                      <FiKey />
                    </>
                  )}
                </button>
                <button
                  onClick={copyKey}
                  disabled={!apiKey}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-200 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiCopy />
                  Copy key
                </button>
              </div>
            </div>
            {me && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Referral code</p>
                <p className="mt-2 font-display text-2xl font-semibold text-slate-900">{me.referralCode}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Share your referral link to earn commissions on successful deposits.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
