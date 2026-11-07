# Grafana k6 Load Testing

Interactive load testing suite for the BookMyShow Fastify backend.

## How to Run

Execute the interactive runner:

```bash
pnpm bench
```

### Interactive Prompts
1. **Virtual Users (VUs)**: Number of concurrent virtual users (e.g. 50, 100, 500).
2. **Duration**: Test duration in seconds (e.g. 30, 60, 120).
3. **Endpoint**: Target specific API or test all endpoints with distributed traffic.

## Metrics & Thresholds
- **http_req_failed**: `< 1%` (Threshold fails if failure rate exceeds 1%)
- **http_req_duration (p95)**: `< 250ms` (95% of requests must complete under 250ms)
