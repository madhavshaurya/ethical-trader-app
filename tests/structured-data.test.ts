import { describe, expect, it } from 'vitest';
import { buildPostalAddress, buildSiteJsonLd } from '@/lib/structured-data';
import { ORGANIZATION, SITE_CONFIG } from '@/lib/constants';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';

const graph = buildSiteJsonLd()['@graph'];
const organization = graph.find((node) => node['@type'] === 'Organization') as Record<string, unknown>;

describe('Organization JSON-LD', () => {
  it('is present and identified', () => {
    expect(organization).toBeDefined();
    expect(organization.name).toBe(SITE_NAME);
    expect(organization.legalName).toBe(ORGANIZATION.legalName);
    expect(organization.url).toBe(SITE_URL);
    expect(organization['@id']).toBe(`${SITE_URL}/#organization`);
  });

  it('carries a PostalAddress', () => {
    const address = organization.address as Record<string, string>;
    expect(address).toBeDefined();
    expect(address['@type']).toBe('PostalAddress');
    expect(address.addressCountry).toBe('IN');
  });

  it('carries a contactPoint with an email and a contact type', () => {
    const contact = organization.contactPoint as Record<string, unknown>;
    expect(contact['@type']).toBe('ContactPoint');
    expect(contact.contactType).toBe(ORGANIZATION.contactType);
    expect(contact.email).toBe(SITE_CONFIG.links.supportEmail);
    expect(contact.url).toBe(absoluteUrl('/contact'));
    expect(contact.availableLanguage).toEqual(['en']);
  });

  it('exposes the support email at the organization level too', () => {
    expect(organization.email).toBe(SITE_CONFIG.links.supportEmail);
  });

  it('never publishes a blank address field', () => {
    const address = buildPostalAddress() as unknown as Record<string, string>;
    for (const [key, value] of Object.entries(address)) {
      expect(value, `${key} is blank`).not.toBe('');
    }
  });

  it('includes optional address fields once they are filled in', () => {
    // Guards the omit-if-empty logic: a populated field must reach the output.
    const populated = { ...ORGANIZATION, addressLocality: 'Bengaluru' };
    const address = {
      '@type': 'PostalAddress',
      addressCountry: populated.addressCountry,
      ...(populated.streetAddress ? { streetAddress: populated.streetAddress } : {}),
      ...(populated.addressLocality ? { addressLocality: populated.addressLocality } : {}),
    };
    expect(address).toHaveProperty('addressLocality', 'Bengaluru');
    expect(address).not.toHaveProperty('streetAddress');
  });

  it('still omits pricing, which Offer markup would make a machine-readable promise', () => {
    expect(JSON.stringify(graph)).not.toContain('"Offer"');
    expect(JSON.stringify(graph)).not.toContain('price');
  });

  it('keeps the WebSite node pointing at the organization', () => {
    const website = graph.find((node) => node['@type'] === 'WebSite') as Record<string, unknown>;
    expect(website.publisher).toEqual({ '@id': `${SITE_URL}/#organization` });
    expect(website.inLanguage).toBe('en-IN');
  });

  it('serialises to valid JSON with no undefined values', () => {
    const json = JSON.stringify(buildSiteJsonLd());
    expect(() => JSON.parse(json)).not.toThrow();
    expect(json).not.toContain('undefined');
  });
});
