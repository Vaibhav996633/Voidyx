import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Sandbox from '../../components/Sandbox';
import type { AnimationEntry, Category, ConfigParam } from '../../types';

type FormState = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  complexity: string;
  cdn_links: string; // JSON array or newline list
  config: string; // JSON array
  html: string;
  css: string;
  js: string;
};

const empty: FormState = {
  id: '',
  slug: '',
  name: '',
  category: 'Background',
  description: '',
  complexity: 'Medium',
  cdn_links: '[]',
  config: '[]',
  html: '',
  css: '',
  js: '',
};

const CATEGORIES: Category[] = ['Background', 'Interactive', 'Particle', 'WebGL', 'Text'];
const COMPLEXITIES: AnimationEntry['complexity'][] = ['Simple', 'Medium', 'High'];

function normalizeCategory(value: unknown): Category {
  return CATEGORIES.includes(value as Category) ? (value as Category) : 'Background';
}

function normalizeComplexity(value: unknown): AnimationEntry['complexity'] {
  return COMPLEXITIES.includes(value as AnimationEntry['complexity'])
    ? (value as AnimationEntry['complexity'])
    : 'Medium';
}

function parseMaybeJsonArray<T>(raw: string, fallback: T[]): T[] {
  const text = (raw ?? '').trim();
  if (!text) return fallback;
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function parseCdnLinks(raw: string): string[] {
  const text = (raw ?? '').trim();
  if (!text) return [];
  // Allow JSON array or newline-separated URLs
  if (text.startsWith('[')) {
    const arr = parseMaybeJsonArray<string>(text, []);
    return arr.filter((v) => typeof v === 'string' && v.trim());
  }
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseConfig(raw: string): ConfigParam[] {
  const arr = parseMaybeJsonArray<ConfigParam>(raw, []);
  return arr.filter((p) => p && typeof p === 'object' && typeof (p as any).id === 'string');
}

type ImportedAnimation = Partial<{
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  complexity: string;
  config: ConfigParam[];
  cdnLinks: string[];
  cdn_links: string[];
  html: string;
  css: string;
  js: string;
}>;

function missingColumnFromPgrst204(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null;
  const e = err as any;
  if (e.code !== 'PGRST204' || typeof e.message !== 'string') return null;
  const m = e.message.match(/Could not find the '([^']+)' column/i);
  return m?.[1] ?? null;
}

function remapMissingColumn(current: Record<string, any>, missing: string): boolean {
  // Try common alternate column names used in older/newer schemas.
  // This is best-effort: if the alternate column also doesn't exist, the next retry will delete it.
  const mappings: Record<string, string[]> = {
    html: ['html_code', 'htmlCode'],
    css: ['css_code', 'cssCode'],
    js: ['js_code', 'jsCode'],
    cdn_links: ['cdn_urls', 'cdnLinks'],
    config: ['config_json', 'configParams'],
  };

  const alternatives = mappings[missing];
  if (!alternatives) return false;
  if (!Object.prototype.hasOwnProperty.call(current, missing)) return false;
  if (current[missing] === undefined) return false;

  for (const alt of alternatives) {
    if (!Object.prototype.hasOwnProperty.call(current, alt)) {
      current[alt] = current[missing];
      delete current[missing];
      return true;
    }
  }

  return false;
}

async function insertWithColumnFallback(table: string, payload: Record<string, any>) {
  let current = { ...payload };
  for (let i = 0; i < 6; i++) {
    const res = await supabase.from(table).insert(current as any);
    if (!res.error) return res;

    const missing = missingColumnFromPgrst204(res.error);
    if (missing) {
      if (remapMissingColumn(current, missing)) continue;
      if (Object.prototype.hasOwnProperty.call(current, missing)) {
        delete (current as any)[missing];
        continue;
      }
    }

    return res;
  }
  return supabase.from(table).insert(current as any);
}

async function updateWithColumnFallback(table: string, payload: Record<string, any>, id: string) {
  let current = { ...payload };
  for (let i = 0; i < 6; i++) {
    const res = await supabase.from(table).update(current as any).eq('id', id);
    if (!res.error) return res;

    const missing = missingColumnFromPgrst204(res.error);
    if (missing) {
      if (remapMissingColumn(current, missing)) continue;
      if (Object.prototype.hasOwnProperty.call(current, missing)) {
        delete (current as any)[missing];
        continue;
      }
    }

    return res;
  }
  return supabase.from(table).update(current as any).eq('id', id);
}

function safeParseAnimationObjectLiteral(input: string): ImportedAnimation {
  const trimmed = (input ?? '').trim();
  if (!trimmed) return {};

  // Accept either `{ ... }` or a full object assigned to a variable.
  const match = trimmed.match(/\{[\s\S]*\}$/);
  const objText = match ? match[0] : trimmed;

  // NOTE: This evaluates JS. Only use with trusted input (admin-only).
  // We immediately sanitize by picking allowed keys.
  const value = new Function(`"use strict"; return (${objText});`)() as unknown;
  if (!value || typeof value !== 'object') return {};

  const v = value as any;
  const out: ImportedAnimation = {};

  if (typeof v.id === 'string') out.id = v.id;
  if (typeof v.slug === 'string') out.slug = v.slug;
  if (typeof v.name === 'string') out.name = v.name;
  if (typeof v.category === 'string') out.category = v.category;
  if (typeof v.description === 'string') out.description = v.description;
  if (typeof v.complexity === 'string') out.complexity = v.complexity;
  if (typeof v.html === 'string') out.html = v.html;
  if (typeof v.css === 'string') out.css = v.css;
  if (typeof v.js === 'string') out.js = v.js;

  if (Array.isArray(v.config)) out.config = v.config as ConfigParam[];
  if (Array.isArray(v.cdnLinks)) out.cdnLinks = v.cdnLinks as string[];
  if (Array.isArray(v.cdn_links)) out.cdn_links = v.cdn_links as string[];

  return out;
}

function slugify(input: unknown): string {
  return String(input ?? '')
    .trim()
    .toLowerCase()
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function isMissingColumnError(err: any): boolean {
  const code = typeof err?.code === 'string' ? err.code : '';
  const message = typeof err?.message === 'string' ? err.message : '';
  return code === '42703' || /does not exist/i.test(message);
}

export default function AdminAnimationFormPage() {
  const navigate = useNavigate();
  const params = useParams();
  const animationId = params.id;

  const isEdit = Boolean(animationId);
  const [state, setState] = React.useState<FormState>(empty);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [importCode, setImportCode] = React.useState('');
  const [previewEnabled, setPreviewEnabled] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!isEdit || !animationId) return;

      const attempt = await supabase
        .from('animations')
        .select('id,name,category,description,complexity,html,css,js,cdn_links,config')
        .eq('id', animationId)
        .single();

      const res = attempt.error
        ? isMissingColumnError(attempt.error)
          ? await supabase.from('animations').select('*').eq('id', animationId).single()
          : await supabase
              .from('animations')
              .select('id,name,category,description,html,css,js,cdn_links,config')
              .eq('id', animationId)
              .single()
        : attempt;

      const data = res.data as any;
      const loadError = res.error;

      if (cancelled) return;

      if (loadError || !data) {
        setError(loadError?.message ?? 'Failed to load animation');
        return;
      }

      setState({
        id: data.id ?? '',
        slug: (data as any).slug ?? '',
        name: data.name ?? '',
        category: data.category ?? 'Background',
        description: data.description ?? '',
        complexity: data.complexity ?? 'Medium',
        cdn_links: JSON.stringify((data as any).cdn_links ?? [], null, 2),
        config: JSON.stringify((data as any).config ?? [], null, 2),
        html: data.html ?? '',
        css: data.css ?? '',
        js: data.js ?? '',
      });
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [isEdit, animationId]);

  const set = (key: keyof FormState, value: string) => setState((p) => ({ ...p, [key]: value }));

  const onLoadFromCode = () => {
    setError(null);
    try {
      const parsed = safeParseAnimationObjectLiteral(importCode);

      const nextId = typeof parsed.id === 'string' ? parsed.id : '';
      const nextName = typeof parsed.name === 'string' ? parsed.name : '';
      const suggestedSlug =
        (typeof parsed.slug === 'string' && parsed.slug.trim())
          ? parsed.slug
          : nextId.trim()
          ? nextId
          : nextName.trim()
          ? slugify(nextName)
          : '';

      setState((p) => ({
        ...p,
        id: typeof parsed.id === 'string' ? parsed.id : p.id,
        slug: suggestedSlug || p.slug,
        name: typeof parsed.name === 'string' ? parsed.name : p.name,
        category: typeof parsed.category === 'string' ? parsed.category : p.category,
        description: typeof parsed.description === 'string' ? parsed.description : p.description,
        complexity: typeof parsed.complexity === 'string' ? parsed.complexity : p.complexity,
        config: Array.isArray(parsed.config) ? JSON.stringify(parsed.config, null, 2) : p.config,
        cdn_links: Array.isArray(parsed.cdnLinks)
          ? JSON.stringify(parsed.cdnLinks, null, 2)
          : Array.isArray(parsed.cdn_links)
          ? JSON.stringify(parsed.cdn_links, null, 2)
          : p.cdn_links,
        html: typeof parsed.html === 'string' ? parsed.html : p.html,
        css: typeof parsed.css === 'string' ? parsed.css : p.css,
        js: typeof parsed.js === 'string' ? parsed.js : p.js,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse code');
    }
  };

  const previewAnimation: AnimationEntry = React.useMemo(
    () => ({
      id: state.id || 'preview',
      name: state.name || 'Preview',
      category: normalizeCategory(state.category),
      description: state.description || '',
      complexity: normalizeComplexity(state.complexity),
      html: state.html || '',
      css: state.css || '',
      js: state.js || '',
      cdnLinks: parseCdnLinks(state.cdn_links),
      config: parseConfig(state.config),
    }),
    [state]
  );

  const previewConfig = React.useMemo(() => {
    const entries = (previewAnimation.config ?? []).map((p) => [p.id, p.default] as const);
    return Object.fromEntries(entries);
  }, [previewAnimation.config]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!(state.id ?? '').trim()) {
        throw new Error('ID is required (use a unique text id).');
      }
      if (!(state.name ?? '').trim()) {
        throw new Error('Name is required.');
      }

      const finalSlug = (state.slug ?? '').trim() || (state.id ?? '').trim() || slugify(state.name);
      if (!finalSlug) {
        throw new Error('Slug is required.');
      }

      let parsedConfig: any = [];
      let parsedCdnLinks: any = [];

      try {
        parsedConfig = parseConfig(state.config);
      } catch {
        throw new Error('Config must be a valid JSON array.');
      }

      try {
        parsedCdnLinks = parseCdnLinks(state.cdn_links);
      } catch {
        throw new Error('CDN links must be a JSON array or newline-separated list.');
      }

      const basePayload = {
        id: state.id,
        slug: finalSlug,
        name: state.name,
        category: state.category,
        description: state.description,
        complexity: state.complexity,
        html: state.html,
        css: state.css,
        js: state.js,
      };

      const extendedPayload = {
        ...basePayload,
        cdn_links: parsedCdnLinks,
        config: parsedConfig,
      };

      if (isEdit) {
        const res = await updateWithColumnFallback(
          'animations',
          {
            slug: finalSlug,
            name: extendedPayload.name,
            category: extendedPayload.category,
            description: extendedPayload.description,
            complexity: extendedPayload.complexity,
            cdn_links: (extendedPayload as any).cdn_links,
            config: (extendedPayload as any).config,
            html: extendedPayload.html,
            css: extendedPayload.css,
            js: extendedPayload.js,
          },
          animationId as string
        );

        if (res.error) throw res.error;
      } else {
        let res = await insertWithColumnFallback('animations', extendedPayload as any);

        // If the DB column `id` is UUID in the live project, inserting a text slug will 400.
        // Retry without `id` so Postgres can generate it (if configured).
        if (res.error && (res.error as any).code === '22P02') {
          const noIdPayload = {
            name: state.name,
            slug: finalSlug,
            category: state.category,
            description: state.description,
            complexity: state.complexity,
            html: state.html,
            css: state.css,
            js: state.js,
            cdn_links: parsedCdnLinks,
            config: parsedConfig,
          };
          res = await insertWithColumnFallback('animations', noIdPayload as any);
        }

        if (res.error) throw res.error;
      }

      setSaving(false);
      navigate('/voidyx-admin/animations', { replace: true });
    } catch (err) {
      setSaving(false);
      // eslint-disable-next-line no-console
      console.error('[AdminAnimationFormPage] Save failed:', err);

      if (err && typeof err === 'object') {
        const e = err as any;
        const details = [e.message, e.details, e.hint, e.code].filter(Boolean).join(' | ');

        // Add actionable hints for common failures
        if (e.code === '22P02' && String(e.message || '').toLowerCase().includes('uuid')) {
          setError(
            `${details}\nHint: Your Supabase table likely has id as UUID. Change id to TEXT (slug) or allow UUID ids.`
          );
          return;
        }

        if (String(e.message || '').toLowerCase().includes('row-level security')) {
          setError(
            `${details}\nHint: Missing RLS INSERT policy. Ensure you applied backend/supabase/schema.sql and your user is in admin_users.`
          );
          return;
        }

        setError(details || 'Failed to save');
        return;
      }

      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-black uppercase tracking-tight">
          {isEdit ? 'Edit animation' : 'Add animation'}
        </h1>
        <p className="text-zinc-500 text-sm">Basic info + code</p>
      </div>

      {!isEdit && (
        <div className="border border-white/[0.06] bg-black/20 p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">
              Paste animation object
            </p>
            <button
              type="button"
              onClick={onLoadFromCode}
              className="bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-[0.4em] hover:opacity-95 transition-opacity"
            >
              Load from code
            </button>
          </div>

          <textarea
            value={importCode}
            onChange={(e) => setImportCode(e.target.value)}
            className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-4 text-[11px] font-mono text-white outline-none w-full min-h-[180px] focus:border-white/30 transition-colors"
            placeholder="Paste like: { id: 'plasma-glow', name: 'Plasma Glow', ... }"
          />

          <label className="flex items-center gap-3 text-zinc-500 text-xs select-none">
            <input
              type="checkbox"
              checked={previewEnabled}
              onChange={(e) => setPreviewEnabled(e.target.checked)}
              className="accent-white"
            />
            Enable live preview
          </label>
        </div>
      )}

      {previewEnabled && (state.html || state.css || state.js) && (
        <div className="border border-white/[0.06] bg-black/20 p-6 space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">Preview</p>
          <div className="h-[320px] border border-white/[0.06]">
            <Sandbox animation={previewAnimation} currentConfig={previewConfig} />
          </div>
          <p className="text-zinc-500 text-xs">
            Preview runs in an isolated iframe sandbox. If your JS throws, check the iframe console.
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">ID</label>
            <input
              value={state.id}
              onChange={(e) => set('id', e.target.value)}
              disabled={isEdit}
              className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] tracking-widest text-white outline-none w-full disabled:opacity-60 focus:border-white/30 transition-colors"
              placeholder="unique-id"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">Slug</label>
            <input
              value={state.slug}
              onChange={(e) => set('slug', e.target.value)}
              className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] tracking-widest text-white outline-none w-full focus:border-white/30 transition-colors"
              placeholder={state.id ? state.id : state.name ? slugify(state.name) : 'plasma-glow'}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">Name</label>
            <input
              value={state.name}
              onChange={(e) => set('name', e.target.value)}
              className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] tracking-widest text-white outline-none w-full focus:border-white/30 transition-colors"
              placeholder="Animation name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">Category</label>
            <input
              value={state.category}
              onChange={(e) => set('category', e.target.value)}
              className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] tracking-widest text-white outline-none w-full focus:border-white/30 transition-colors"
              placeholder="Background"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">Complexity</label>
            <input
              value={state.complexity}
              onChange={(e) => set('complexity', e.target.value)}
              className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] tracking-widest text-white outline-none w-full focus:border-white/30 transition-colors"
              placeholder="Medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">CDN Links</label>
            <textarea
              value={state.cdn_links}
              onChange={(e) => set('cdn_links', e.target.value)}
              className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] font-mono text-white outline-none w-full min-h-[140px] focus:border-white/30 transition-colors"
              placeholder='Either JSON array like ["https://..."] or newline-separated URLs'
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">Config</label>
            <textarea
              value={state.config}
              onChange={(e) => set('config', e.target.value)}
              className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] font-mono text-white outline-none w-full min-h-[140px] focus:border-white/30 transition-colors"
              placeholder='JSON array like [{"id":"speed","label":"Motion","type":"number","default":1,"min":0.1,"max":5,"step":0.1}]'
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">Description</label>
          <textarea
            value={state.description}
            onChange={(e) => set('description', e.target.value)}
            className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] tracking-widest text-white outline-none w-full min-h-[120px] focus:border-white/30 transition-colors"
            placeholder="What it does / use cases / performance notes"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">HTML</label>
          <textarea
            value={state.html}
            onChange={(e) => set('html', e.target.value)}
            className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] font-mono text-white outline-none w-full min-h-[160px] focus:border-white/30 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">CSS</label>
          <textarea
            value={state.css}
            onChange={(e) => set('css', e.target.value)}
            className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] font-mono text-white outline-none w-full min-h-[160px] focus:border-white/30 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">JavaScript</label>
          <textarea
            value={state.js}
            onChange={(e) => set('js', e.target.value)}
            className="bg-black/40 border border-white/[0.08] rounded-none px-6 py-3 text-[11px] font-mono text-white outline-none w-full min-h-[200px] focus:border-white/30 transition-colors"
          />
        </div>

        {error && <p className="text-red-400 text-[11px]">{error}</p>}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-white text-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.5em] disabled:opacity-50 hover:opacity-95 transition-opacity"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
