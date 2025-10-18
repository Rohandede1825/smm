import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { motion } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Orders from './pages/Orders'
import Services from './pages/Services'
import Providers from './pages/Providers'
import Payments from './pages/Payments'
import Withdrawals from './pages/Withdrawals'
import Tickets from './pages/Tickets'
import Settings from './pages/Settings'
import Logs from './pages/Logs'
import Reports from './pages/Reports'

function AdminNav() {
  const items = [
    ['Dashboard', ''],
    ['Users', 'users'],
    ['Orders', 'orders'],
    ['Services', 'services'],
    ['Providers', 'providers'],
    ['Payments', 'payments'],
    ['Withdrawals', 'withdrawals'],
    ['Tickets', 'tickets'],
    ['Reports', 'reports'],
    ['Settings', 'settings'],
    ['Logs', 'logs']
  ]
  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-3">
      {items.map(([label, path]) => (
        <Link key={path} to={path ? `/admin/${path}` : '/admin'} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:border-white/20 hover:text-white">
          {label}
        </Link>
      ))}
    </nav>
  )
}

export default function AdminApp() {
  const [me, setMe] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api('/users/me').then(res => {
      setMe(res.user)
      const r = res.user.role
      if (!['admin','staff','support'].includes(r)) navigate('/login')
    }).catch(e => { setError(e.message); navigate('/login') })
  }, [])

  if (!me) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AdminNav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/services" element={<Services />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/withdrawals" element={<Withdrawals />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </motion.div>
  )
}
