import React, { Suspense, useState } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi'
import { setToken, getToken } from './api/client'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Services from './pages/Services'
import Orders from './pages/Orders'
import Wallet from './pages/Wallet'
import Profile from './pages/Profile'
import AdminApp from './admin/AdminApp'

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

function Nav() {
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
      className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-glow text-lg font-semibold text-white shadow-glow">
            S
          </span>
          <div>
            <span className="font-display text-lg font-semibold uppercase tracking-[0.3rem] text-slate-200">
              Instant
            </span>
            <div className="gradient-text font-display text-xl font-bold leading-none">SMM</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative transition duration-200 ${
                isActive(item.path)
                  ? 'text-white after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-full after:rounded-full after:bg-gradient-to-r after:from-brand-500 after:to-accent-500'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {token ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              <FiLogOut />
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-slate-200 transition hover:border-brand-400 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:shadow-xl"
              >
                Get started
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-xl text-white md:hidden"
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
            className="border-t border-white/5 bg-slate-900/90 shadow-lg md:hidden"
          >
            <nav className="flex flex-col gap-4 px-4 py-6 text-sm font-medium">
              {links.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 transition ${
                    isActive(item.path)
                      ? 'bg-white/10 text-white'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {token ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 px-3 py-2 text-sm font-semibold text-white"
                >
                  <FiLogOut />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-white/10 px-3 py-2 text-center text-sm text-slate-200"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 px-3 py-2 text-center text-sm font-semibold text-white"
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
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-[-10%] h-96 w-96 rounded-full bg-brand-500/25 blur-[140px]" />
        <div className="absolute top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-accent-500/25 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-300/10 blur-[120px]" />
      </div>
      <Nav />
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-slate-300">Loading...</div>}>
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
      <footer className="relative z-10 border-t border-white/10 bg-slate-900/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Instant SMM. Crafted for high-impact social growth.</p>
          <p>Built with love, automation, and lightning-fast delivery.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
