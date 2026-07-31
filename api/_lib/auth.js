// Same two accounts/passwords the app has always used — moved server-side
// now that /api is a real network surface instead of a local-only gate.
const USERS = [
  { offer: "Alex", password: "Alex123" },
  { offer: "Adriel", password: "Adriel123" }
];

function findUser(offer, password) {
  if (typeof offer !== "string" || typeof password !== "string") return null;
  return (
    USERS.find(
      u => u.offer.toLowerCase() === offer.trim().toLowerCase() && u.password === password
    ) || null
  );
}

module.exports = { findUser };
