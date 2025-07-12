const fs = require("fs");
const axios = require("axios");
const path = require("path");

const API_KEY = "HTh0wMsKcCNHx4fLcIyZpbuHACYJGSiT";
const API_URL = "https://services.rainbet.com/v1/external/affiliates";

const getToday = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const fetchLeaderboard = async () => {
  const date = getToday();
  const url = `${API_URL}?start_at=${date}&end_at=${date}&key=${API_KEY}`;

  try {
    const { data } = await axios.get(url);

    const entries = data.affiliates
      .filter(a => parseFloat(a.wagered_amount) > 0)
      .sort((a, b) => parseFloat(b.wagered_amount) - parseFloat(a.wagered_amount))
      .map(a => ({
        user: a.username,
        wagered: parseFloat(a.wagered_amount),
        reward: 0 // You can assign real prizes later
      }));

    const output = {
      prizePool: 1000,
      endsAt: "2025-08-15T00:00:00Z",
      entries
    };

    fs.writeFileSync(path.join(__dirname, "../public/data.json"), JSON.stringify(output, null, 2));
    console.log("✅ Leaderboard data written to public/data.json");
  } catch (err) {
    console.error("❌ Error fetching Rainbet data:", err.message);
  }
};

fetchLeaderboard();
