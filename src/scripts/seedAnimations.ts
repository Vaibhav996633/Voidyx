import { createClient } from '@supabase/supabase-js'
import { ANIMATIONS } from '../src/data/animations' // adjust path if needed

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

async function seed() {
  const formatted = ANIMATIONS.map(anim => ({
    id: anim.id,
    name: anim.name,
    category: anim.category,
    description: anim.description ?? null,
    complexity: anim.complexity ?? null,
    html: anim.html ?? null,
    css: anim.css ?? null,
    js: anim.js ?? null,
    cdn_links: anim.cdnLinks ?? [],
    config: anim.config ?? []
  }))

  const { error } = await supabase
    .from('animations')
    .insert(formatted)

  if (error) {
    console.error('❌ Error inserting data:', error)
  } else {
    console.log('✅ All animations inserted successfully!')
  }
}

seed()
