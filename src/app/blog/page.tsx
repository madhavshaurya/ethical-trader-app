import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { posts } from '@/lib/blog-data';

export const metadata: Metadata = {
  title: 'Trading Insights | The Ethical Trader Blog',
  description: 'Explore the latest insights on ICT, SMC, and Order Flow trading. Our blog provides deep dives into market behavior and disciplined trading strategies.',
};

export default function BlogPage() {
  return (
    <main className="pt-32 pb-20 px-6 lg:px-16 min-h-screen bg-void">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:block before:w-10 before:h-[1px] before:bg-amber">
          Market Intelligence
        </div>
        
        <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.1] text-ivory mb-16">
          The <em className="italic text-gold-mid">Ethical Trader</em> Blog
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group cursor-pointer">
              <article>
                <div className="mb-6 overflow-hidden rounded-md border border-border-subtle bg-onyx aspect-[16/9] relative">
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent opacity-60" />
                </div>
                <div className="flex items-center gap-4 text-[0.65rem] font-bold tracking-[0.1em] text-gold-mid uppercase mb-3">
                  <span>{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-stone" />
                  <span className="text-stone">{post.date}</span>
                </div>
                <h2 className="font-serif text-[1.6rem] text-ivory leading-tight mb-4 group-hover:text-gold-light transition-colors">
                  {post.title}
                </h2>
                <p className="text-parchment leading-relaxed text-[0.95rem] line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-2 text-gold-light font-bold text-[0.7rem] uppercase tracking-widest group-hover:gap-4 transition-all">
                  Read Analysis <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
