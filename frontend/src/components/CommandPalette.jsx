import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'

export default function CommandPalette({ isOpen, onClose, items = [], onSelect }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items
      .map((it) => ({
        ...it,
        score: (it.label?.toLowerCase().includes(q) ? 2 : 0) +
          (it.keywords?.some((k) => k.includes(q)) ? 1 : 0),
      }))
      .filter((it) => it.score > 0)
      .sort((a, b) => b.score - a.score)
  }, [items, query])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const sel = results[index]
        if (sel) onSelect?.(sel.path)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, results, index, onClose, onSelect])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setIndex(0)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-900/20 px-4 py-10 sm:px-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose?.()
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-2xl shadow-slate-500/10 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2.5">
              <FiSearch className="text-slate-500" />
              <input
                autoFocus
                placeholder="Search pages and quick actions…"
                className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-500">Enter</kbd>
            </div>
            <div className="max-h-80 overflow-auto p-1">
              {results.length === 0 && (
                <div className="px-3 py-4 text-sm text-slate-500">No matches. Try a different query.</div>
              )}
              {results.map((it, i) => (
                <button
                  key={`${it.path}-${i}`}
                  onClick={() => onSelect?.(it.path)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                    i === index ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-brand-600'
                  }`}
                >
                  <span>{it.label}</span>
                  <span className="text-xs text-slate-400">{it.path}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-400">Navigate fast</span>
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <kbd className="rounded border border-slate-200 bg-white px-1">Esc</kbd>
                <span>to close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
