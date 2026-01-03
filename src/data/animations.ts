
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { AnimationEntry } from '../types';

// Fallback empty array for compatibility with static imports
export const ANIMATIONS: AnimationEntry[] = [];

/**
 * Fetches dynamic animation data from Supabase.
 * Returns an array of AnimationEntry objects.
 */
export async function getAnimations(): Promise<AnimationEntry[]> {
	if (!isSupabaseConfigured || !supabase) return [];
	const { data, error } = await supabase
		.from('animations')
		.select('*');
	if (error || !data) return [];
	// Map DB rows to AnimationEntry type
	return data.map((row: any) => ({
		id: row.id,
		name: row.name,
		category: row.category,
		description: row.description ?? '',
		html: row.html ?? '',
		css: row.css ?? '',
		js: row.js ?? '',
		cdnLinks: Array.isArray(row.cdn_links) ? row.cdn_links : [],
		performanceNote: row.performance_note ?? '',
		complexity: row.complexity ?? 'Simple',
		config: Array.isArray(row.config) ? row.config : [],
	}));
}
