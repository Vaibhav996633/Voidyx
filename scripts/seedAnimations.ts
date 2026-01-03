import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { ANIMATIONS } from '../src/data/animations'

const supabaseUrl = String(process.env.VITE_SUPABASE_URL ?? '').trim().replace(/\/+$/, '')
const anonKey = String(process.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

// For seeding, prefer the Service Role key to bypass RLS.
// DO NOT expose this key to the browser.
const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()

const supabase = createClient(supabaseUrl, serviceRoleKey || anonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

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
  // 1) Try upsert by id (TEXT id schema)
  let currentRows = rows.map((r) => ({ ...r }))
  for (let i = 0; i < 6; i++) {
    const res = await supabase.from('animations').upsert(currentRows as any, { onConflict: 'id' })
    if (!res.error) return res

    // UUID id schema: retry without id, using slug
    if (isInvalidUuid(res.error)) break

    const missing = missingColumnFromPgrst204(res.error)
    if (missing) {
      if (remapRowsForMissingColumn(currentRows, missing)) continue
      // otherwise drop the missing key
      for (const row of currentRows) delete (row as any)[missing]
      continue
    }

    return res
  }

  // 2) UUID id schema: drop id and use slug as stable key
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
  if (!supabaseUrl) {
    console.error('❌ Missing VITE_SUPABASE_URL in environment')
    process.exitCode = 1
    return
  }

  if (!serviceRoleKey && !anonKey) {
    console.error('❌ Missing VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) in environment')
    process.exitCode = 1
    return
  }

  // If we are not using the service role key, attempt to sign in as an admin user
  // (requires your RLS policies to allow admin inserts).
  if (!serviceRoleKey) {
    const adminEmail = String(process.env.SUPABASE_ADMIN_EMAIL ?? '').trim()
    const adminPassword = String(process.env.SUPABASE_ADMIN_PASSWORD ?? '').trim()

    if (adminEmail && adminPassword) {
      const { error } = await supabase.auth.signInWithPassword({ email: adminEmail, password: adminPassword })
      if (error) {
        console.error('❌ Admin sign-in failed:', { message: error.message, code: (error as any).code })
        process.exitCode = 1
        return
      }
    } else {
      console.warn(
        '⚠️ Seeding with anon key will fail if RLS blocks inserts.\n' +
          '   Recommended: set SUPABASE_SERVICE_ROLE_KEY in .env for seeding (server-side only),\n' +
          '   or set SUPABASE_ADMIN_EMAIL and SUPABASE_ADMIN_PASSWORD to seed as an admin user.'
      )
    }
  }

  const rows = ANIMATIONS.map((a) => ({
    // Keep both id + slug: id works for TEXT-id schemas, slug helps UUID-id schemas.
    id: a.id,
    slug: a.id,
    name: a.name,
    category: a.category,
    description: a.description ?? null,
    complexity: a.complexity ?? null,
    html: a.html ?? null,
    css: a.css ?? null,
    js: a.js ?? null,
    cdn_links: a.cdnLinks ?? [],
    config: a.config ?? [],
  }))

  const { error } = await upsertWithFallback(rows)

  if (error) {
    if ((error as any)?.code === '42501') {
      console.error('❌ Insert failed (RLS):', {
        code: (error as any).code,
        message: (error as any).message,
      })
      console.error(
        '➡️ Fix options:\n' +
          '1) Best: set SUPABASE_SERVICE_ROLE_KEY in .env and re-run this script (do NOT use in frontend).\n' +
          '2) Or: add an INSERT policy for the role you are using (anon/authenticated) in Supabase.\n' +
          '3) Or: set SUPABASE_ADMIN_EMAIL + SUPABASE_ADMIN_PASSWORD to seed as an admin user.'
      )
    } else {
      console.error('❌ Insert failed:', error)
    }
  } else {
    console.log('✅ All animations inserted successfully!')
  }
}

seed()
