import type { Instrument } from "@/data/instruments";

interface InstrumentCardProps {
  instrument: Instrument;
}

export function InstrumentCard({ instrument }: InstrumentCardProps) {
  return (
    <div className="w-full rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-slate-600">{instrument.family}</div>
        <div className="text-2xl" aria-hidden="true">{instrument.emoji}</div>
      </div>

      <div className="mt-4 rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden">
        <img
          src={instrument.image}
          alt={instrument.name}
          className="w-full h-[260px] md:h-[320px] object-contain p-4"
          loading="eager"
        />
      </div>

      <div className="mt-4 text-center">
        <div className="text-2xl md:text-3xl font-extrabold text-slate-900">
          What instrument is this?
        </div>
      </div>
    </div>
  );
}
