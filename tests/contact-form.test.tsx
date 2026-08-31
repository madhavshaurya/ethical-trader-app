import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ContactForm from '@/components/contact/ContactForm';

describe('ContactForm component accessibility', () => {
  it('renders inputs with associated labels via htmlFor and id attributes', () => {
    const html = renderToStaticMarkup(<ContactForm />);
    expect(html).toContain('for="first_name"');
    expect(html).toContain('id="first_name"');
    expect(html).toContain('for="last_name"');
    expect(html).toContain('id="last_name"');
    expect(html).toContain('for="email"');
    expect(html).toContain('id="email"');
    expect(html).toContain('for="message"');
    expect(html).toContain('id="message"');
  });

  it('renders submit button with type="submit"', () => {
    const html = renderToStaticMarkup(<ContactForm />);
    expect(html).toContain('type="submit"');
    expect(html).toContain('Send Message');
  });
});
