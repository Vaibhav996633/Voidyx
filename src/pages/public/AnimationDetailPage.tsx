import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailView from '../../components/DetailView';
import { supabase } from '../../lib/supabase';
import type { AnimationEntry } from '../../types';

function isMissingColumnError(err: any): boolean {
  const code = typeof err?.code === 'string' ? err.code : '';
  const message = typeof err?.message === 'string' ? err.message : '';
  return code === '42703' || /does not exist/i.test(message);
}

function isInvalidUuidError(err: any): boolean {
  const code = typeof err?.code === 'string' ? err.code : '';
  const message = typeof err?.message === 'string' ? err.message : '';
  return code === '22P02' || /invalid input syntax for type uuid/i.test(message);
}

function pickString(data: any, keys: string[]): string {
  for (const key of keys) {
    const value = data?.[key];
    if (typeof value === 'string') return value;
  }
  return '';
}

function normalizeAnimationFromDb(data: any): AnimationEntry {
  const cdnValue = (data as any)?.cdn_links ?? (data as any)?.cdn_urls ?? (data as any)?.cdnLinks;
  const configValue = (data as any)?.config ?? (data as any)?.config_json ?? (data as any)?.configParams;
  return {
    id: (typeof data?.slug === 'string' && data.slug.trim()) ? data.slug : data?.id,
    name: data?.name,
    category: data?.category,
    description: data?.description ?? '',
    html: pickString(data, ['html', 'html_code', 'htmlCode', 'markup', 'markup_html']),
    css: pickString(data, ['css', 'css_code', 'cssCode', 'styles', 'styles_css']),
    js: pickString(data, ['js', 'js_code', 'jsCode', 'script', 'script_js']),
    cdnLinks: Array.isArray(cdnValue) ? cdnValue : undefined,
    complexity: ((data as any)?.complexity ?? 'Medium') as any,
    config: Array.isArray(configValue) ? configValue : undefined,
  };
}

type AnimationRow = 'animations' | 'premium_animations';

async function fetchOneByField(table: AnimationRow, field: 'id' | 'slug', value: string) {
  const columns = 'id,name,category,description,complexity,html,css,js,cdn_links,config,slug';
  const base = supabase.from(table).select(columns).eq(field, value).single();

  const attempt = await base;
  if (!attempt.error) return attempt;

  if (isMissingColumnError(attempt.error)) {
    return supabase.from(table).select('*').eq(field, value).single();
  }

  const reduced = await supabase
    .from(table)
    .select('id,name,category,description,complexity,html,css,js,slug')
    .eq(field, value)
    .single();

  if (!reduced.error) return reduced;
  if (isMissingColumnError(reduced.error)) {
    return supabase.from(table).select('*').eq(field, value).single();
  }

  return reduced;
}

export default function AnimationDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id as string | undefined;

  const [animation, setAnimation] = React.useState<AnimationEntry | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      let res: Awaited<ReturnType<typeof fetchOneByField>> | null = null;
      let data: any = null;

      for (const table of ['animations', 'premium_animations'] as AnimationRow[]) {
        res = await fetchOneByField(table, 'id', id);
        if (res.error && isInvalidUuidError(res.error)) {
          res = await fetchOneByField(table, 'slug', id);
        }

        if (!res.error && res.data) {
          data = res.data;
          break;
        }
      }

      if (res?.error) {
        // eslint-disable-next-line no-console
        console.error('[AnimationDetailPage] Failed to load animation:', res.error);
      }

      if (cancelled) return;

      if (!data) {
        setAnimation(null);
        setLoading(false);
        return;
      }

      setAnimation(normalizeAnimationFromDb(data));
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.6em]">Loading unit…</p>
      </main>
    );
  }

  if (!animation) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.6em]">Unit not found</p>
          <button
            onClick={() => navigate('/gallery')}
            className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500 hover:text-white"
          >
            Back to gallery
          </button>
        </div>
      </main>
    );
  }

  return <DetailView animation={animation} onBack={() => navigate('/gallery')} />;
}
