import { getCollection, type CollectionEntry } from 'astro:content';
import readingTime from 'reading-time';
import type { ContentAdapter, Post, PostData, ReadingTime } from '../types';
import { getPostSlug } from '../../postHelpers';

type MarkdownPost = CollectionEntry<'posts'>;

/**
 * 摘要长度（字符）。中文信息密度高，比英文模板的 160 短一些更合适。
 */
const EXCERPT_LENGTH = 80;

export class MarkdownContentAdapter implements ContentAdapter {
  private async convertPost(post: MarkdownPost): Promise<Post> {
    // ⚠️ 注意：在 Astro 内容集合里，frontmatter 的 `slug` 是「保留字段」，
    // 它不会出现在 post.data 上，而是被 Astro 提到条目顶层（post.slug）。
    // 原主题直接用 post.data.slug 兜底，等于把这个自定义 slug 丢掉了，
    // 中文标题会被 slugify 清空，最终生成中文 URL。这里按优先级正确取用。
    const explicitSlug =
      post.data.slug ||
      (post as unknown as { slug?: string }).slug ||
      post.id.replace(/\.(md|mdx)$/i, '');

    const slug = getPostSlug({
      ...post,
      slug: explicitSlug,
      excerpt: '',
      readingTime: { text: '', minutes: 0, time: 0, words: 0 },
    });

    await post.render();

    const body = post.body || '';
    const contentText = `${post.data.title} ${body}`
      .replace(/[#*_~\[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const readingTimeData = readingTime(contentText);

    // 生成摘要：先剥掉代码块、图片、链接语法，再清掉标记符号
    const plainText = body
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 图片整段去掉
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接只留文字
      .replace(/^\s*#{1,6}\s+/gm, '') // 标题符号
      .replace(/^\s*>\s?/gm, '') // 引用符号
      .replace(/[#*_~\[\]()!]/g, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, EXCERPT_LENGTH);

    const excerpt =
      plainText.length > 0
        ? plainText.length >= EXCERPT_LENGTH
          ? `${plainText}...`
          : plainText
        : `${post.data.title.substring(0, 100)}...`;

    return {
      id: post.id,
      slug,
      body,
      excerpt,
      data: {
        title: post.data.title,
        image: post.data.image,
        imageAttribution: post.data.imageAttribution,
        date: post.data.date,
        category: post.data.category,
        trending: post.data.trending,
        topPick: post.data.topPick,
        popular: post.data.popular,
        slug: post.data.slug,
      },
      readingTime: {
        text: readingTimeData.text,
        minutes: readingTimeData.minutes,
        time: readingTimeData.time,
        words: readingTimeData.words,
      },
      render: async () => {
        const rendered = await post.render();
        return {
          Content: rendered.Content,
          headings: rendered.headings || [],
        };
      },
    };
  }

  async getAllPosts(): Promise<Post[]> {
    const posts = await getCollection('posts');
    const convertedPosts = await Promise.all(
      posts.map((post) => this.convertPost(post))
    );

    return convertedPosts.sort((a, b) => {
      const dateA = new Date(a.data.date).getTime();
      const dateB = new Date(b.data.date).getTime();
      return dateB - dateA;
    });
  }

  async getPostsByCategory(category: string): Promise<Post[]> {
    const allPosts = await this.getAllPosts();
    return allPosts.filter(
      (post) => post.data.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getPostBySlug(category: string, slug: string): Promise<Post | undefined> {
    const allPosts = await this.getAllPosts();
    return allPosts.find(
      (post) =>
        post.data.category.toLowerCase() === category.toLowerCase() &&
        (post.slug === slug || post.id === slug)
    );
  }

  async getDistinctCategories(): Promise<string[]> {
    const allPosts = await this.getAllPosts();
    const categories = new Set(allPosts.map((post) => post.data.category));
    return Array.from(categories);
  }
}
