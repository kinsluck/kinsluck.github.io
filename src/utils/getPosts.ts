import { getContentAdapter } from './content/ContentProviderFactory';
import type { Post } from './content/types';

export type { Post };

export async function getAllPosts(): Promise<Post[]> {
  const adapter = getContentAdapter();
  return adapter.getAllPosts();
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const adapter = getContentAdapter();
  return adapter.getPostsByCategory(category);
}

export async function getPostBySlug(category: string, slug: string): Promise<Post | undefined> {
  const adapter = getContentAdapter();
  return adapter.getPostBySlug(category, slug);
}

export async function getDistinctCategories(): Promise<string[]> {
  const adapter = getContentAdapter();
  return adapter.getDistinctCategories();
}
