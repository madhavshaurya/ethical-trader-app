'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    // Web3Forms Key from Environment Variable
    data.access_key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-onyx border border-border-subtle rounded-2xl p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-[200px] h-[200px] bg-gold/5 blur-[80px] rounded-full pointer-events-none" />
      
      {submitStatus === 'success' ? (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 relative z-10 animate-[fade-up_0.5s_ease_forwards]">
          <div className="w-20 h-20 rounded-full bg-bull/10 border border-bull/30 flex items-center justify-center">
            <span className="text-bull text-3xl">✓</span>
          </div>
          <h3 className="font-serif text-[1.8rem] text-ivory">Message Sent</h3>
          <p className="text-parchment leading-relaxed max-w-[300px]">
            Thank you for reaching out. We'll get back to you within 24-48 hours.
          </p>
          <button 
            onClick={() => setSubmitStatus('idle')}
            className="text-gold hover:text-gold-light font-bold text-[0.7rem] uppercase tracking-widest transition-colors"
            type="button"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[0.65rem] uppercase tracking-widest text-stone mb-2">First Name</label>
              <input 
                name="first_name" 
                type="text" 
                required 
                autoComplete="given-name"
                className="w-full bg-void border border-border-subtle/50 rounded-md px-4 py-3 text-[0.9rem] text-ivory outline-none focus:border-gold/50 transition-colors" 
                placeholder="John" 
              />
            </div>
            <div>
              <label className="block text-[0.65rem] uppercase tracking-widest text-stone mb-2">Last Name</label>
              <input 
                name="last_name" 
                type="text" 
                required 
                autoComplete="family-name"
                className="w-full bg-void border border-border-subtle/50 rounded-md px-4 py-3 text-[0.9rem] text-ivory outline-none focus:border-gold/50 transition-colors" 
                placeholder="Doe" 
              />
            </div>
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase tracking-widest text-stone mb-2">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              autoComplete="email"
              className="w-full bg-void border border-border-subtle/50 rounded-md px-4 py-3 text-[0.9rem] text-ivory outline-none focus:border-gold/50 transition-colors" 
              placeholder="email@example.com" 
            />
          </div>
          <div>
            <label className="block text-[0.65rem] uppercase tracking-widest text-stone mb-2">How can we help?</label>
            <textarea 
              name="message" 
              rows={4} 
              required 
              className="w-full bg-void border border-border-subtle/50 rounded-md px-4 py-3 text-[0.9rem] text-ivory outline-none focus:border-gold/50 transition-colors resize-none" 
              placeholder="Your message..."
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gold hover:bg-gold-light text-void font-bold text-[0.75rem] uppercase tracking-[0.1em] py-4 rounded-md transition-all hover:shadow-[0_4px_20px_rgba(201,149,42,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {submitStatus === 'error' && (
            <p className="text-bear text-[0.7rem] text-center mt-2 animate-pulse">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
