import { NextResponse } from "next/server";
import axios from "axios";
import { writeFileSync } from "fs";
import path from "path";

const API_KEY = "HTh0wMsKcCNHx4fLcIyZpbuHACYJGSiT";
const API_URL = "https://services.rainbet.com/v1/external/affiliates";

function getToday(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET() {
  try {
    const date = getToday();
    const url = `${API_URL}?start_at=${date}&end_at=${date}&key=${API_KEY}`;
    const { data } = await axios.get(url);

    const entries = data.affiliates
      .filter((a: any) => parseFloat(a.wagered_amount) > 0)
      .sort((a: any, b: any) => parseFloat(b.wagered_amount) - parseFloat(a.wagered_amount))
      .map((a: any) => ({
        user: a.username,
        wagered: parseFloat(a.wagered_amount),
        reward: 0
      }));

    const output = {
      prizePool: 1000,
      endsAt: "2025-08-15T00:00:00Z",
      entries
    };

    const filePath = path.join(process.cwd(), "public", "data.json");
    writeFileSync(filePath, JSON.stringify(output, null, 2));
    return NextResponse.json({ status: "✅ Leaderboard updated." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
