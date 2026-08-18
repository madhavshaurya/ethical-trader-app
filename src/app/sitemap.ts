import { MetadataRoute } from 'next';
import { posts } from '@/lib/blog-data';
import { absoluteUrl } from '@/lib/site';

/**
 * Hand-curated static routes with their crawl priority.
 *
 * Previously this listed /terms, which has no page — a sitemap entry that 404s is a
 * negative quality signal — and omitted all four /markets/* pages, which do exist.
 * /live-terminal/[symbol] is deliberately excluded: it is an interactive tool with
 * unbounded symbol permutations and no indexable content.
 */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, changeFrequency: 'daily' },
  { path: '/account-management', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/markets/forex', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/markets/indices', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/markets/commodities', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/markets/crypto', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => {
    const parsed = new Date(post.date);
    return {
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: Number.isNaN(parsed.getTime()) ? now : parsed,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [...staticPages, ...blogUrls];
}
