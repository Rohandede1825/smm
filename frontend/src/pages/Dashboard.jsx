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
  { name: 'Instagram', gradient: 'from-[#833AB4] via-[#FD1D1D] to-[#FDCB52]', Icon: SiInstagram },
  { name: 'TikTok', gradient: 'from-[#010101] via-[#EE1D52] to-[#69C9D0]', Icon: SiTiktok },
  { name: 'Twitter / X', gradient: 'from-[#1DA1F2] to-[#1A8CD8]', Icon: FaTwitter },
  { name: 'Facebook', gradient: 'from-[#1877F2] to-[#0F6AE6]', Icon: SiFacebook },
  { name: 'YouTube', gradient: 'from-[#FF0000] to-[#CC0000]', Icon: SiYoutube },
  { name: 'Telegram', gradient: 'from-[#2AABEE] to-[#229ED9]', Icon: SiTelegram },
  { name: 'Snapchat', gradient: 'from-[#FFFC00] to-[#FFB300]', Icon: SiSnapchat },
  { name: 'WhatsApp', gradient: 'from-[#25D366] to-[#128C7E]', Icon: SiWhatsapp },
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
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-200">
            Elite SMM Automation
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Scale your social proof with a{' '}
            <span className="gradient-text">next-gen growth command center.</span>
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Instant SMM fuses premium services, real-time tracking, and deep automation into a single immersive
            dashboard. From orders to withdrawals, orchestrate every campaign with cinematic clarity.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/40 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Explore services
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1.5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:text-white"
            >
              Create account
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative rounded-[32px] border border-white/10 bg-white/10 p-[1px] shadow-glow"
        >
          <div className="relative overflow-hidden rounded-[30px] bg-slate-900/70 p-8">
            <div className="absolute -right-10 top-[-60px] h-56 w-56 rounded-full bg-brand-500/25 blur-3xl" />
            <div className="absolute -left-8 bottom-[-50px] h-44 w-44 rounded-full bg-accent-500/20 blur-2xl" />
            <div className="relative space-y-6">
              {user ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-200/80">Welcome back</p>
                  <h3 className="font-display text-2xl font-bold text-white">{user.name}</h3>
                  <p className="text-sm text-slate-300">Your growth arsenal is fully synced and ready to deploy.</p>
                  <div className="grid gap-4 pt-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/10 p-4 text-sm">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-300/80">Wallet Balance</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(user.walletBalance ?? 0)}</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 text-sm">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-300/80">Referral Earnings</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {formatCurrency(user.referralBalance ?? 0)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-200/80">Live preview</p>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Real-time metrics unlock once you sign in.
                  </h3>
                  <p className="text-sm text-slate-300">
                    Monitor wallet balances, referrals, and active orders with cinematic dashboards tailored to your
                    brand.
                  </p>
                  {error && (
                    <div className="rounded-2xl border border-white/10 bg-red-500/10 px-4 py-3 text-sm text-rose-200">
                      {error}
                    </div>
                  )}
                </div>
              )}

              {loading && (
                <div className="grid gap-4 pt-6 sm:grid-cols-3">
                  {heroStats.map((item, idx) => (
                    <div
                      key={`skeleton-${idx}`}
                      className="h-24 animate-pulse rounded-2xl bg-white/5"
                    />
                  ))}
                </div>
              )}

              {!loading && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid gap-4 pt-6 sm:grid-cols-3">
                  {heroStats.map(({ Icon, value, label }) => (
                    <motion.div
                      key={label}
                      variants={cardVariants}
                      className="rounded-2xl bg-white/10 p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-brand-200">
                        <Icon />
                      </div>
                      <p className="mt-4 font-display text-xl font-semibold text-white">{value}</p>
                      <p className="text-xs text-slate-300">{label}</p>
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
            <h2 className="font-display text-3xl font-semibold text-white">How it works</h2>
            <p className="text-slate-300">
              Seamless onboarding, powerful automations, and actionable insights—engineered for modern agencies.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-slate-100 transition hover:border-white/30 hover:text-white"
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
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-400/60 hover:bg-white/10"
            >
              <div className="absolute -right-10 top-10 h-28 w-28 rounded-full bg-brand-500/15 blur-2xl transition duration-300 group-hover:bg-brand-400/25" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-400 to-accent-500 text-white shadow-lg shadow-brand-500/40">
                <Icon />
              </div>
              <h3 className="relative mt-6 font-display text-xl font-semibold text-white">{title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-300">{description}</p>
              <span className="relative mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Step {idx + 1}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">Why marketers choose Instant SMM</h2>
            <p className="max-w-2xl text-slate-300">
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
              className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-400/60 hover:bg-white/10"
            >
              <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-accent-500/10 blur-3xl" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-200">
                <Icon className="text-xl" />
              </div>
              <h3 className="relative mt-6 font-display text-xl font-semibold text-white">{title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-slate-300">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">Elite coverage across every network</h2>
            <p className="max-w-2xl text-slate-300">
              Tap curated growth plays for the world&apos;s biggest social platforms—all orchestrated from one command
              center.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Browse catalog
            <FiArrowRight className="text-base" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {socialPlatforms.map(({ name, gradient, Icon }) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white text-2xl`}>
                <Icon />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">{name}</h3>
              <p className="mt-2 text-sm text-slate-300">Premium campaigns engineered for viral reach and lasting lift.</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-brand-600/90 via-brand-500/80 to-accent-500/70 p-10">
        <div className="absolute inset-0 -z-10 opacity-50 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 60%)' }} />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">Ready to launch your next win?</h2>
            <p className="max-w-xl text-sm text-white/80">
              Join thousands of campaigns already scaling with Instant SMM and unlock the full force of analytics,
              automation, and responsive support.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
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
