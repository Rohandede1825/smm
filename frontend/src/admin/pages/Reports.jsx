import React from 'react'

// Minimal reports page with export link
export default function AdminReports() {
  const apiBase = import.meta.env.VITE_API_BASE
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Reports</h1>
      <a href={`${apiBase}/admin/reports/export`} className="inline-flex rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-5 py-2 text-sm font-semibold text-white">Export CSV/PDF</a>
    </div>
  )
}
