"use client";
import { useState, useEffect } from "react";

type Entry = {
  user: string;
  wagered: number;
  reward: number;
};

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000) % 24;
  const d = Math.floor(ms / (24 * 3600000));
  return `${d}d ${h}h ${m}m ${s}s`;
}

export default function Home() {
  const [data, setData] = useState<{ prizePool: number; endsAt: string; entries: Entry[] } | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setData(data));

    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-white p-8">Loading...</div>;

  const remaining = new Date(data.endsAt).getTime() - now;
  const top3 = data.entries.slice(0, 3);
  const rest = data.entries.slice(3, 10);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">${data.prizePool.toLocaleString()} USD Rainbet Leaderboard</h1>
      <p className="text-lg mb-6">Ends in: <span className="font-mono">{formatTime(remaining)}</span></p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {top3.map((e, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded text-center">
            <div className="text-2xl font-semibold">#{i + 1} {e.user}</div>
            <div className="text-sm text-gray-400">${e.wagered.toLocaleString()} wagered</div>
            <div className="mt-2 text-xl">Reward: ${e.reward}</div>
          </div>
        ))}
      </div>

      <table className="w-full max-w-3xl text-left border-separate border-spacing-y-2">
        <thead>
          <tr><th>#</th><th>User</th><th>Wagered</th><th>Reward</th></tr>
        </thead>
        <tbody>
          {rest.map((e, idx) => (
            <tr key={idx} className="bg-gray-800 rounded">
              <td className="px-4 py-2">#{idx + 4}</td>
              <td className="px-4 py-2">{e.user}</td>
              <td className="px-4 py-2">${e.wagered.toLocaleString()}</td>
              <td className="px-4 py-2">${e.reward}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
