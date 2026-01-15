import { Link } from "wouter";

interface GameOverDialogProps {
  open: boolean;
  score: number;
  total: number;
  familyLabel: string;
  onPlayAgain: () => void;
}

function badgeForFamily(familyLabel: string) {
  const f = familyLabel.toLowerCase();
  if (f.includes("wood")) return { emoji: "🪈", title: "Woodwinds Star!" };
  if (f.includes("brass")) return { emoji: "🎺", title: "Brass Hero!" };
  if (f.includes("string")) return { emoji: "🎻", title: "Strings Superstar!" };
  if (f.includes("percussion")) return { emoji: "🥁", title: "Percussion Pro!" };
  return { emoji: "🌟", title: "Music Master!" };
}

export function GameOverDialog({ open, score, total, familyLabel, onPlayAgain }: GameOverDialogProps) {
  if (!open) return null;
  const badge = badgeForFamily(familyLabel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl border border-slate-200 text-center">
        <div className="text-6xl" aria-hidden="true">{badge.emoji}</div>
        <div className="mt-2 text-3xl font-extrabold text-slate-900">{badge.title}</div>
        <div className="mt-2 text-lg font-bold text-slate-700">
          You scored {score} out of {total}!
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            className="rounded-2xl bg-slate-900 text-white px-6 py-4 text-lg font-extrabold active:scale-[0.99]"
            onClick={onPlayAgain}
          >
            Play Again
          </button>

          <Link href="/">
            <a className="rounded-2xl bg-slate-100 text-slate-900 px-6 py-4 text-lg font-extrabold">
              Choose Another Family
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
