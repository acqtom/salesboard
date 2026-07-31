const { redis } = require("./_lib/redis");
const { findUser } = require("./_lib/auth");

// POST { offer, password } -> { deals, closers, setters } for that account.
// Used both to load data on login and to poll for updates from other devices.
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { offer, password } = req.body || {};
  const user = findUser(offer, password);
  if (!user) {
    res.status(401).json({ error: "Incorrect offer or password." });
    return;
  }

  const key = user.offer.toLowerCase();
  try {
    const [deals, closers, setters] = await Promise.all([
      redis.get(`deals:${key}`),
      redis.get(`closers:${key}`),
      redis.get(`setters:${key}`)
    ]);
    res.status(200).json({
      deals: deals || [],
      closers: closers || [],
      setters: setters || []
    });
  } catch (err) {
    console.error("session load failed", err);
    res.status(500).json({ error: "Could not load data." });
  }
};
