"use client";

export default function TopBar() {
  const sites = [
    { label: "la-mug.com", href: "https://la-mug.com", current: false },
    { label: "fdy.art", href: "https://fdy.art", current: false },
    { label: "boutique.la-mug.com", href: "/", current: true },
  ];

  return (
    <div
      className="flex items-center justify-center gap-0"
      style={{
        height: "28px",
        background: "#0f0c08",
        fontSize: "11px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {sites.map((site, i) => (
        <span key={site.label} className="flex items-center">
          {i > 0 && (
            <span className="mx-2" style={{ color: "rgba(255,255,255,0.2)" }}>
              &middot;
            </span>
          )}
          {site.current ? (
            <span className="font-medium text-white">{site.label}</span>
          ) : (
            <a
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {site.label}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
