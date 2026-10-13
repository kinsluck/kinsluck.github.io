import readingTime from 'reading-time';

export interface PostData {
  title: string;
  image: string;
  imageAttribution?: string;
  date: Date;
  category: string;
  trending?: boolean;
  topPick?: boolean;
  popular?: boolean;
  slug?: string;
}

export interface ReadingTime {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

export interface Post {
  id: string;
  slug: string;
  body: string;
  excerpt: string;
  data: PostData;
  readingTime: ReadingTime;
  render?: () => Promise<{ Content: any; headings: any[] }>;
}

export interface ContentAdapter {
  getAllPosts(): Promise<Post[]>;
  getPostsByCategory(category: string): Promise<Post[]>;
  getPostBySlug(category: string, slug: string): Promise<Post | undefined>;
  getDistinctCategories(): Promise<string[]>;
}

export type ContentProvider = 'markdown' | 'sanity';
