import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiZap,
  FiTrendingUp,
  FiShield,
  FiArrowRight,
  FiUsers,
  FiCompass,
  FiClock,
  FiSmile,
  FiMonitor,
} from 'react-icons/fi'
import { SiInstagram, SiTiktok, SiFacebook, SiYoutube, SiTelegram, SiSnapchat, SiWhatsapp } from 'react-icons/si'
import { FaTwitter } from 'react-icons/fa'
import { api } from '../api/client'

const heroStats = [
  { Icon: FiZap, value: '6,610+', label: 'Orders fulfilled with precision' },
  { Icon: FiTrendingUp, value: '₹0.20 / 1K', label: 'Industry-leading pricing' },
  { Icon: FiShield, value: '24/7', label: 'Intelligent monitoring & support' },
]

const howItWorks = [
  {
    title: 'Create an account & add balance',
    description: 'Launch in minutes, top up your wallet securely, and unlock the full suite of services.',
    Icon: FiUsers,
  },
  {
    title: 'Select your targeted service',
    description: 'Choose from premium campaigns curated for every network, goal, and growth strategy.',
    Icon: FiCompass,
  },
  {
    title: 'Launch campaigns & track live',
    description: 'Trigger fulfillment instantly and monitor status, spend, and results in real time.',
    Icon: FiClock,
  },
]

const featureHighlights = [
  {
    Icon: FiTrendingUp,
    title: 'Automation that never sleeps',
    description: 'Background jobs and smart retries keep orders flowing, even while you rest.',
  },
  {
    Icon: FiShield,
    title: 'Enterprise-grade protection',
    description: 'JWT auth, rate limits, and granular roles ensure every touchpoint remains secure.',
  },
  {
    Icon: FiSmile,
    title: 'Human support on standby',
    description: 'Ticketing, notifications, and proactive alerts mean you are always in the loop.',
  },
  {
    Icon: FiMonitor,
    title: 'Unified growth cockpit',
    description: 'Wallet, services, orders, referrals, and analytics—streamlined in a single dashboard.',
  },
]

const socialPlatforms = [
  { name: 'Instagram', color: '#E1306C', textColor: '#ffffff', Icon: SiInstagram },
  { name: 'TikTok', color: '#0F0F0F', textColor: '#ffffff', Icon: SiTiktok },
  { name: 'Twitter / X', color: '#1DA1F2', textColor: '#ffffff', Icon: FaTwitter },
  { name: 'Facebook', color: '#1877F2', textColor: '#ffffff', Icon: SiFacebook },
  { name: 'YouTube', color: '#FF0000', textColor: '#ffffff', Icon: SiYoutube },
  { name: 'Telegram', color: '#229ED9', textColor: '#ffffff', Icon: SiTelegram },
  { name: 'Snapchat', color: '#FFFB00', textColor: '#111827', Icon: SiSnapchat },
  { name: 'WhatsApp', color: '#25D366', textColor: '#ffffff', Icon: SiWhatsapp },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Dashboard() {
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api('/users/me')
      .then((res) => {
        if (!active) return
        setMe(res)
        setError('')
      })
      .catch((e) => {
        if (!active) return
        if (e.message?.toLowerCase().includes('unauthorized')) {
          setError('Sign in to view your live wallet, recent orders, and referral earnings.')
        } else {
          setError(e.message)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const user = me?.user ?? null
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
      Number.isFinite(value) ? value : 0
    )

  return (
    <div className="space-y-20 pb-10">
      <section className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">
            Elite SMM Automation
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Scale your social proof with a <span className="highlight-text">calm, human dashboard.</span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Our SMM workspace combines dependable delivery, intuitive monitoring, and a wallet that syncs in real time.
            Spend less time guessing and more time growing what matters.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-brand-600"
            >
              Explore services
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1.5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-brand-300 hover:text-brand-600"
            >
              Create account
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
        >
          <div className="surface-card relative overflow-hidden p-8">
            <div className="absolute -right-14 -top-20 h-56 w-56 rounded-full bg-brand-200/40 blur-3xl" />
            <div className="absolute -left-10 bottom-[-60px] h-48 w-48 rounded-full bg-accent-400/30 blur-3xl" />
            <div className="relative space-y-6 text-slate-600">
              {user ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-500/80">Welcome back</p>
                  <h3 className="font-display text-2xl font-bold text-slate-900">{user.name}</h3>
                  <p className="text-sm text-slate-500">Your workspace is synced and ready to launch fresh campaigns.</p>
                  <div className="grid gap-4 pt-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Wallet balance</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(user.walletBalance ?? 0)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Referral earnings</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {formatCurrency(user.referralBalance ?? 0)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-500/80">Live preview</p>
                  <h3 className="font-display text-2xl font-bold text-slate-900">
                    Real-time metrics unlock once you sign in.
                  </h3>
                  <p className="text-sm text-slate-500">
                    Keep an eye on balances, referrals, and active orders with dashboards that feel human—no AI guesswork.
                  </p>
                  {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-500">
                      {error}
                    </div>
                  )}
                </div>
              )}

              {loading && (
                <div className="grid gap-4 pt-6 sm:grid-cols-3">
                  {heroStats.map((item, idx) => (
                    <div key={`skeleton-${idx}`} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              )}

              {!loading && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4 pt-6 sm:grid-cols-3">
                  {heroStats.map(({ Icon, value, label }) => (
                    <motion.div
                      key={label}
                      variants={cardVariants}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                        <Icon />
                      </div>
                      <p className="mt-4 font-display text-xl font-semibold text-slate-900">{value}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">How it works</h2>
            <p className="text-slate-600">
              Create an account, choose the service that fits, and track the progress without digging through menus.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-brand-300 hover:text-brand-600"
          >
            Join the platform
            <FiArrowRight />
          </Link>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {howItWorks.map(({ title, description, Icon }, idx) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
            >
              <div className="absolute -right-12 top-10 h-28 w-28 rounded-full bg-brand-100/60 blur-2xl transition duration-300 group-hover:bg-brand-200/70" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-sm">
                <Icon />
              </div>
              <h3 className="relative mt-6 font-display text-xl font-semibold text-slate-900">{title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
              <span className="relative mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Step {idx + 1}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Why marketers choose SMM</h2>
            <p className="max-w-2xl text-slate-600">
              Every surface is tuned for velocity and visibility—empowering agencies, resellers, and creators alike.
            </p>
          </div>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {featureHighlights.map(({ Icon, title, description }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
            >
              <div className="absolute -left-12 top-12 h-32 w-32 rounded-full bg-accent-200/60 blur-3xl" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
                <Icon className="text-xl" />
              </div>
              <h3 className="relative mt-6 font-display text-xl font-semibold text-slate-900">{title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-slate-900">Elite coverage across every network</h2>
            <p className="max-w-2xl text-slate-600">
              Tap curated growth plays for the world&apos;s biggest social platforms—all orchestrated from one command
              center.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-600"
          >
            Browse catalog
            <FiArrowRight className="text-base" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {socialPlatforms.map(({ name, color, textColor, Icon }) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                style={{ backgroundColor: color, color: textColor }}
              >
                <Icon />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">{name}</h3>
              <p className="mt-2 text-sm text-slate-600">Premium campaigns engineered for viral reach and lasting lift.</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-[36px] border border-slate-200 bg-brand-600 p-10 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">Ready to launch your next win?</h2>
            <p className="max-w-xl text-sm text-white/90">
              Join thousands of campaigns already scaling with SMM and unlock a calmer way to manage growth,
              automation, and support.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition hover:bg-slate-100"
            >
              Create your panel
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
