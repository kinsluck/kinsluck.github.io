import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    image: z.string(),
    imageAttribution: z.string().optional(),
    date: z.coerce.date(),
    category: z.string(),
    trending: z.boolean().optional().default(false),
    topPick: z.boolean().optional().default(false),
    popular: z.boolean().optional().default(false),
    slug: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
