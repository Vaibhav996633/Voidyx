
import { useState, useMemo } from 'react';
import { ANIMATIONS } from '../data/animations';
import { AppState, Category } from '../types';

export const useGallery = () => {
  const [state, setState] = useState<AppState>({
    view: 'home',
    selectedId: null,
    searchQuery: '',
    selectedCategory: 'All',
  });

  const filteredAnimations = useMemo(() => {
    return ANIMATIONS.filter(anim => {
      const matchesSearch = 
        anim.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        anim.description.toLowerCase().includes(state.searchQuery.toLowerCase());
      const matchesCategory = 
        state.selectedCategory === 'All' || anim.category === state.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [state.searchQuery, state.selectedCategory]);

  const featuredAnimations = useMemo(() => ANIMATIONS.slice(0, 6), []);

  const selectedAnimation = useMemo(() => {
    return ANIMATIONS.find(a => a.id === state.selectedId);
  }, [state.selectedId]);

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
    filteredAnimations,
    featuredAnimations,
    selectedAnimation,
    setView,
    setSearchQuery,
    setCategory
  };
};
