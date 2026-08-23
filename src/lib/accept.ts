/**
 * RFC 9110 §12.5.1 Accept-header parsing and proactive content negotiation.
 *
 * Used by the proxy to decide whether a request wants HTML or Markdown for the same
 * URL, per the acceptmarkdown.com convention. Kept dependency-free so it can run in
 * the proxy without pulling anything into that bundle.
 */

export interface MediaRange {
  type: string;
  subtype: string;
  /** Quality factor, 0–1. A range with q=0 is explicitly *not* acceptable. */
  q: number;
  /**
   * How specific the range is: 2 for `type/subtype`, 1 for `type/*`, 0 for the
   * bare wildcard range.
   * RFC 9110 says the most specific matching range wins regardless of q ordering.
   */
  specificity: 0 | 1 | 2;
}

/** Clamp a parsed qvalue into the 0–1 range the grammar allows. */
function parseQ(raw: string | undefined): number {
  if (raw === undefined) return 1;
  const q = Number.parseFloat(raw);
  if (Number.isNaN(q)) return 1;
  return Math.min(1, Math.max(0, q));
}

/**
 * Parse an Accept header into media ranges.
 *
 * An absent or empty header means "anything is acceptable" (RFC 9110 §12.5.1), which
 * is represented here as a single wildcard range so callers need no special case.
 */
export function parseAccept(header: string | null | undefined): MediaRange[] {
  if (header === null || header === undefined || header.trim() === '') {
    return [{ type: '*', subtype: '*', q: 1, specificity: 0 }];
  }

  const ranges: MediaRange[] = [];

  for (const part of header.split(',')) {
    const segments = part.split(';');
    const media = segments[0].trim().toLowerCase();
    if (media === '') continue;

    const slash = media.indexOf('/');
    if (slash === -1) continue; // Not a media range — ignore rather than guess.

    const type = media.slice(0, slash);
    const subtype = media.slice(slash + 1);
    if (type === '' || subtype === '') continue;

    let q: string | undefined;
    for (const segment of segments.slice(1)) {
      const eq = segment.indexOf('=');
      if (eq === -1) continue;
      if (segment.slice(0, eq).trim().toLowerCase() === 'q') {
        q = segment.slice(eq + 1).trim();
        break;
      }
    }

    ranges.push({
      type,
      subtype,
      q: parseQ(q),
      specificity: type === '*' ? 0 : subtype === '*' ? 1 : 2,
    });
  }

  // A header that contained nothing parseable is treated as absent.
  if (ranges.length === 0) {
    return [{ type: '*', subtype: '*', q: 1, specificity: 0 }];
  }

  return ranges;
}

/** The quality the client assigned to `offer`, using the most specific matching range. */
export function qualityOf(offer: string, ranges: MediaRange[]): number {
  const slash = offer.indexOf('/');
  const type = offer.slice(0, slash).toLowerCase();
  const subtype = offer.slice(slash + 1).toLowerCase();

  let best: MediaRange | null = null;
  for (const range of ranges) {
    const matches =
      (range.type === '*' && range.subtype === '*') ||
      (range.type === type && range.subtype === '*') ||
      (range.type === type && range.subtype === subtype);
    if (!matches) continue;

    // Most specific range wins; among equally specific ranges, the highest q does.
    if (
      best === null ||
      range.specificity > best.specificity ||
      (range.specificity === best.specificity && range.q > best.q)
    ) {
      best = range;
    }
  }

  return best === null ? 0 : best.q;
}

/**
 * Pick the best representation to send.
 *
 * `offers` is in server-preference order, which breaks ties — so a client sending a
 * bare wildcard Accept gets the first offer (HTML) rather than an arbitrary one.
 * Returns `null` when the client accepts none of them, which the caller answers with
 * 406 per RFC 9110 §15.5.7.
 */
export function selectMediaType(
  header: string | null | undefined,
  offers: readonly string[]
): string | null {
  const ranges = parseAccept(header);

  let winner: string | null = null;
  let winningQ = 0;

  for (const offer of offers) {
    const q = qualityOf(offer, ranges);
    if (q > winningQ) {
      winner = offer;
      winningQ = q;
    }
  }

  return winner;
}
