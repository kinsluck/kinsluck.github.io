import type { ContentAdapter, Post, PostData, ReadingTime } from '../types';
import readingTime from 'reading-time';
import slugify from 'slugify';

interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  useCdn: boolean;
  token?: string;
}

interface SanityPost {
  _id: string;
  title: string;
  slug?: { current: string };
  image?: string;
  imageAttribution?: string;
  publishedAt: string;
  category?: { title: string };
  trending?: boolean;
  topPick?: boolean;
  popular?: boolean;
  body?: any;
  bodyRaw?: string;
}

export class SanityContentAdapter implements ContentAdapter {
  private config: SanityConfig;
  private baseUrl: string;

  constructor() {
    const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
    const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
    const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || '2024-01-01';
    const useCdn = import.meta.env.PUBLIC_SANITY_USE_CDN !== 'false';
    const token = import.meta.env.SANITY_API_TOKEN;

    if (!projectId) {
      throw new Error(
        'PUBLIC_SANITY_PROJECT_ID is required. Please set it in your .env file.'
      );
    }

    this.config = {
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token,
    };

    this.baseUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;
  }

  private async query<T = any>(groqQuery: string): Promise<T[]> {
    const url = `${this.baseUrl}?query=${encodeURIComponent(groqQuery)}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.token) {
      headers.Authorization = `Bearer ${this.config.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        next: { revalidate: this.config.useCdn ? 60 : 0 },
      });

      if (!response.ok) {
        throw new Error(`Sanity API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.result || [];
    } catch (error) {
      console.error('Sanity query error:', error);
      throw error;
    }
  }

  private convertPost(sanityPost: SanityPost): Post {
    const slug = sanityPost.slug?.current || slugify(sanityPost.title, { lower: true });
    const category = sanityPost.category?.title || 'Uncategorized';
    const bodyText = sanityPost.bodyRaw || JSON.stringify(sanityPost.body || '');
    
    const contentText = `${sanityPost.title} ${bodyText}`
      .replace(/[#*_~\[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const readingTimeData = readingTime(contentText);

    const plainText = bodyText
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/[#*_~\[\]()!]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .substring(0, 160);

    const excerpt =
      plainText.length > 0
        ? plainText.length >= 160
          ? `${plainText}...`
          : plainText
        : `${sanityPost.title.substring(0, 100)}...`;

    return {
      id: sanityPost._id,
      slug,
      body: bodyText,
      excerpt,
      data: {
        title: sanityPost.title,
        image: sanityPost.image || '',
        imageAttribution: sanityPost.imageAttribution,
        date: new Date(sanityPost.publishedAt),
        category,
        trending: sanityPost.trending || false,
        topPick: sanityPost.topPick || false,
        popular: sanityPost.popular || false,
        slug: sanityPost.slug?.current,
      },
      readingTime: {
        text: readingTimeData.text,
        minutes: readingTimeData.minutes,
        time: readingTimeData.time,
        words: readingTimeData.words,
      },
      render: async () => {
        return {
          Content: () => {
            return `<div>${bodyText}</div>`;
          },
          headings: [],
        };
      },
    };
  }

  async getAllPosts(): Promise<Post[]> {
    const groqQuery = `
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        image,
        imageAttribution,
        publishedAt,
        category->{
          title
        },
        trending,
        topPick,
        popular,
        body,
        "bodyRaw": pt::text(body)
      }
    `;

    const sanityPosts = await this.query<SanityPost>(groqQuery);
    return sanityPosts.map((post) => this.convertPost(post));
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    const groqQuery = `
      *[_type == "post" && category->title match $category] | order(publishedAt desc) {
        _id,
        title,
        slug,
        image,
        imageAttribution,
        publishedAt,
        category->{
          title
        },
        trending,
        topPick,
        popular,
        body,
        "bodyRaw": pt::text(body)
      }
    `;

    const sanityPosts = await this.query<SanityPost>(groqQuery);
    return sanityPosts.map((post) => this.convertPost(post));
  }

  async getPostBySlug(category: string, slug: string): Promise<Post | undefined> {
    const groqQuery = `
      *[_type == "post" && slug.current == $slug && category->title match $category][0] {
        _id,
        title,
        slug,
        image,
        imageAttribution,
        publishedAt,
        category->{
          title
        },
        trending,
        topPick,
        popular,
        body,
        "bodyRaw": pt::text(body)
      }
    `;

    const sanityPosts = await this.query<SanityPost>(groqQuery);
    if (sanityPosts.length === 0) return undefined;
    return this.convertPost(sanityPosts[0]);
  }

  async getDistinctCategories(): Promise<string[]> {
    const groqQuery = `
      array::unique(*[_type == "post"].category->title)
    `;

    const categories = await this.query<string>(groqQuery);
    return categories.filter(Boolean);
  }
}
