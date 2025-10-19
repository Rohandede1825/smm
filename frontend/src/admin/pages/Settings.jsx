import React, { useEffect, useState } from 'react'
import { api } from '../../api/client'

export default function AdminSettings() {
  const [values, setValues] = useState(null)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => { api('/admin/settings').then(setValues).catch((e)=> setError(e.message)) }, [])

  async function save() {
    setError(''); setInfo('')
    try { await api('/admin/settings', { method: 'POST', body: values }); setInfo('Saved.') } catch (e) { setError(e.message) }
  }

  if (!values) return <div>Loading…</div>

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Settings</h1>
      {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
      {info && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{info}</div>}
      <div className="grid gap-3 md:grid-cols-2">
        {Object.entries(values).map(([k,v]) => (
          <label key={k} className="text-sm text-slate-300">
            <div className="mb-1 font-medium text-white">{k}</div>
            <input value={v} onChange={(e)=> setValues({...values, [k]: e.target.value})} className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none"/>
          </label>
        ))}
      </div>
      <button onClick={save} className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600">Save</button>
    </div>
  )
}
