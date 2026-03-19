import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Ethical Trader Data Protection',
  description: 'Understand how The Ethical Trader collects, uses, and protects your information. Our commitment to privacy and data integrity.',
};

export default function PrivacyPage() {
  return (
    <main className="pt-32 pb-20 px-6 lg:px-16 min-h-screen bg-void">
      <div className="max-w-[800px] mx-auto text-parchment leading-[1.8]">
        <h1 className="font-serif text-[clamp(2.5rem,5vw,3.5rem)] font-light leading-[1.1] text-ivory mb-12">
          Privacy Policy
        </h1>
        
        <div className="space-y-10 text-[0.95rem]">
          <section>
            <h2 className="text-ivory font-bold text-[1.1rem] mb-4 uppercase tracking-widest">1. Introduction</h2>
            <p>
              Welcome to The Ethical Trader. We value your privacy and the protection of your personal data. This policy outlines how we handle information obtained through our website and services.
            </p>
          </section>
          
          <section>
            <h2 className="text-ivory font-bold text-[1.1rem] mb-4 uppercase tracking-widest">2. Information Collection</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, and payment information.
            </p>
          </section>
          
          <section>
            <h2 className="text-ivory font-bold text-[1.1rem] mb-4 uppercase tracking-widest">3. Use of Data</h2>
            <p>
              Your data is used to provide and maintain our services, notify you about changes, and provide customer support. We do not sell your personal data to third parties.
            </p>
          </section>
          
          <section>
            <h2 className="text-ivory font-bold text-[1.1rem] mb-4 uppercase tracking-widest">4. Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. We strive to use commercially acceptable means to protect your personal data.
            </p>
          </section>
          
          <div className="pt-10 border-t border-border-subtle mt-16">
            <p className="text-stone italic text-[0.8rem]">
              Last Updated: March 19, 2026. For questions regarding this policy, please contact support@theethicaltrader.com.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
