import { useEffect, useMemo, useState } from 'react';
import { ANIMATIONS } from '../data/animations';
import type { AnimationEntry, AppState, Category, ConfigParam } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type DbAnimationRow = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  complexity: string | null;
  html: string | null;
  css: string | null;
  js: string | null;
  cdn_links: unknown;
  config: unknown;
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

const mapRowToEntry = (row: DbAnimationRow): AnimationEntry => {
  return {
    id: row.id,
    name: row.name,
    category: normalizeCategory(row.category),
    description: row.description ?? '',
    html: row.html ?? '',
    css: row.css ?? '',
    js: row.js ?? '',
    cdnLinks: asStringArray(row.cdn_links),
    complexity: normalizeComplexity(row.complexity),
    config: asConfigArray(row.config),
  };
};

export const useGallery = () => {
  const [state, setState] = useState<AppState>({
    view: 'home',
    selectedId: null,
    searchQuery: '',
    selectedCategory: 'All',
  });

  const [animations, setAnimations] = useState<AnimationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);

      if (!isSupabaseConfigured || !supabase) {
        setAnimations(ANIMATIONS);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('animations')
        .select('id,name,category,description,complexity,html,css,js,cdn_links,config')
        .order('created_at', { ascending: true });

      if (cancelled) return;

      if (error || !data) {
        setAnimations(ANIMATIONS);
        setIsLoading(false);
        return;
      }

      setAnimations((data as DbAnimationRow[]).map(mapRowToEntry));
      setIsLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAnimations = useMemo(() => {
    return animations.filter(anim => {
      const matchesSearch = 
        anim.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (anim.description ?? '').toLowerCase().includes(state.searchQuery.toLowerCase());
      const matchesCategory = 
        state.selectedCategory === 'All' || anim.category === state.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [animations, state.searchQuery, state.selectedCategory]);

  const featuredAnimations = useMemo(() => animations.slice(0, 6), [animations]);

  const selectedAnimation = useMemo(() => {
    return animations.find(a => a.id === state.selectedId);
  }, [animations, state.selectedId]);

  const setView = (view: AppState['view'], selectedId: string | null = null) => {
    setState(prev => ({ ...prev, view, selectedId }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  const setCategory = (category: Category | 'All') => {
    setState(prev => ({ ...prev, selectedCategory: category }));
  };

  return {
    state,
    isLoading,
    filteredAnimations,
    featuredAnimations,
    selectedAnimation,
    setView,
    setSearchQuery,
    setCategory
  };
};