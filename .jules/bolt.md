## 2026-06-26 - Optimized Simulation API Caching
**Learning:** In-memory caching of large parsed JSON files (6.5MB+) in the API layer provides massive performance gains (~90% reduction in response time). Internal loopback `fetch` calls in Next.js API routes are significantly slower than direct asynchronous `fs.readFile` calls.
**Action:** Always prefer direct `fs/promises` for local file access and implement memoization/caching for expensive parsing operations.
