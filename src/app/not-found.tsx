import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{ background: "#1A1610" }}
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <p
        className="text-[120px] font-black leading-none md:text-[180px]"
        style={{ color: "#C8A050" }}
      >
        404
      </p>

      <h1 className="mt-4 text-2xl font-bold text-white md:text-3xl">
        Page introuvable
      </h1>

      <p className="mt-3 max-w-md text-white/40">
        La page que vous cherchez n&apos;existe pas ou a
        &eacute;t&eacute; d&eacute;plac&eacute;e.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-xl px-7 py-3.5 font-bold text-black transition hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #C8A050, #A08030)",
            boxShadow: "0 6px 25px rgba(200,160,80,0.3)",
          }}
        >
          Retour &agrave; la boutique
        </Link>

        <Link
          href="/artists/fdy-phenomen"
          className="rounded-xl border px-7 py-3.5 font-semibold transition hover:border-white/20 hover:text-white"
          style={{ borderColor: "rgba(200,160,80,0.3)", color: "#C8A050" }}
        >
          Voir la discographie
        </Link>
      </div>
    </div>
  );
}
