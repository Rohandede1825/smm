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
      <div className="surface-card p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">Services marketplace</h1>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Precision-tuned packages for every platform. Filter by keywords or explore curated suggestions to launch
              campaigns without guesswork.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <FiSearch className="text-slate-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search services, e.g. Instagram Followers"
                className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-500">
            {error}
          </div>
        )}
      </div>

      <section>
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-slate-900">Available packages</h2>
            <p className="text-sm text-slate-600">
              {services.length > 0
                ? `Showing ${services.length} premium services ready for instant deployment.`
                : 'No services found for this query yet.'}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600">
            <FiTrendingUp className="text-brand-500" />
            Updated in real time from your providers
          </div>
        </header>

        {loading && services.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-48 animate-pulse rounded-3xl bg-slate-100" />
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
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-lg text-white shadow-sm">
                      <FiCheckCircle />
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-500">
                      {service.category?.name || 'Service'}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-slate-900">{service.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-sm">
                    ₹{service.pricePer1000}/1K
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
                    Min {service.minQty}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
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
