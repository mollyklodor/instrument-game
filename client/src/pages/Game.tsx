import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useRoute } from "wouter";
import confetti from "canvas-confetti";

import { familyFromParam, getInstrumentsForFamily, type Instrument, type InstrumentFamily } from "@/data/instruments";
import { InstrumentCard } from "@/components/InstrumentCard";
import { MicButton } from "@/components/MicButton";
import { ScoreBoard } from "@/components/ScoreBoard";
import { GameOverDialog } from "@/components/GameOverDialog";

type Phase = "playing" | "choose" | "gameOver";

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function playTone(freq: number, durationMs: number) {
  try {
    const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, durationMs);
  } catch {
    // ignore
  }
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRound(all: Instrument[], count: number) {
  return shuffle(all).slice(0, Math.min(count, all.length));
}

export default function Game() {
  const [, params] = useRoute("/game/:family");
  const familyParam = params?.family;

  const family = familyFromParam(familyParam);
  const familyLabel = family === "All" ? "All Instruments" : family;

  const allForFamily = useMemo(() => getInstrumentsForFamily(family === "All" ? "All" : (family as InstrumentFamily)), [family]);
  const round = useMemo(() => pickRound(allForFamily, 10), [allForFamily]);

  // preload images (Idea #6)
  useEffect(() => {
    round.forEach((inst) => {
      const img = new Image();
      img.src = inst.image;
    });
  }, [round]);

  const [phase, setPhase] = useState<Phase>("playing");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);

  const transcriptRef = useRef<string>("");
  const recognitionRef = useRef<any>(null);
  const stopTimerRef = useRef<number | null>(null);
  const retryTimerRef = useRef<number | null>(null);

  const current = round[index];

  const isSupported = useMemo(() => {
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }, []);

  function clearTimers() {
    if (stopTimerRef.current) window.clearTimeout(stopTimerRef.current);
    if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current);
    stopTimerRef.current = null;
    retryTimerRef.current = null;
  }

  function ensureRecognition() {
    if (recognitionRef.current) return recognitionRef.current;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;

    rec.onresult = (e: any) => {
      const text = e?.results?.[0]?.[0]?.transcript ?? "";
      transcriptRef.current = text;
      handleTranscript(text);
    };
    rec.onerror = () => {
      setIsListening(false);
    };
    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    return rec;
  }

  function stopListening() {
    clearTimers();
    const rec = recognitionRef.current;
    try {
      rec?.stop?.();
    } catch {
      // ignore
    }
    setIsListening(false);
  }

  function startListening(auto = false) {
    if (!isSupported) return;
    if (phase !== "playing") return;
    if (!current) return;

    // If we're in choose mode, do not listen.
    if (phase === "choose") return;

    const rec = ensureRecognition();
    if (!rec) return;

    transcriptRef.current = "";
    setFeedback(auto ? "Listening…" : "Say the name!");

    try {
      setIsListening(true);
      rec.start();
      // stop after 2.6s (kid-friendly auto-listen)
      stopTimerRef.current = window.setTimeout(() => {
        stopListening();
      }, 2600);
    } catch {
      setIsListening(false);
    }
  }

  function isMatch(text: string, target: Instrument) {
    const n = normalize(text);
    if (!n) return false;

    const names = [target.name, ...(target.alternatives ?? [])].map(normalize);

    // allow partial phrases: "snare" should match "snare drum"
    for (const nm of names) {
      if (!nm) continue;
      if (n === nm) return true;
      if (nm.includes(n) || n.includes(nm)) return true;
    }
    return false;
  }

  function buildChoices(target: Instrument) {
    const pool = getInstrumentsForFamily(family === "All" ? "All" : (family as InstrumentFamily))
      .map((i) => i.name)
      .filter((n) => normalize(n) !== normalize(target.name));
    const distractors = shuffle(pool).slice(0, 3);
    return shuffle([target.name, ...distractors]);
  }

  function advanceNext() {
    clearTimers();
    stopListening();
    setAttempts(0);
    setChoices([]);
    setFeedback(null);

    const next = index + 1;
    if (next >= round.length) {
      setPhase("gameOver");
      return;
    }
    setIndex(next);
    setPhase("playing");
  }

  function handleCorrect() {
    setScore((s) => s + 1);
    setFeedback("Yes! 🎉");
    playTone(880, 120);
    playTone(1320, 120);
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    } catch {}
    window.setTimeout(() => advanceNext(), 700);
  }

  function handleWrong() {
    playTone(220, 180);
    setFeedback("Try again!");
    setAttempts((a) => a + 1);
  }

  function handleTranscript(text: string) {
    if (phase !== "playing") return;
    if (!current) return;

    if (isMatch(text, current)) {
      handleCorrect();
      return;
    }

    // wrong
    setAttempts((prev) => {
      const nextAttempts = prev + 1;
      if (nextAttempts >= 2) {
        // Switch to choose-the-name
        setPhase("choose");
        setChoices(buildChoices(current));
        setFeedback("Tap the correct name!");
        stopListening();
        return nextAttempts;
      } else {
        setFeedback("Try again!");
        // auto re-listen for attempt 2
        retryTimerRef.current = window.setTimeout(() => startListening(true), 700) as any;
        return nextAttempts;
      }
    });
  }

  function handleChoose(name: string) {
    if (!current) return;
    const ok = normalize(name) === normalize(current.name);
    if (ok) {
      handleCorrect();
    } else {
      setFeedback("Good try! Next one.");
      playTone(220, 150);
      window.setTimeout(() => advanceNext(), 700);
    }
  }

  function restart() {
    clearTimers();
    stopListening();
    setScore(0);
    setIndex(0);
    setAttempts(0);
    setChoices([]);
    setFeedback(null);
    setPhase("playing");
  }

  // Auto-listen when a new instrument appears (Idea: auto-listen each round)
  useEffect(() => {
    if (phase !== "playing") return;
    if (!current) return;
    if (!isSupported) return;

    // small delay so the UI feels ready
    const t = window.setTimeout(() => startListening(true), 450);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!current && phase !== "gameOver") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl font-bold text-slate-700">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-5">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3">
          <Link href="/">
            <a className="rounded-2xl bg-white border border-slate-200 px-4 py-2 font-bold text-slate-700 shadow-sm">
              ← Menu
            </a>
          </Link>
          <div className="text-lg md:text-xl font-extrabold text-slate-900">
            {familyLabel}
          </div>
          <div className="w-[90px]" aria-hidden="true" />
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <div>
            {current && <InstrumentCard instrument={current} />}

            <div className="mt-4 rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm">
              {!isSupported ? (
                <div className="text-center">
                  <div className="text-xl font-extrabold text-slate-900">Mic not available</div>
                  <p className="mt-2 text-slate-700">
                    This device/browser doesn’t support speech. You can still play using “Choose the name”.
                  </p>
                  <button
                    className="mt-4 w-full rounded-2xl bg-slate-900 text-white px-6 py-4 text-lg font-extrabold"
                    onClick={() => {
                      if (!current) return;
                      setPhase("choose");
                      setChoices(buildChoices(current));
                      setFeedback("Tap the correct name!");
                    }}
                  >
                    Choose the name
                  </button>
                </div>
              ) : phase === "choose" ? (
                <div>
                  <div className="text-center text-xl md:text-2xl font-extrabold text-slate-900">
                    Choose the name
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    {choices.map((c) => (
                      <button
                        key={c}
                        className="rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-xl font-extrabold text-slate-900 shadow-sm active:scale-[0.99]"
                        onClick={() => handleChoose(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <button
                    className="mt-4 w-full rounded-2xl bg-slate-100 text-slate-900 px-6 py-4 text-lg font-extrabold"
                    onClick={() => {
                      setPhase("playing");
                      setFeedback("Say the name!");
                      setAttempts(0);
                      setChoices([]);
                      startListening(false);
                    }}
                  >
                    Try speaking again
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-extrabold text-slate-900">
                      {feedback ?? "Say the instrument name!"}
                    </div>
                    <div className="mt-1 text-slate-700 font-bold">
                      Tries: {attempts} / 2
                    </div>
                  </div>

                  <MicButton
                    isListening={isListening}
                    disabled={!isSupported || phase !== "playing"}
                    onClick={() => startListening(false)}
                  />

                  <button
                    className="w-full rounded-2xl bg-slate-100 text-slate-900 px-6 py-4 text-lg font-extrabold"
                    onClick={() => {
                      if (!current) return;
                      setPhase("choose");
                      setChoices(buildChoices(current));
                      setFeedback("Tap the correct name!");
                      stopListening();
                    }}
                  >
                    Choose the name
                  </button>
                </div>
              )}
            </div>

            {current?.funFact && (
              <div className="mt-4 rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-lg font-extrabold text-slate-900">Fun fact</div>
                <div className="mt-2 text-slate-700 text-lg">{current.funFact}</div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-4 h-fit">
            <ScoreBoard score={score} total={round.length} currentIndex={index} />

            <button
              className="mt-4 w-full rounded-2xl bg-white border-2 border-slate-200 px-6 py-4 text-lg font-extrabold text-slate-900 shadow-sm"
              onClick={restart}
            >
              Restart Round
            </button>
          </div>
        </div>
      </div>

      <GameOverDialog
        open={phase === "gameOver"}
        score={score}
        total={round.length}
        familyLabel={familyLabel}
        onPlayAgain={restart}
      />
    </div>
  );
}
