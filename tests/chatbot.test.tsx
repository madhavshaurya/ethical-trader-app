import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ChatBot from '@/components/layout/ChatBot';

describe('ChatBot component accessibility', () => {
  it('renders floating open toggle button with accessibility attributes', () => {
    const html = renderToStaticMarkup(<ChatBot />);
    expect(html).toContain('aria-label="Open AI assistant"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="chat-dialog"');
    expect(html).toContain('aria-haspopup="dialog"');
  });
});
