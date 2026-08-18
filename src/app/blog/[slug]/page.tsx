import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { posts } from '@/lib/blog-data';
import { SITE_NAME, SITE_URL, SITE_LOCALE, absoluteUrl } from '@/lib/site';

interface Props {
  // Next 16 passes params as a Promise; the previous non-Promise type was wrong.
  params: Promise<{ slug: string }>;
}

/** Blog dates are display strings ("Mar 15, 2026"); structured data needs ISO 8601. */
function isoDate(value: string): string | undefined {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

// Pre-render every post at build time so they are static and instantly crawlable.
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found', robots: { index: false, follow: false } };

  const url = `/blog/${post.slug}`;
  const published = isoDate(post.date);

  return {
    title: `${post.title} | The Ethical Trader`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: 'article',
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      publishedTime: published,
      images: [{ url: post.image, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const published = isoDate(post.date);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(post.image)],
    articleSection: post.category,
    datePublished: published,
    dateModified: published,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/blog/${post.slug}`),
    },
    inLanguage: 'en-IN',
  };

  return (
    <article className="pt-32 pb-20 px-6 lg:px-16 min-h-screen bg-void">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="max-w-[800px] mx-auto">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-widest uppercase text-stone hover:text-gold-light transition-colors mb-12"
        >
          ← Back to Insights
        </Link>

        <div className="flex items-center gap-4 text-[0.65rem] font-bold tracking-[0.2em] text-gold-mid uppercase mb-6">
          <span>{post.category}</span>
          <span className="w-1 h-1 rounded-full bg-stone" />
          <span className="text-stone">{post.date}</span>
        </div>

        <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] text-ivory mb-10">
          {post.title}
        </h1>

        <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden mb-16 border border-border-subtle">
          <Image 
            src={post.image} 
            alt={post.title} 
            fill 
            sizes="(max-width: 800px) 100vw, 800px"
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-8">
          {post.content.map((paragraph, index) => (
            <p key={index} className="text-parchment leading-[1.8] text-[1.15rem] font-light">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-border-subtle">
          <div className="bg-onyx/50 border border-border-subtle rounded-xl p-8 md:p-12 text-center">
            <h3 className="font-serif text-[1.8rem] text-ivory mb-4">Master these concepts in the live terminal</h3>
            <p className="text-stone mb-8 max-w-[500px] mx-auto">Apply institutional logic in real-time with our advanced order flow engine and AI signals.</p>
            <Link 
              href="/#terminal" 
              className="inline-block px-10 py-4 bg-gold hover:bg-gold-light text-void font-bold text-[0.8rem] uppercase tracking-widest rounded-sm transition-all shadow-xl hover:shadow-gold/20"
            >
              Enter Live Terminal
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export async function generateStaticPaths() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
