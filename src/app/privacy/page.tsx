import { Metadata } from 'next';
import { pageOpenGraph } from '@/lib/site';
import { SITE_CONFIG } from '@/lib/constants';
import { PRIVACY_LAST_UPDATED, PRIVACY_SECTIONS } from '@/lib/legal-content';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Ethical Trader Data Protection',
  description: 'Understand how The Ethical Trader collects, uses, and protects your information. Our commitment to privacy and data integrity.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: pageOpenGraph({
    title: 'Privacy Policy | The Ethical Trader Data Protection',
    description: 'Understand how The Ethical Trader collects, uses, and protects your information. Our commitment to privacy and data integrity.',
    url: '/privacy',
  }),
};

export default function PrivacyPage() {
  return (
    <main className="pt-32 pb-20 px-6 lg:px-16 min-h-screen bg-void">
      <div className="max-w-[800px] mx-auto text-parchment leading-[1.8]">
        <h1 className="font-serif text-[clamp(2.5rem,5vw,3.5rem)] font-light leading-[1.1] text-ivory mb-12">
          Privacy Policy
        </h1>
        
        <div className="space-y-10 text-[0.95rem]">
          {PRIVACY_SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="text-ivory font-bold text-[1.1rem] mb-4 uppercase tracking-widest">{section.heading}</h2>
              <p>
                {section.body}
              </p>
            </section>
          ))}

          <div className="pt-10 border-t border-border-subtle mt-16">
            <p className="text-stone italic text-[0.8rem]">
              Last Updated: {PRIVACY_LAST_UPDATED}. For questions regarding this policy, please contact {SITE_CONFIG.links.supportEmail}.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
