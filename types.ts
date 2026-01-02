export type Category = 'Background' | 'Interactive' | 'Particle' | 'WebGL' | 'Text';

export type ConfigType = 'color' | 'number' | 'select' | 'boolean';

export interface ConfigParam {
  id: string;
  label: string;
  type: ConfigType;
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface AnimationEntry {
  id: string;
  name: string;
  category: Category;
  description: string;
  html: string;
  css: string;
  js: string;
  cdnLinks?: string[];
  performanceNote?: string;
  complexity: 'Simple' | 'Medium' | 'High';
  config?: ConfigParam[];
}

export interface AppState {
  view: 'home' | 'gallery' | 'detail' | 'privacy' | 'terms';
  selectedId: string | null;
  searchQuery: string;
  selectedCategory: Category | 'All';
}