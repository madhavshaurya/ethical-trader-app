/**
 * Site-wide Organization + WebSite JSON-LD.
 *
 * Lives in lib rather than inline in the root layout so it can be asserted on in
 * tests — this is the markup AI assistants and search engines read to verify who
 * operates the site and how to contact them.
 *
 * Pricing is deliberately absent. Offer markup asserts a machine-readable price and
 * availability that Google can surface as a rich result and hold to account, so prices
 * stay on the pricing section where they are managed.
 */

import { SITE_NAME, SITE_URL, absoluteUrl } from './site';
import { SITE_CONFIG, ORGANIZATION } from './constants';

/**
 * PostalAddress carrying only fields that are actually known. Street, locality,
 * region and postal code are blank in ORGANIZATION until the registered business
 * address is filled in, and a blank field is omitted rather than published empty.
 */
export function buildPostalAddress() {
  return {
    '@type': 'PostalAddress',
    addressCountry: ORGANIZATION.addressCountry,
    ...(ORGANIZATION.streetAddress ? { streetAddress: ORGANIZATION.streetAddress } : {}),
    ...(ORGANIZATION.addressLocality ? { addressLocality: ORGANIZATION.addressLocality } : {}),
    ...(ORGANIZATION.addressRegion ? { addressRegion: ORGANIZATION.addressRegion } : {}),
    ...(ORGANIZATION.postalCode ? { postalCode: ORGANIZATION.postalCode } : {}),
  };
}

export function buildSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: ORGANIZATION.legalName,
        url: SITE_URL,
        description:
          'Trading education and market intelligence covering ICT, Smart Money Concepts and order flow.',
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/icon.png'),
        },
        sameAs: [SITE_CONFIG.links.telegram],
        email: ORGANIZATION.email,
        address: buildPostalAddress(),
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: ORGANIZATION.contactType,
          email: ORGANIZATION.email,
          url: absoluteUrl('/contact'),
          availableLanguage: [...ORGANIZATION.availableLanguage],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en-IN',
      },
    ],
  };
}
