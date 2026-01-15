import { Link } from "wouter";
import { FAMILIES } from "@/data/instruments";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 text-center">
          Instrument Game
        </h1>
        <p className="mt-3 text-lg md:text-xl text-slate-700 text-center">
          Look. Listen. Say the instrument name!
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAMILIES.map((f) => (
            <Link key={f.key} href={`/game/${f.key}`}>
              <a className="block rounded-3xl border-2 border-slate-200 bg-white shadow-sm hover:shadow-md active:scale-[0.99] transition px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl" aria-hidden="true">{f.emoji}</div>
                  <div className="flex-1">
                    <div className="text-2xl font-extrabold text-slate-900">{f.label}</div>
                    <div className="mt-1 text-base text-slate-700">{f.blurb}</div>
                  </div>
                  <div className="text-3xl text-slate-400" aria-hidden="true">›</div>
                </div>
              </a>
            </Link>
          ))}

          <Link href={`/game/all`}>
            <a className="block rounded-3xl border-2 border-slate-200 bg-slate-900 text-white shadow-sm hover:shadow-md active:scale-[0.99] transition px-6 py-6 md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="text-5xl" aria-hidden="true">🌟</div>
                <div className="flex-1">
                  <div className="text-2xl font-extrabold">All Instruments</div>
                  <div className="mt-1 text-base text-white/90">A mixed round from every family</div>
                </div>
                <div className="text-3xl text-white/70" aria-hidden="true">›</div>
              </div>
            </a>
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-500 text-center">
          Tip: If it doesn’t understand after 2 tries, you can tap to choose the name.
        </p>
      </div>
    </div>
  );
}
