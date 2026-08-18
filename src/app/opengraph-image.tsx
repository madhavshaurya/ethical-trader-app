import { ImageResponse } from 'next/og';

/**
 * Social preview card, generated at build time.
 *
 * The site previously pointed og:image at /og-image.webp, which does not exist in
 * public/ — so every share on WhatsApp, Telegram, X, LinkedIn and Slack rendered
 * with no preview. Generating it here means it can never fall out of sync with the
 * repo, and Next wires the og:image / twitter:image tags automatically.
 *
 * Note: ImageResponse renders via Satori, which supports a subset of CSS. Every
 * element with more than one child needs an explicit `display: flex`.
 */

export const alt = 'TheEthicalTrader — Master the Markets';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#040305',
          backgroundImage:
            'radial-gradient(circle at 78% 12%, rgba(201,149,42,0.20) 0%, rgba(4,3,5,0) 55%)',
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Gold hairline crown, echoing the site's section rules */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '4px',
            background: 'linear-gradient(90deg, #040305 0%, #C9952A 45%, #B8621A 65%, #040305 100%)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 22,
              letterSpacing: 10,
              textTransform: 'uppercase',
              color: '#F09048',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            Ethical · Transparent · Disciplined
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 92, color: '#F2EAD8', lineHeight: 1.05 }}>
            Trade Like Institutions
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 92,
              color: '#E2AE3C',
              fontStyle: 'italic',
              lineHeight: 1.05,
            }}
          >
            Think
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 27,
              color: '#A89880',
              fontFamily: 'Helvetica, Arial, sans-serif',
              maxWidth: 880,
              lineHeight: 1.45,
            }}
          >
            ICT &amp; Smart Money Concepts, live order flow and institutional-grade market tools.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(201,149,42,0.28)',
            paddingTop: 26,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 34, color: '#F5CC6A' }}>TheEthicalTrader</div>
            <div
              style={{
                display: 'flex',
                fontSize: 17,
                letterSpacing: 5,
                textTransform: 'uppercase',
                color: '#6A5A48',
                fontFamily: 'Helvetica, Arial, sans-serif',
                marginTop: 6,
              }}
            >
              Trade with Integrity
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              color: '#A89880',
              fontFamily: 'Helvetica, Arial, sans-serif',
              letterSpacing: 2,
            }}
          >
            theethicaltrader.in
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
