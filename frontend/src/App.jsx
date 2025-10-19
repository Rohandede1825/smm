import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX, FiLogOut, FiSearch } from 'react-icons/fi'
import { setToken, getToken } from './api/client'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Services from './pages/Services'
import Orders from './pages/Orders'
import Wallet from './pages/Wallet'
import Profile from './pages/Profile'
import AdminApp from './admin/AdminApp'
import CommandPalette from './components/CommandPalette'

const Referrals = React.lazy(() => import('./pages/Referrals'))
const Withdrawals = React.lazy(() => import('./pages/Withdrawals'))

const links = [
  { path: '/', label: 'Dashboard' },
  { path: '/services', label: 'Services' },
  { path: '/orders', label: 'Orders' },
  { path: '/wallet', label: 'Wallet' },
  { path: '/referrals', label: 'Referrals' },
  { path: '/withdrawals', label: 'Withdrawals' },
  { path: '/profile', label: 'Profile' },
  { path: '/admin', label: 'Admin' },
]

function Nav({ onOpenSearch }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const token = getToken()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    setToken(null)
    setOpen(false)
    navigate('/login')
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-lg font-semibold text-white shadow-glow">
            S
          </span>
          <span className="font-display text-xl font-semibold uppercase tracking-[0.25rem] text-slate-700">
            SMM
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative transition duration-200 ${
                isActive(item.path)
                  ? 'text-brand-600 after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-full after:rounded-full after:bg-brand-500'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={onOpenSearch}
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:border-brand-400/70 hover:text-brand-600"
            aria-label="Search (Ctrl+K)"
          >
            <FiSearch className="text-slate-500 transition group-hover:text-brand-600" />
            <span>Search</span>
            <kbd className="ml-2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-slate-400">Ctrl K</kbd>
          </button>
          {token ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:text-brand-600"
            >
              <FiLogOut />
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-600"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
              >
                Get started
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-xl text-slate-700 md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-slate-200 bg-white/95 shadow-xl md:hidden"
          >
            <nav className="flex flex-col gap-4 px-4 py-6 text-sm font-medium">
              <button
                onClick={() => {
                  setOpen(false)
                  onOpenSearch?.()
                }}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-white"
              >
                <FiSearch className="text-slate-500" />
                <span>Search pages and actions…</span>
              </button>
              {links.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 transition ${
                    isActive(item.path)
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-brand-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {token ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
                >
                  <FiLogOut />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm text-slate-600"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-brand-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

function App() {
  const navigate = useNavigate()
  const [paletteOpen, setPaletteOpen] = useState(false)

  const items = useMemo(() => {
    const base = links.map((l) => ({ label: l.label, path: l.path, keywords: [l.label.toLowerCase()] }))
    const extras = [
      { label: 'Create new order', path: '/orders?new=1', keywords: ['new', 'create', 'order'] },
      { label: 'Add funds', path: '/wallet?topup=1', keywords: ['wallet', 'funds', 'add', 'topup', 'balance'] },
      { label: 'Browse services', path: '/services', keywords: ['search', 'services', 'catalog'] },
      { label: 'Open profile', path: '/profile', keywords: ['account', 'settings', 'profile'] },
    ]
    return [...base, ...extras]
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="theme-refresh relative min-h-screen overflow-hidden text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-[8%] h-96 w-96 rounded-full bg-brand-200/50 blur-[180px]" />
        <div className="absolute top-40 right-[12%] h-[420px] w-[420px] rounded-full bg-accent-400/40 blur-[160px]" />
        <div className="absolute bottom-[-20%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-100/50 blur-[150px]" />
      </div>
      <Nav onOpenSearch={() => setPaletteOpen(true)} />
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-slate-500">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
        </Suspense>
      </main>
      <footer className="relative z-10 border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Instant SMM. Crafted for high-impact social growth.</p>
          <p>Built with love, automation, and lightning-fast delivery.</p>
        </div>
      </footer>
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={items}
        onSelect={(path) => {
          setPaletteOpen(false)
          navigate(path)
        }}
      />
    </div>
  )
}

export default App
