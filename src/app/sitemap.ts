import { MetadataRoute } from 'next';
import { posts } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://theethicaltrader.com'; 

  // Dynamically generate all blog post entry URLs
  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Hand-curated static routes
  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/blog',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticPages, ...blogUrls];
}
