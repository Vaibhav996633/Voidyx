import { createClient } from '@supabase/supabase-js'
import { ANIMATIONS } from '../src/data/animations' // adjust path if needed

const supabase = createClient(
  String(process.env.VITE_SUPABASE_URL ?? '').trim().replace(/\/+$/, ''),
  String(process.env.VITE_SUPABASE_ANON_KEY ?? '').trim()
)

type Row = Record<string, any>

function missingColumnFromPgrst204(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as any
  if (e.code !== 'PGRST204' || typeof e.message !== 'string') return null
  const m = e.message.match(/Could not find the '([^']+)' column/i)
  return m?.[1] ?? null
}

function isInvalidUuid(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as any
  const msg = typeof e.message === 'string' ? e.message : ''
  return e.code === '22P02' && /uuid/i.test(msg)
}

function remapMissingColumn(row: Row, missing: string): boolean {
  const mappings: Record<string, string[]> = {
    html: ['html_code', 'htmlCode'],
    css: ['css_code', 'cssCode'],
    js: ['js_code', 'jsCode'],
    cdn_links: ['cdn_urls', 'cdnLinks'],
    config: ['config_json', 'configParams'],
  }

  const alternatives = mappings[missing]
  if (!alternatives) return false
  if (!Object.prototype.hasOwnProperty.call(row, missing)) return false
  for (const alt of alternatives) {
    if (!Object.prototype.hasOwnProperty.call(row, alt)) {
      row[alt] = row[missing]
      delete row[missing]
      return true
    }
  }
  return false
}

function remapRowsForMissingColumn(rows: Row[], missing: string): boolean {
  let changed = false
  for (const row of rows) {
    if (remapMissingColumn(row, missing)) changed = true
  }
  return changed
}

async function upsertWithFallback(rows: Row[]) {
  let currentRows = rows.map((r) => ({ ...r }))
  for (let i = 0; i < 6; i++) {
    const res = await supabase.from('animations').upsert(currentRows as any, { onConflict: 'id' })
    if (!res.error) return res
    if (isInvalidUuid(res.error)) break

    const missing = missingColumnFromPgrst204(res.error)
    if (missing) {
      if (remapRowsForMissingColumn(currentRows, missing)) continue
      for (const row of currentRows) delete (row as any)[missing]
      continue
    }

    return res
  }

  let slugRows = rows.map(({ id, ...rest }) => ({ ...rest, slug: rest.slug ?? id }))
  for (let i = 0; i < 6; i++) {
    const res = await supabase.from('animations').upsert(slugRows as any, { onConflict: 'slug' })
    if (!res.error) return res

    const missing = missingColumnFromPgrst204(res.error)
    if (missing) {
      if (remapRowsForMissingColumn(slugRows, missing)) continue
      for (const row of slugRows) delete (row as any)[missing]
      continue
    }

    return res
  }

  return supabase.from('animations').upsert(slugRows as any, { onConflict: 'slug' })
}

async function seed() {
  const rows = ANIMATIONS.map((anim) => ({
    id: anim.id,
    slug: anim.id,
    name: anim.name,
    category: anim.category,
    description: anim.description ?? null,
    complexity: anim.complexity ?? null,
    html: anim.html ?? null,
    css: anim.css ?? null,
    js: anim.js ?? null,
    cdn_links: anim.cdnLinks ?? [],
    config: anim.config ?? [],
  }))

  const { error } = await upsertWithFallback(rows)

  if (error) {
    console.error('❌ Error inserting data:', error)
  } else {
    console.log('✅ All animations inserted successfully!')
  }
}

seed()
