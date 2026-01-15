import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full rounded-3xl bg-white border border-slate-200 p-8 text-center shadow-sm">
        <div className="text-6xl">🧭</div>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-700">Let’s head back to the game menu.</p>
        <Link href="/">
          <a className="inline-block mt-6 rounded-2xl bg-slate-900 text-white px-6 py-4 text-lg font-bold">
            Back to Menu
          </a>
        </Link>
      </div>
    </div>
  );
}
