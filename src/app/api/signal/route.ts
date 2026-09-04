import { NextResponse } from 'next/server';
import { ADX, BollingerBands, EMA, MACD, RSI } from 'trading-signals';
import { fetchCandles } from '@/lib/candles';

/**
 * Indicator-confluence signal engine.
 *
 * This is deterministic technical analysis, not machine learning, and it deliberately
 * does NOT emit a confidence percentage — there is no model behind it that could
 * justify one. It reports how many independent indicators currently agree on
 * direction, and every component is returned so the number can be audited.
 *
 * Indicators come from `trading-signals` (MIT, zero runtime dependencies).
 */

// Security: strict input validation regex for symbol parameters to prevent SSRF and injection
const ALLOWED_SYMBOL_REGEX = /^[A-Za-z0-9_\-=.]{1,20}$/;
const ALLOWED_INTERVALS = new Set(['1m', '5m', '15m', '1h', '4h', '1d']);

type Direction = 'bullish' | 'bearish' | 'neutral';

interface Component {
  name: string;
  reading: string;
  signal: Direction;
}

function direction(isBull: boolean, isBear: boolean): Direction {
  if (isBull) return 'bullish';
  if (isBear) return 'bearish';
  return 'neutral';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || 'XAUUSDT').toUpperCase();
  const interval = searchParams.get('interval') || '1h';

  if (!ALLOWED_SYMBOL_REGEX.test(symbol) || !ALLOWED_INTERVALS.has(interval)) {
    return NextResponse.json({ error: 'Invalid symbol or interval format' }, { status: 400 });
  }

  const candles = await fetchCandles(symbol, interval, 200);
  // ADX(14) needs the most history of the five; below ~60 bars the readings are not
  // stable enough to publish, so report "no signal" rather than a misleading one.
  if (!candles || candles.length < 60) {
    return NextResponse.json({ error: 'Not enough market data for a signal' }, { status: 503 });
  }

  const emaFast = new EMA(20);
  const emaSlow = new EMA(50);
  const rsi = new RSI(14);
  const macd = new MACD(new EMA(12), new EMA(26), new EMA(9));
  const adx = new ADX(14);
  const bb = new BollingerBands(20, 2);

  let emaFastVal = 0;
  let emaSlowVal = 0;
  let rsiVal: number | null = null;
  let macdVal: { histogram: number } | null = null;
  let adxVal: number | null = null;
  let bbVal: { lower: number; middle: number; upper: number } | null = null;

  for (const c of candles) {
    emaFastVal = emaFast.update(c.close, false);
    emaSlowVal = emaSlow.update(c.close, false);
    rsiVal = rsi.update(c.close, false);
    macdVal = macd.update(c.close, false);
    adxVal = adx.update({ high: c.high, low: c.low, close: c.close }, false);
    bbVal = bb.update(c.close, false);
  }

  const last = candles[candles.length - 1];
  const price = last.close;
  const pdi = typeof adx.pdi === 'number' ? adx.pdi : null;
  const mdi = typeof adx.mdi === 'number' ? adx.mdi : null;

  const components: Component[] = [];

  components.push({
    name: 'EMA 20/50 trend',
    reading: `${emaFastVal.toFixed(2)} vs ${emaSlowVal.toFixed(2)}`,
    signal: direction(emaFastVal > emaSlowVal, emaFastVal < emaSlowVal),
  });

  if (rsiVal !== null) {
    components.push({
      name: 'RSI 14',
      reading: rsiVal.toFixed(1),
      signal: direction(rsiVal > 55, rsiVal < 45),
    });
  }

  if (macdVal) {
    components.push({
      name: 'MACD histogram',
      reading: macdVal.histogram.toFixed(3),
      signal: direction(macdVal.histogram > 0, macdVal.histogram < 0),
    });
  }

  if (pdi !== null && mdi !== null) {
    components.push({
      name: 'Directional movement',
      reading: `+DI ${pdi.toFixed(1)} / -DI ${mdi.toFixed(1)}`,
      signal: direction(pdi > mdi, mdi > pdi),
    });
  }

  if (bbVal) {
    components.push({
      name: 'Bollinger midline',
      reading: `${price.toFixed(2)} vs ${bbVal.middle.toFixed(2)}`,
      signal: direction(price > bbVal.middle, price < bbVal.middle),
    });
  }

  const bullish = components.filter((c) => c.signal === 'bullish').length;
  const bearish = components.filter((c) => c.signal === 'bearish').length;

  let bias: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';
  let agree = Math.max(bullish, bearish);
  if (bullish > bearish) bias = 'LONG';
  else if (bearish > bullish) bias = 'SHORT';
  else agree = 0;

  // ADX measures trend strength, not direction. Below 20 the market is ranging and a
  // directional read from the other indicators is worth much less, so we surface it
  // alongside the bias rather than folding it into the count.
  let strength: 'strong' | 'moderate' | 'weak' = 'weak';
  if (adxVal !== null && adxVal >= 25) strength = 'strong';
  else if (adxVal !== null && adxVal >= 20) strength = 'moderate';

  return NextResponse.json({
    symbol,
    interval,
    price,
    bias,
    agree,
    total: components.length,
    strength,
    adx: adxVal !== null ? Number(adxVal.toFixed(1)) : null,
    components,
    asOf: last.time,
    method: 'indicator-confluence',
  });
}
