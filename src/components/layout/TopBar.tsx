"use client";

export default function TopBar() {
  const sites = [
    { label: "la-mug.com", href: "https://la-mug.com", current: false },
    { label: "fdy.art", href: "https://fdy.art", current: false },
    { label: "boutique.la-mug.com", href: "/", current: true },
  ];

  return (
    <div>
      {/* Gold stripe — top frame line, old-school hip-hop accent */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #C8A050 20%, #C8A050 80%, transparent)" }} />

      <div
        className="flex items-center justify-center gap-0 px-2"
        style={{
          height: "24px",
          background: "#0f0c08",
          fontSize: "9px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {sites.map((site, i) => (
          <span key={site.label} className="flex items-center">
            {i > 0 && (
              <>
                {/* Dot separator — hidden on very small screens, visible from 380px+ */}
                <span className="mx-1 hidden min-[380px]:inline sm:mx-2" style={{ color: "rgba(200,160,80,0.35)" }}>
                  &#x2726;
                </span>
                {/* Simple space on very small screens */}
                <span className="mx-1 min-[380px]:hidden" />
              </>
            )}
            {site.current ? (
              <span className="font-medium" style={{ color: "#C8A050" }}>{site.label}</span>
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
    </div>
  );
}
