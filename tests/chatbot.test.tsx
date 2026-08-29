import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ChatBot from '@/components/layout/ChatBot';

describe('ChatBot component accessibility', () => {
  it('renders floating toggle button with accessible aria-label', () => {
    const html = renderToStaticMarkup(<ChatBot />);
    expect(html).toContain('aria-label="Open AI assistant chat"');
  });
});
