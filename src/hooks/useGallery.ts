import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { AnimationEntry, Category, ConfigParam } from '../types';

type DbAnimationRow = {
  id: string;
  slug?: string | null;
  name: string;
  category: string;
  description: string | null;
  complexity: string | null;
  html?: string | null;
  css?: string | null;
  js?: string | null;
  html_code?: string | null;
  css_code?: string | null;
  js_code?: string | null;
  htmlCode?: string | null;
  cssCode?: string | null;
  jsCode?: string | null;
  cdn_links?: unknown;
  cdn_urls?: unknown;
  cdnLinks?: unknown;
  config?: unknown;
  config_json?: unknown;
  configParams?: unknown;
};

const CATEGORIES: Category[] = ['Background', 'Interactive', 'Particle', 'WebGL', 'Text'];
const COMPLEXITIES: AnimationEntry['complexity'][] = ['Simple', 'Medium', 'High'];

const asStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((v) => typeof v === 'string');
  return strings.length ? strings : undefined;
};

const asConfigArray = (value: unknown): ConfigParam[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((v) => v && typeof v === 'object') as ConfigParam[];
  return items.length ? items : undefined;
};

const normalizeCategory = (value: unknown): Category => {
  return CATEGORIES.includes(value as Category) ? (value as Category) : 'Background';
};

const normalizeComplexity = (value: unknown): AnimationEntry['complexity'] => {
  return COMPLEXITIES.includes(value as AnimationEntry['complexity'])
    ? (value as AnimationEntry['complexity'])
    : 'Medium';
};

const pickString = (row: any, keys: string[]): string => {
  for (const key of keys) {
    const value = row?.[key];
    if (typeof value === 'string') return value;
  }
  return '';
};

const mapRowToEntry = (row: DbAnimationRow): AnimationEntry => {
  const slug = typeof (row as any).slug === 'string' ? (row as any).slug.trim() : '';
  const cdnValue = (row as any).cdn_links ?? (row as any).cdn_urls ?? (row as any).cdnLinks;
  const configValue = (row as any).config ?? (row as any).config_json ?? (row as any).configParams;
  return {
    id: slug || row.id,
    name: row.name,
    category: normalizeCategory(row.category),
    description: row.description ?? '',
    html: pickString(row, ['html', 'html_code', 'htmlCode', 'markup', 'markup_html']),
    css: pickString(row, ['css', 'css_code', 'cssCode', 'styles', 'styles_css']),
    js: pickString(row, ['js', 'js_code', 'jsCode', 'script', 'script_js']),
    cdnLinks: asStringArray(cdnValue),
    complexity: normalizeComplexity(row.complexity),
    config: asConfigArray(configValue),
  };
};

export function useGallery() {
  const [free, setFree] = useState<AnimationEntry[]>([]);
  const [premium, setPremium] = useState<AnimationEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnimations() {
      setLoading(true);

      // Prefer ordering by created_at, but fall back if the column doesn't exist.
      const [freeAttempt, premiumAttempt] = await Promise.all([
        supabase.from('animations').select('*').order('created_at', { ascending: false }),
        supabase.from('premium_animations').select('*').order('created_at', { ascending: false }),
      ]);

      const freeRes = freeAttempt.error
        ? await supabase.from('animations').select('*')
        : freeAttempt;

      const premiumRes = premiumAttempt.error
        ? await supabase.from('premium_animations').select('*')
        : premiumAttempt;

      if (freeRes.error) {
        // eslint-disable-next-line no-console
        console.error('[useGallery] Failed to load animations:', freeRes.error);
      }
      if (premiumRes.error) {
        // eslint-disable-next-line no-console
        console.warn('[useGallery] Failed to load premium_animations (optional):', premiumRes.error);
      }

      setFree(((freeRes.data ?? []) as any[]).map((r) => mapRowToEntry(r as DbAnimationRow)));
      setPremium(((premiumRes.data ?? []) as any[]).map((r) => mapRowToEntry(r as DbAnimationRow)));
      setLoading(false);
    }

    fetchAnimations();
  }, []);

  return { free, premium, loading };
}