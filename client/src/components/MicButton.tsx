interface MicButtonProps {
  isListening: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function MicButton({ isListening, disabled, onClick }: MicButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "w-28 h-28 md:w-32 md:h-32 rounded-full",
        "flex flex-col items-center justify-center gap-1",
        "text-white font-extrabold",
        "shadow-md active:scale-[0.98] transition",
        disabled ? "bg-slate-300 cursor-not-allowed" : isListening ? "bg-rose-500" : "bg-slate-900 hover:bg-slate-800",
      ].join(" ")}
      aria-label={isListening ? "Listening" : "Tap to speak"}
    >
      <div className="text-3xl" aria-hidden="true">{isListening ? "🎙️" : "🎤"}</div>
      <div className="text-sm md:text-base">
        {isListening ? "Listening" : "Tap"}
      </div>
    </button>
  );
}
