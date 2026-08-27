import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Header from '@/components/layout/Header';
import ChatBot from '@/components/layout/ChatBot';

describe('layout component accessibility', () => {
  it('Header component renders accessible toggle and close buttons', () => {
    const html = renderToStaticMarkup(<Header />);
    expect(html).toContain('aria-label="Toggle navigation menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-label="Close navigation menu"');
  });

  it('ChatBot component renders accessible trigger button', () => {
    const html = renderToStaticMarkup(<ChatBot />);
    expect(html).toContain('aria-label="Open AI Trader Assistant"');
    expect(html).toContain('aria-expanded="false"');
  });
});
