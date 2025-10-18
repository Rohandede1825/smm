import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiRefreshCw, FiCheckCircle, FiTrendingUp } from 'react-icons/fi'
import { api } from '../api/client'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function Services() {
  const [services, setServices] = useState([])
  const [q, setQ] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await api(`/services?q=${encodeURIComponent(q)}`)
      setServices(res.services ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-10">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-lg shadow-brand-500/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-white sm:text-4xl">Services marketplace</h1>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              Precision-tuned packages for every platform. Filter by keywords or explore the curated suggestions to
              launch campaigns instantly.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-slate-900/70 px-4 py-3">
              <FiSearch className="text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search services, e.g. Instagram Followers"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-6 rounded-2xl border border-rose-600/40 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
            {error}
          </div>
        )}
      </div>

      <section>
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">Available packages</h2>
            <p className="text-sm text-slate-300">
              {services.length > 0
                ? `Showing ${services.length} premium services ready for instant deployment.`
                : 'No services found for this query yet.'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
            <FiTrendingUp className="text-brand-200" />
            Updated in real time from your providers
          </div>
        </header>

        {loading && services.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-48 animate-pulse rounded-3xl bg-white/5" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {services.map((service) => (
              <motion.div
                key={service._id}
                variants={cardVariants}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-400/60 hover:bg-white/10"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/90 via-brand-400/80 to-accent-500/80 text-lg text-white shadow-lg shadow-brand-500/40">
                      <FiCheckCircle />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-300">
                      {service.category?.name || 'Service'}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-white">{service.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{service.description}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-gradient-to-r from-brand-500/80 to-brand-400/80 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-brand-500/30">
                    ₹{service.pricePer1000}/1K
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-slate-200">
                    Min {service.minQty}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-slate-200">
                    Max {service.maxQty}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  )
}
