import { useEffect, useMemo, useState } from 'react'
import { FiBell, FiBookOpen, FiCalendar, FiLayers, FiUsers } from 'react-icons/fi'
import { sidebarLinks, resourceMap } from '../config/resourceConfig'
import { listResource } from '../services/api'
import StatsCard from '../components/StatsCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const summaryKeys = ['departaments', 'courses', 'teachers', 'news', 'monographs']

function Dashboard() {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState(null)

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const nextCounts = {}
        await Promise.all(
          summaryKeys.map(async (key) => {
            const resource = resourceMap[key]
            const items = await listResource(resource)
            nextCounts[key] = Array.isArray(items) ? items.length : 0
          }),
        )
        setCounts(nextCounts)
      } catch (error) {
        setErrors(error.message)
      } finally {
        setLoading(false)
      }
    }
    loadCounts()
  }, [])

  const cards = useMemo(
    () => [
      { label: 'Departments', value: counts.departaments ?? 0, icon: FiLayers, accent: 'bg-amber-100 text-amber-700' },
      { label: 'Courses', value: counts.courses ?? 0, icon: FiBookOpen, accent: 'bg-violet-100 text-violet-700' },
      { label: 'Teachers', value: counts.teachers ?? 0, icon: FiUsers, accent: 'bg-sky-100 text-sky-700' },
      { label: 'News items', value: counts.news ?? 0, icon: FiBell, accent: 'bg-rose-100 text-rose-700' },
      { label: 'Monographs', value: counts.monographs ?? 0, icon: FiCalendar, accent: 'bg-lime-100 text-lime-700' },
    ],
    [counts],
  )

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:items-center md:flex-row md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[rgb(137,109,90)]">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Faculty management console</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Review content updates, manage faculty collections, and keep the Journalism & Public Relations website aligned with current editorial standards.
            </p>
          </div>
          <div className="rounded-3xl bg-[rgb(209,168,137)]/10 px-5 py-4 text-[rgb(137,109,90)] shadow-sm">
            <p className="font-semibold">Last deployment</p>
            <p className="mt-1 text-sm">July 06, 2026 · 12:28 PM</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {loading ? (
          <div className="xl:col-span-3 rounded-[28px] border border-white/80 bg-white/90 p-8 shadow-soft">
            <LoadingSpinner />
          </div>
        ) : (
          cards.map((card) => (
            <StatsCard key={card.label} {...card} />
          ))
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="xl:col-span-2 rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Content pipeline</h2>
              <p className="mt-1 text-sm text-slate-500">Latest publishing activity across campus resources.</p>
            </div>
            <span className="rounded-full bg-[rgb(209,168,137)]/15 px-4 py-2 text-sm font-semibold text-[rgb(137,109,90)]">Live</span>
          </div>

          <div className="mt-6 grid gap-4">
            {Object.entries(counts).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-slate-500">{resourceMap[key]?.label ?? key}</p>
                  <h3 className="text-2xl font-semibold text-slate-900">{value}</h3>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-white shadow-inner" />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
          <div className="mt-5 space-y-3">
            {sidebarLinks.filter((link) => link.key !== 'dashboard' && link.key !== 'settings').slice(0, 5).map((link) => (
              <button
                key={link.key}
                className="flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm text-slate-700 transition hover:border-[rgb(209,168,137)]/80 hover:bg-white"
              >
                <span>{link.label}</span>
                <span className="rounded-full bg-[rgb(137,109,90)]/10 px-3 py-1 text-xs font-semibold text-[rgb(137,109,90)]">Manage</span>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent updates</h2>
              <p className="mt-1 text-sm text-slate-500">Updates from content contributors and publication workflow.</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Stable</span>
          </div>
          <div className="mt-6 space-y-4">
            {['Teacher profile updated', 'New news item created', 'Course schedule refreshed', 'Department narrative edited'].map((text) => (
              <div key={text} className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
                <p className="font-medium text-slate-900">{text}</p>
                <p className="mt-1 text-sm text-slate-500">Review details and publish changes to the public faculty website.</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Chart overview</h2>
              <p className="mt-1 text-sm text-slate-500">Traffic and resource updates at a glance.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">Placeholder</span>
          </div>
          <div className="mt-6 grid gap-4">
            <div className="h-52 rounded-4xl bg-linear-to-br from-[rgb(209,168,137)]/10 to-white p-4 shadow-sm">
              <div className="h-full rounded-4xl border border-dashed border-slate-200 bg-slate-50" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Site engagement</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">+14.9%</p>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Publish cadence</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">4 updates</p>
              </div>
            </div>
          </div>
        </article>
      </section>

      {errors && <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">{errors}</div>}
      {!loading && !Object.keys(counts).length && <EmptyState title="No activity data" description="No resource counts are available from the backend yet." />}
    </div>
  )
}

export default Dashboard
