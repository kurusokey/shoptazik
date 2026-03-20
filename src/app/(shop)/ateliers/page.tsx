import Link from "next/link";
import type { Metadata } from "next";
import { getAteliers } from "@/lib/supabase-data";
import { formatPrice } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ateliers La M.U.G — Rap, Enregistrement, Clip, Debats",
  description:
    "Ateliers rap, enregistrement studio, clip video, debats et podcasts. Pour collectivites, ecoles et particuliers. Organises par La M.U.G.",
};

const CATEGORY_LABELS: Record<string, string> = {
  rap: "Rap",
  enregistrement: "Enregistrement",
  clip: "Clip Video",
  debat: "Debat",
  "sur-mesure": "Sur-mesure",
};

const CATEGORY_ICONS: Record<string, string> = {
  rap: "M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z",
  enregistrement: "M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V4.5A2.25 2.25 0 0 0 17.25 2.25H15A2.25 2.25 0 0 0 12.75 4.5v11.553M6 20.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z",
  clip: "m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z",
  debat: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
  "sur-mesure": "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085",
};

export default async function AteliersPage() {
  const ateliers = await getAteliers();

  return (
    <div style={{ background: "#1A1610" }} className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-14 sm:py-20 md:py-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(200,160,80,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#C8A050" }}
          >
            La M.U.G pr&eacute;sente
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:mt-4 sm:text-4xl md:text-5xl">
            Ateliers{" "}
            <span style={{ color: "#C8A050" }}>La M.U.G</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/50 sm:mt-6 sm:text-lg">
            Rap, enregistrement, clip vid&eacute;o, d&eacute;bats &mdash; des ateliers
            pour collectivit&eacute;s et particuliers.
          </p>
        </div>
      </section>

      {/* Grille d'ateliers */}
      <section className="relative px-4 pb-14 sm:pb-20">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #1A1610, #201A14)",
          }}
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {ateliers.map((atelier) => (
              <div
                key={atelier.id}
                className="flex flex-col overflow-hidden rounded-xl border transition hover:border-[#C8A050]/30"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  background: "rgba(200,160,80,0.04)",
                }}
              >
                <div className="flex flex-1 flex-col p-4 sm:p-6">
                  {/* Category badge */}
                  <div className="mb-4 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                      style={{ color: "#C8A050" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={CATEGORY_ICONS[atelier.category] ?? CATEGORY_ICONS["sur-mesure"]}
                      />
                    </svg>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#C8A050" }}
                    >
                      {CATEGORY_LABELS[atelier.category] ?? atelier.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white">{atelier.title}</h2>

                  {/* Description */}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
                    {atelier.description}
                  </p>

                  {/* Meta */}
                  <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      {atelier.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                      {atelier.max_participants} participants max
                    </span>
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-5 flex items-center justify-between border-t pt-5" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div>
                      <span className="text-xs text-white/30">&Agrave; partir de</span>
                      <p className="text-lg font-bold text-white">
                        {formatPrice(atelier.price)}
                      </p>
                    </div>
                    <a
                      href="https://la-mug.com#contact"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-110"
                      style={{
                        background: "linear-gradient(135deg, #C8A050, #A08030)",
                        boxShadow: "0 4px 15px rgba(200,160,80,0.25)",
                      }}
                    >
                      R&eacute;server
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative px-4 py-14 sm:py-20">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #201A14, #1A1610)",
          }}
        />
        <div
          className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full blur-[100px]"
          style={{ background: "rgba(200,160,80,0.06)" }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Un atelier sur-mesure ?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/50 sm:mt-4">
            La M.U.G con&ccedil;oit des ateliers adapt&eacute;s &agrave; vos besoins :
            collectivit&eacute;s, &eacute;coles, centres sociaux, entreprises.
            Contactez-nous pour &eacute;tablir un programme personnalis&eacute;.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <a
              href="https://la-mug.com#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-7 py-3.5 text-center font-bold text-black transition hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #C8A050, #A08030)",
                boxShadow: "0 6px 25px rgba(200,160,80,0.3)",
              }}
            >
              Nous contacter
            </a>
            <a
              href="https://la-mug.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border px-7 py-3.5 text-center font-bold text-white/70 transition hover:border-[#C8A050]/40 hover:text-white"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              D&eacute;couvrir La M.U.G
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
