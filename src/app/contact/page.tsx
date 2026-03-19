import { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us | Reach The Ethical Trader Team',
  description: 'Have questions about our trading education or live terminal? Contact The Ethical Trader support or join our community on Telegram.',
};

export default function ContactPage() {
  return (
    <main className="pt-32 pb-20 px-6 lg:px-16 min-h-screen bg-void">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
        <div>
          <div className="flex items-center gap-3 text-[0.62rem] font-bold tracking-[0.3em] uppercase text-amber-lt mb-6 before:content-[''] before:block before:w-10 before:h-[1px] before:bg-amber">
            Connect
          </div>
          
          <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] text-ivory mb-10">
            Let's <em className="italic text-gold-mid">Start a Conversation</em>
          </h1>
          
          <p className="text-parchment leading-[1.8] text-[1.1rem] mb-12">
            Whether you have questions about the curriculum, need technical support for the terminal, or want to discuss a customized institutional license, our team is ready to assist.
          </p>
          
          <div className="space-y-10">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-lg bg-onyx border border-border-subtle flex items-center justify-center shrink-0">
                <span className="text-gold-light">✉</span>
              </div>
              <div>
                <h3 className="font-serif text-[1.2rem] text-ivory mb-1">Email Support</h3>
                <p className="text-stone text-[0.9rem]">{SITE_CONFIG.links.supportEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-lg bg-onyx border border-border-subtle flex items-center justify-center shrink-0">
                <span className="text-gold-light">◈</span>
              </div>
              <div>
                <h3 className="font-serif text-[1.2rem] text-ivory mb-1">Community Hub</h3>
                <p className="text-stone text-[0.9rem]">Join our official <a href={SITE_CONFIG.links.telegram} className="text-gold hover:underline decoration-gold/30 underline-offset-4">Telegram Channel</a> for instant updates and signals.</p>
              </div>
            </div>
          </div>
        </div>
        
        <ContactForm />
      </div>
    </main>
  );
}
