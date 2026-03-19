import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { posts } from '@/lib/blog-data';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | The Ethical Trader`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-32 pb-20 px-6 lg:px-16 min-h-screen bg-void">
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
