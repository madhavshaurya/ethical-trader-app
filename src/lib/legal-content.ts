/**
 * Structure and prose for the two legal pages.
 *
 * The HTML pages and the Markdown representations served by the proxy both read from
 * here, so a section can never exist in one and be missing from the other. Terms keeps
 * its prose in JSX (it carries inline links and emphasis the Markdown mirrors
 * separately); only its section list lives here, and a test asserts every section has
 * a matching Markdown block.
 */

export const TERMS_LAST_UPDATED = '19 August 2026';

export interface TermsSection {
  id: string;
  /** Display number shown on the page and in the contents list. */
  n: string;
  title: string;
}

export const TERMS_SECTIONS: TermsSection[] = [
  { id: 'acceptance', n: '01', title: 'Acceptance of These Terms' },
  { id: 'what-we-are', n: '02', title: 'What This Service Is — and Is Not' },
  { id: 'regulatory', n: '03', title: 'Regulatory Status' },
  { id: 'risk', n: '04', title: 'Risk Disclosure' },
  { id: 'eligibility', n: '05', title: 'Eligibility' },
  { id: 'subscriptions', n: '06', title: 'Subscriptions and Payment' },
  { id: 'managed-accounts', n: '07', title: 'Account Handling Management' },
  { id: 'market-data', n: '08', title: 'Market Data and Third-Party Sources' },
  { id: 'ai', n: '09', title: 'AI Assistant and Signal Engine' },
  { id: 'acceptable-use', n: '10', title: 'Acceptable Use' },
  { id: 'ip', n: '11', title: 'Intellectual Property' },
  { id: 'liability', n: '12', title: 'Limitation of Liability' },
  { id: 'indemnity', n: '13', title: 'Indemnity' },
  { id: 'termination', n: '14', title: 'Termination' },
  { id: 'changes', n: '15', title: 'Changes to These Terms' },
  { id: 'law', n: '16', title: 'Governing Law and Jurisdiction' },
  { id: 'contact', n: '17', title: 'Contact' },
];

export const PRIVACY_LAST_UPDATED = 'March 19, 2026';

export interface PrivacySection {
  /** Numbered heading exactly as it renders on the page, e.g. "1. Introduction". */
  heading: string;
  body: string;
}

/**
 * Privacy is short, plain prose with no inline markup, so the page renders straight
 * from this array and the Markdown is generated from the same source — no duplication
 * and nothing to keep in sync by hand.
 */
export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    heading: '1. Introduction',
    body:
      'Welcome to The Ethical Trader. We value your privacy and the protection of your personal data. This policy outlines how we handle information obtained through our website and services.',
  },
  {
    heading: '2. Information Collection',
    body:
      'We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, and payment information.',
  },
  {
    heading: '3. Use of Data',
    body:
      'Your data is used to provide and maintain our services, notify you about changes, and provide customer support. We do not sell your personal data to third parties.',
  },
  {
    heading: '4. Security',
    body:
      'The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. We strive to use commercially acceptable means to protect your personal data.',
  },
];
