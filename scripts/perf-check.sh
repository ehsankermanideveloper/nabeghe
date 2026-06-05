#!/bin/bash
# Usage: bash scripts/perf-check.sh [container_id_or_name] [base_url]
# Example: bash scripts/perf-check.sh nabeghe-app-1 http://localhost:3000

CONTAINER="${1:-}"
BASE_URL="${2:-http://localhost:3000}"

# ── 1. Worker processes ────────────────────────────────────────
echo "════════════════════════════════════════"
echo "  Worker Processes"
echo "════════════════════════════════════════"

if [ -n "$CONTAINER" ]; then
  echo "Node processes inside container:"
  docker exec "$CONTAINER" ps aux | grep "node dist" | grep -v grep | \
    awk '{printf "  PID=%-6s CPU=%-5s MEM=%-5s CMD=%s\n", $2, $3, $4, $11}'
  WORKER_COUNT=$(docker exec "$CONTAINER" ps aux | grep "node dist" | grep -v grep | wc -l)
  echo ""
  echo "  → Total node processes: $WORKER_COUNT (1 primary + $((WORKER_COUNT-1)) workers)"
else
  echo "  [skip] No container name given — pass it as first arg"
fi

# ── 2. Basic connectivity ──────────────────────────────────────
echo ""
echo "════════════════════════════════════════"
echo "  Connectivity Check"
echo "════════════════════════════════════════"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$BASE_URL")
TTFB=$(curl -s -o /dev/null -w "%{time_starttransfer}" --max-time 5 "$BASE_URL")
echo "  Status: $HTTP_CODE"
echo "  TTFB  : ${TTFB}s"

# ── 3. Load test ───────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════"
echo "  Load Test  (10s · 50 concurrent)"
echo "════════════════════════════════════════"

if command -v wrk &>/dev/null; then
  wrk -t4 -c50 -d10s --latency "$BASE_URL"

elif command -v ab &>/dev/null; then
  ab -n 1000 -c 50 -q "$BASE_URL/" 2>&1 | grep -E \
    "Requests per second|Time per request|Failed|Complete|50%|95%|99%"

else
  echo "  [running curl-based parallel test — install wrk for better results]"
  echo ""
  START=$(date +%s%N)
  TOTAL=200
  CONC=50
  SUCCESS=0
  FAIL=0

  run_request() {
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$BASE_URL")
    echo "$CODE"
  }
  export -f run_request
  export BASE_URL

  RESULTS=$(seq $TOTAL | xargs -P$CONC -I{} bash -c 'run_request')
  END=$(date +%s%N)

  SUCCESS=$(echo "$RESULTS" | grep -c "^2")
  FAIL=$((TOTAL - SUCCESS))
  ELAPSED=$(( (END - START) / 1000000 ))
  RPS=$(( TOTAL * 1000 / ELAPSED ))

  echo "  Requests : $TOTAL"
  echo "  Concurrency: $CONC"
  echo "  Success  : $SUCCESS"
  echo "  Failed   : $FAIL"
  echo "  Time     : ${ELAPSED}ms"
  echo "  RPS      : ~${RPS} req/s"
fi

# ── 4. Container resource usage ────────────────────────────────
if [ -n "$CONTAINER" ]; then
  echo ""
  echo "════════════════════════════════════════"
  echo "  Container Resource Usage"
  echo "════════════════════════════════════════"
  docker stats "$CONTAINER" --no-stream --format \
    "  CPU:  {{.CPUPerc}}\n  MEM:  {{.MemUsage}}\n  NET:  {{.NetIO}}\n  BLOCK:{{.BlockIO}}"
fi

echo ""
echo "════════════════════════════════════════"
echo "  Done"
echo "════════════════════════════════════════"
