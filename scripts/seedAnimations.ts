import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { ANIMATIONS } from '../src/data/animations'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

async function seed() {
  const rows = ANIMATIONS.map(a => ({
    id: a.id,
    name: a.name,
    category: a.category,
    description: a.description ?? null,
    complexity: a.complexity ?? null,
    html: a.html ?? null,
    css: a.css ?? null,
    js: a.js ?? null,
    cdn_links: a.cdnLinks ?? [],
    config: a.config ?? []
  }))

 const { error } = await supabase
  .from('animations')
  .upsert(rows, { onConflict: 'id' })

  if (error) {
    console.error('❌ Insert failed:', error)
  } else {
    console.log('✅ All animations inserted successfully!')
  }
}

seed()
