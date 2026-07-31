const { redis } = require("./_lib/redis");
const { findUser } = require("./_lib/auth");

// POST { offer, password, deals?, closers?, setters? } -> writes whichever
// of deals/closers/setters are present for that account. saveDeals() sends
// `deals`; saveNames() sends `closers`+`setters`.
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { offer, password, deals, closers, setters } = req.body || {};
  const user = findUser(offer, password);
  if (!user) {
    res.status(401).json({ error: "Incorrect offer or password." });
    return;
  }

  const key = user.offer.toLowerCase();
  const writes = [];
  if (deals !== undefined) writes.push(redis.set(`deals:${key}`, deals));
  if (closers !== undefined) writes.push(redis.set(`closers:${key}`, closers));
  if (setters !== undefined) writes.push(redis.set(`setters:${key}`, setters));

  try {
    await Promise.all(writes);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("save failed", err);
    res.status(500).json({ error: "Could not save data." });
  }
};
