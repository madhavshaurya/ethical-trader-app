import * as React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'ghostPlan';
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', asChild = false, href, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center transition-all relative overflow-hidden";
    
    // Different variants mapping to the original CSS classes
    const variants = {
      primary: "px-10 py-4 bg-gradient-primary text-[#060400] font-serif text-[1.05rem] font-bold rounded-[3px] tracking-[0.02em] hover:shadow-[0_10px_50px_rgba(201,149,42,0.35)] hover:-translate-y-[2px]",
      secondary: "px-8 py-[15px] border border-border-mid bg-transparent text-ivory font-sans text-[0.85rem] font-medium rounded-[3px] hover:border-gold hover:text-gold-light",
      ghost: "px-5 py-2 border border-border-mid rounded-[3px] bg-transparent text-parchment font-sans text-[0.74rem] font-medium hover:border-gold hover:text-gold-light",
      gold: "w-full p-[13px] bg-gradient-gold text-[#050300] font-sans text-[0.8rem] font-bold tracking-[0.05em] uppercase rounded-[4px] hover:shadow-[0_5px_30px_rgba(201,149,42,0.35)] hover:-translate-y-[1px]",
      ghostPlan: "w-full p-[13px] border border-border-mid bg-transparent text-parchment font-sans text-[0.8rem] font-medium tracking-[0.05em] uppercase rounded-[4px] hover:border-gold hover:text-gold-light"
    };

    const classes = cn(baseStyles, variants[variant], className);

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
          {variant === 'primary' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.15)] to-transparent -translate-x-[100%] hover:translate-x-[100%] transition-transform duration-[600ms]" />
          )}
        </Link>
      );
    }

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.15)] to-transparent -translate-x-[100%] hover:translate-x-[100%] transition-transform duration-[600ms]" />
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
