import type { Post } from './content/types';
import { formatDateLong, formatDateShort } from './formatDate';
import slugify from 'slugify';

/**
 * 分类「显示名」->「URL slug」的映射表。
 *
 * 背景：slugify 会把 CJK（中日韩）字符全部剥离，中文分类名 slugify 之后是空字符串，
 * 会导致路由变成 `//post` 而 404。因此中文分类必须在这里显式给出英文 slug。
 * 新增中文分类时，记得在这里补一条映射。
 */
export const CATEGORY_SLUGS: Record<string, string> = {
  随笔: 'essays',
  动画: 'anime',
  游戏: 'games',
};

/**
 * 把分类名转成 URL slug。
 * 命中映射表用映射值；否则回退到 slugify；再不行退化为 URL 编码原文。
 */
export function slugifyCategory(category: string): string {
  if (!category) return '';
  const mapped = CATEGORY_SLUGS[category];
  if (mapped) return mapped;
  const slug = slugify(category, { lower: true });
  return slug || encodeURIComponent(category);
}

export function calculateReadingTime(
  words: number,
  wordsPerMinute: number = 275
): number {
  return Math.ceil(words / wordsPerMinute);
}

export function getPostSlug(post: Post): string {
  if (post.slug) {
    return post.slug;
  }
  const slug = slugify(post.data.title, { lower: true });
  return slug || encodeURIComponent(post.data.title);
}

export function getPostUrl(post: Post): string {
  const categorySlug = slugifyCategory(post.data.category);
  const slug = getPostSlug(post);
  return `/${categorySlug}/${slug}`;
}

export function getCategoryUrl(category: string): string {
  return `/${slugifyCategory(category)}`;
}

export interface NormalizedPostData {
  title: string;
  category: string;
  date: string;
  dateLong: string;
  dateShort: string;
  slug: string;
  image?: string;
  excerpt: string;
  readingTime: number;
  url: string;
  categoryUrl: string;
}

export function normalizePostData(post: Post): NormalizedPostData {
  return {
    title: post.data.title,
    category: post.data.category,
    date: post.data.date.toISOString(),
    dateLong: formatDateLong(post.data.date),
    dateShort: formatDateShort(post.data.date),
    slug: getPostSlug(post),
    image: post.data.image,
    excerpt: post.excerpt,
    readingTime: calculateReadingTime(post.readingTime.words),
    url: getPostUrl(post),
    categoryUrl: getCategoryUrl(post.data.category),
  };
}
