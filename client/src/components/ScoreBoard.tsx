interface ScoreBoardProps {
  score: number;
  total: number;
  currentIndex: number;
}

export function ScoreBoard({ score, total, currentIndex }: ScoreBoardProps) {
  const done = Math.min(currentIndex, total);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="w-full rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-lg font-extrabold text-slate-900">Score</div>
        <div className="text-2xl font-extrabold text-slate-900">{score}</div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-sm font-bold text-slate-700">
          <span>{done} / {total}</span>
          <span>{pct}%</span>
        </div>
        <div className="mt-2 h-4 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
