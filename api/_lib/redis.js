const { Redis } = require("@upstash/redis");

// Vercel's Upstash integration has shipped env vars under two different
// naming conventions over time — accept either so this doesn't silently
// break depending on how the store was connected.
const url =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  throw new Error(
    "Missing Upstash Redis env vars. Expected UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN " +
      "or KV_REST_API_URL/KV_REST_API_TOKEN to be set in the Vercel project."
  );
}

const redis = new Redis({ url, token });

module.exports = { redis };
