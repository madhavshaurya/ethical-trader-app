#!/bin/bash
# Verifies the site's ticker numbers against independently derived ground truth.
#
# NOTE: deliberately does NOT use Yahoo's meta.chartPreviousClose — that field is the
# close before the requested range, not the previous session, so comparing against it
# would just re-confirm the bug it caused. Previous close is derived from dated daily bars.
#
# Usage: ./verify-ticker.sh [port]     (start the app first, e.g. `npm run dev`)
PORT="${1:-3000}"
MINE=$(curl -s "http://localhost:$PORT/api/indices")
SPOT=$(curl -s "http://localhost:$PORT/api/spot")

python3 - "$MINE" "$SPOT" <<'PY'
import sys, json, subprocess

def curl(u):
    return json.loads(subprocess.run(
        ['curl','-s','-H','User-Agent: Mozilla/5.0',u], capture_output=True, text=True).stdout)

def truth(ysym):
    d = curl(f'https://query2.finance.yahoo.com/v8/finance/chart/{ysym}?interval=1d&range=1mo')
    r = d['chart']['result'][0]; m = r['meta']
    closes = r['indicators']['quote'][0]['close']
    bars = [(t,c) for t,c in zip(r['timestamp'], closes) if c is not None]
    start = (m.get('currentTradingPeriod') or {}).get('regular',{}).get('start')
    older = [c for t,c in bars if start is not None and t < start]
    prev = older[-1] if older else (bars[-2][1] if len(bars)>1 else None)
    p = m['regularMarketPrice']
    return p, (p-prev)/prev*100

mine = {d['symbol']: float(d['priceChangePercent']) for d in json.loads(sys.argv[1])}
mine.update({d['symbol']: float(d['priceChangePercent']) for d in json.loads(sys.argv[2])})

PAIRS = [('NIFTY 50','%5ENSEI'), ('SENSEX','%5EBSESN'), ('ES1!','ES%3DF'),
         ('NQ1!','NQ%3DF'), ('DXY','DX-Y.NYB'), ('BTCUSDT','BTC-USD')]

print(f"{'TICKER':10} {'YOUR SITE':>10} {'GROUND TRUTH':>13}   VERDICT")
bad = 0
for disp, ysym in PAIRS:
    a = mine.get(disp)
    if a is None:
        print(f"{disp:10} {'—':>10} {'—':>13}   MISSING"); bad += 1; continue
    _, b = truth(ysym)
    ok = abs(a-b) < 0.15          # tolerance for movement between the two calls
    if not ok: bad += 1
    print(f"{disp:10} {a:>+9.2f}% {b:>+12.2f}%   {'OK' if ok else 'MISMATCH'}")
print("\nAll good." if not bad else f"\n{bad} problem(s).")
PY
