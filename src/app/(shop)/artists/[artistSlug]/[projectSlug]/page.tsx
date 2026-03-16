import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProductsByProject,
  getChildProjects,
} from "@/lib/supabase-data";
import ProductCard from "@/components/ui/ProductCard";
import YouTubePlayer from "@/components/ui/YouTubePlayer";
import BuyTrackButton from "@/components/ui/BuyTrackButton";
import BuyAlbumDigital from "@/components/ui/BuyAlbumDigital";
import { projectTypeLabel } from "@/lib/utils";
import { getYouTubeId } from "@/lib/youtube";
import Link from "next/link";

const TRACK_PRICE = 129; // 1,29€ par titre

interface ProjectPageProps {
  params: Promise<{ artistSlug: string; projectSlug: string }>;
}

// ============================================
// THEMES VISUELS PAR ALBUM
// ============================================
const themes: Record<string, {
  bg: string; headerBg: string; accent: string; accentMuted: string;
  textPrimary: string; textSecondary: string; cardBg: string; border: string;
  shadow: string; quote?: string; quoteAuthor?: string;
  story?: { title: string; text: string }[];
}> = {
  flamboyant: {
    bg: "#1a0e14",
    headerBg: "linear-gradient(170deg, #3A1528, #2A0E1C, #1a0e14)",
    accent: "#C07088",
    accentMuted: "rgba(90,32,64,0.15)",
    textPrimary: "white",
    textSecondary: "#9A7080",
    cardBg: "rgba(90,48,69,0.15)",
    border: "rgba(90,32,64,0.15)",
    shadow: "0 30px 70px rgba(90,20,40,0.5)",
    quote: "Flamboyant s'inscrit dans une volonté que j'ai de me frotter à autre chose que du rap. Je me dis que j'ai déjà bien rappé dans ma vie, alors je veux voir si je sais faire autre chose.",
    quoteAuthor: "Fdy Phenomen — Abcdr du Son",
    story: [
      {
        title: "La reconnexion",
        text: "« Il y a ce besoin de reconnexion réelle et affirmée avec l'africanité. On se pose des questions : à quoi se rattacher ? D'où vient-on ? Où veut-on vraiment aller ? » Fdy Phenomen, né à Rouen, grandi en Martinique, cherche ses racines à travers la musique.",
      },
      {
        title: "Le flamboyant",
        text: "Le flamboyant, c'est l'arbre royal des Antilles. En mai 1848, quand la nouvelle de l'abolition de l'esclavage arrive aux îles, le flamboyant est en pleine floraison. Les affranchis dansent autour de l'arbre, agitent ses fleurs rouges. Aimé Césaire lui a dédié des vers. Pour Fdy, choisir ce nom, c'est revendiquer ses racines caribéennes.",
      },
      {
        title: "Le saut dans le vide",
        text: "« J'avais pas mal fait le rappeur, technique, pas technique, avec du fond ou pas... Une fois que tu as fait le tour, tu as envie de choses nouvelles, d'autres sonorités. Je voulais faire ce saut dans le vide, et proposer ça sans en avoir peur. »",
      },
      {
        title: "Bo Kay Mwen",
        text: "\"Bo Kay Mwen\" — \"près de chez moi\" en créole martiniquais. Le morceau le plus long de l'album, avec André Saint-Prix, légende de la musique traditionnelle martiniquaise, Djama Keita et Laurent Succab. La rencontre entre le rap et la tradition antillaise.",
      },
    ],
  },
  "qui-peut-tuer-la-rage-dun-assassin": {
    bg: "#0a0a0a",
    headerBg: "linear-gradient(170deg, #1a1a1a, #0f0f0f, #0a0a0a)",
    accent: "#D41920",
    accentMuted: "rgba(212,25,32,0.08)",
    textPrimary: "white",
    textSecondary: "rgba(255,255,255,0.45)",
    cardBg: "rgba(212,25,32,0.05)",
    border: "rgba(255,255,255,0.06)",
    shadow: "0 30px 70px rgba(0,0,0,0.7)",
    quote: "Le titre résonne comme un appel à l'aide et une envie de tuer musicalement. Écrit à un moment de ma vie où ma résistance allait flancher, poussé par la passion et une vraie envie de tuer, mais aussi par le désir de guérir.",
    quoteAuthor: "Fdy Phenomen",
    story: [
      {
        title: "9 ans de silence",
        text: "Entre le premier album (2002) et celui-ci, neuf ans s'écoulent. Trois enfants naissent. Le label Secteur A décline. Fdy s'éloigne. Mais la rage, elle, ne meurt pas.",
      },
      {
        title: "La douleur et l'urgence",
        text: "L'album est écrit dans la douleur. Fdy s'interroge : est-il encore un tueur — un rappeur redoutable — ou est-il devenu une victime ? Le titre pose la question sans répondre. 17 titres entre névrose et renaissance.",
      },
      {
        title: "Eben & Fifou",
        text: "Eben, retrouvé depuis l'époque de « Mission Suicide » avec Lino et Sinik, assure la quasi-totalité de la production. Fifou, le photographe n°1 du rap français (600+ pochettes à son actif), signe le visuel. Deux validations majeures du milieu.",
      },
      {
        title: "Le Zénith et le Bataclan",
        text: "« Comme je suis » feat. Medhy Custos devient le titre phare. Il ramène Fdy sur scène au Zénith de Paris et au Bataclan. Joey Starr l'invite ensuite sur son album et sur l'Egomaniac Tour — 15 dates en France et en Europe.",
      },
    ],
  },
  "ca-dvait-arriver": {
    bg: "#0c0a08",
    headerBg: "linear-gradient(170deg, #1a1610, #12100c, #0c0a08)",
    accent: "#C8A050",
    accentMuted: "rgba(200,160,80,0.08)",
    textPrimary: "white",
    textSecondary: "rgba(255,255,255,0.4)",
    cardBg: "rgba(200,160,80,0.05)",
    border: "rgba(200,160,80,0.1)",
    shadow: "0 30px 70px rgba(0,0,0,0.6)",
    quote: "Ça devait arriver. Après les Rimeurs à Gages, les compilations, les freestyles, les maxis — l'album s'ouvre sur « Ça d'vait arriver » et se ferme sur « C'est déjà arrivé ». L'inévitable est accompli.",
    quoteAuthor: "Fdy Phenomen",
    story: [
      {
        title: "De Rouen à la Martinique",
        text: "Né à Rouen en 1977, Fdy part en Martinique à 9 ans. Il découvre qu'il est noir — après avoir grandi parmi les Normands. Là-bas, il rejoint les Generation Black MCs, s'entraîne sur des instrus dancehall. Il revient en métropole avec le bac mention bien en poche.",
      },
      {
        title: "Les Rimeurs à Gages",
        text: "Au milieu des années 90, il forme les Rimeurs à Gages avec Fouta Barge, Mossy, JM Dee — et un certain Disiz la Peste. Le groupe écume les compilations : Homecore, Première Classe, BOSS. Puis chacun prend sa route.",
      },
      {
        title: "Secteur A",
        text: "Arsenik le fait entrer chez Secteur Ä, le label de Kenzy (Ministère AMER). Fdy rejoint la famille aux côtés de Lino. Le premier album devient inévitable.",
      },
      {
        title: "22 titres, un destin",
        text: "L'album est une fresque. « Trop près » — une plainte humble sur des sonorités douces, saluée par Abcdr du Son comme une « excellente surprise ». « Hors programme » avec JoeyStarr. « J'gagne tant que j'respire » avec Lino. 22 morceaux pour dire : c'est déjà arrivé.",
      },
    ],
  },
  // ============================================
  // MIXTAPES
  // ============================================
  tropikal: {
    bg: "#2A1500",
    headerBg: "linear-gradient(170deg, #E87020, #C85A10, #2A1500)",
    accent: "#E87020",
    accentMuted: "rgba(232,112,32,0.15)",
    textPrimary: "white",
    textSecondary: "rgba(255,255,255,0.6)",
    cardBg: "rgba(232,112,32,0.08)",
    border: "rgba(232,112,32,0.15)",
    shadow: "0 30px 70px rgba(200,90,16,0.4)",
    quote: "Tropikal F, c'est les mix des meilleurs titres afro-caribéens de Fdy Phenomen. Inédits et trouvailles. Tout bitin si kontrol.",
    quoteAuthor: "Selecta Black Kymbo & Fdy Phenomen",
    story: [
      {
        title: "Les racines caribéennes",
        text: "Présentée par La M.U.G et Blackwarell, mixée par Selecta Black Kymbo, Tropikal F est une plongée dans les racines afro-caribéennes de Fdy Phenomen. Dancehall, reggae, sonorités tropicales — le soleil des Antilles rencontre le bitume parisien.",
      },
      {
        title: "Tout bitin si kontrol",
        text: "« Tout est sous contrôle » en créole. La mixtape rassemble des inédits, des trouvailles et des titres rares. C'est Fdy sous le soleil, les pieds dans le sable, le flow ensoleillé mais la plume toujours acérée.",
      },
    ],
  },
  "the-prequel": {
    bg: "#1a1a18",
    headerBg: "linear-gradient(170deg, #3A3830, #2A2820, #1a1a18)",
    accent: "#8B1A1A",
    accentMuted: "rgba(139,26,26,0.12)",
    textPrimary: "white",
    textSecondary: "rgba(255,255,255,0.45)",
    cardBg: "rgba(139,26,26,0.06)",
    border: "rgba(255,255,255,0.08)",
    shadow: "0 30px 70px rgba(0,0,0,0.5)",
    quote: "The Prequel, c'est les origines. Des freestyles et inédits enregistrés entre les concerts de l'Egomaniac Tour avec Joey Starr. 13 titres, le feu au micro.",
    quoteAuthor: "DJ Phaxx & Fdy Phenomen",
    story: [
      {
        title: "L'Egomaniac Tour",
        text: "2012. Joey Starr invite Fdy sur son album et sur l'Egomaniac Tour — 15 dates en France et en Europe. Sur la route, entre les concerts, Fdy et DJ Phaxx enregistrent. Des freestyles, des inédits, des brûlots. The Prequel naît dans les loges et les chambres d'hôtel.",
      },
      {
        title: "Avant le retour",
        text: "The Prequel raconte ce qui s'est passé avant le retour. 13 titres bruts, entre le deuxième album et ce qui viendra après. La route, la scène, le micro. DJ Phaxx aux platines, Fdy au micro. Pas de filtre, pas de studio luxueux — juste le rap.",
      },
    ],
  },
  charcutier: {
    bg: "#1a0808",
    headerBg: "linear-gradient(170deg, #D41920, #8B1010, #1a0808)",
    accent: "#D41920",
    accentMuted: "rgba(212,25,32,0.12)",
    textPrimary: "white",
    textSecondary: "rgba(255,255,255,0.5)",
    cardBg: "rgba(212,25,32,0.06)",
    border: "rgba(212,25,32,0.12)",
    shadow: "0 30px 70px rgba(212,25,32,0.3)",
    quote: "Le Charcutier, c'est Fdy qui découpe. Freestyles, inédits, feats, remix. Après deux ans de tournée en France et à l'étranger, la lame est affûtée.",
    quoteAuthor: "Fdy Phenomen",
    story: [
      {
        title: "Après la tournée",
        text: "2005. Deux ans après « Ça d'vait arriver », Fdy a écumé les scènes de France et de l'étranger. La route a aiguisé le flow. Le Charcutier, c'est le résultat : des freestyles sauvages, des inédits brûlants, des feats avec Tandem et Maj Trafyk.",
      },
      {
        title: "La découpe",
        text: "26 titres. Le Charcutier tranche dans le vif. Fdy découpe les instrus, débite les punchlines, émince les beats. Une mixtape brute et sans compromis, le couteau entre les dents.",
      },
    ],
  },
  "rimeurs-a-gages": {
    bg: "#0A1428",
    headerBg: "linear-gradient(170deg, #122040, #0E1830, #0A1428)",
    accent: "#D4B830",
    accentMuted: "rgba(212,184,48,0.1)",
    textPrimary: "white",
    textSecondary: "rgba(212,184,48,0.45)",
    cardBg: "rgba(212,184,48,0.05)",
    border: "rgba(212,184,48,0.12)",
    shadow: "0 30px 70px rgba(0,0,0,0.5)",
    quote: "Ils arpentaient les coins et recoins de la région parisienne de sorte à performer partout où c'était possible, façon opération freestyle permanente.",
    quoteAuthor: "Rimeurs à Gages — 1995-2022",
    story: [
      {
        title: "La formation (1994-1995)",
        text: "Au milieu des années 90, dans la banlieue parisienne, un trio se forme : Fdy Phenomen, Fouta Barge et Mossy. Ils s'appellent les Rimeurs à Gages. JMDee-Beat, producteur singulier au style hérité de DJ Premier — micro-samples, groove à la Erick Sermon, sons synthétiques — prend les commandes. DJ Will Much pose les platines. Un quatrième MC les rejoint vite : Disiz la Peste, venu d'Évry.",
      },
      {
        title: "L'opération freestyle permanente",
        text: "Le crew écume chaque recoin de la région parisienne. Pas de studio, pas de label — juste le micro et la rue. Ils performent partout où c'est possible. Les premiers enregistrements naissent entre 1995 et 1998 : « Produits de la Cave », enregistré et mixé dans la cave.",
      },
      {
        title: "Les premières compilations (1997)",
        text: "1997, deux événements fondateurs. D'abord, le freestyle sur la mixtape mythique « What's The Flavor? #25 » de DJ Poska — Disiz, Fdy et Fouta Barge au micro. Puis « Trajectoire » feat. Eloquence sur la compilation « Nouvelle Donne », aux côtés de Mafia K'1 Fry et des Sages Poètes de la Rue. Le nom Rimeurs à Gages commence à circuler dans le milieu.",
      },
      {
        title: "Les routes individuelles (1999)",
        text: "1999. Fdy décroche un titre sur Homecore — « Laisse seulement » avec Disiz — puis apparaît sur BOSS (le label de Joey Starr), Première Classe vol. 1 (« Paraît qu't'es hardcore » avec Delta, Cynefro, Karlito et MC Jean Gab'1), L'Univers des Lascars, et la BO de Yamakazi. Son premier maxi solo « Tous du même sexe » sort chez Boom Staff.",
      },
      {
        title: "La séparation",
        text: "Un conflit éclate entre JMDee et Fouta Barge lors d'une première partie de Lord Finesse à Bruxelles. La réconciliation échoue. Le crew se disloque. Disiz sort son maxi « C'que les gens veulent entendre », découvert par Joey Starr. En 2000, « Le Poisson Rouge » avec le hit « J'pète les plombs » — un loop de JMDee — dépasse les 250 000 ventes. Double disque d'or.",
      },
      {
        title: "Fdy chez Secteur A",
        text: "Arsenik fait entrer Fdy chez Secteur A Miziks, le label de Kenzy. Le maxi « Ma logik / J'gagne tant que j'respire » feat. Lino sort en 2001. En février 2002, l'album « Ça d'vait arriver » paraît chez EMI — feat. Lino, JoeyStarr, Neg' Marrons. Le Rimeur à Gages est devenu soliste.",
      },
      {
        title: "JMDee — le producteur dans l'ombre",
        text: "JMDee continue de produire dans l'ombre. Il crée le label Gazdemall, produit l'EP « Symetrikman » de Maj Trafyk (2002). Mais son studio de Stains est cambriolé — les voleurs emportent tout le matériel et un album inédit de Maj Trafyk. Il sort la mixtape « Illegal Mix », puis le silence.",
      },
      {
        title: "L'Anthologik Mixtape (2022)",
        text: "9 septembre 2022. Vingt-sept ans après la formation du crew, La M.U.G et Much-Zone présentent « Rimeurs à Gages : Anthologik Mixtape ». Fdy, JMDee-Beat et DJ Will Much ont exhumé les archives. 17 titres : le freestyle DJ Poska de 1997, « Trajectoire » de Nouvelle Donne, « Laisse seulement » avec Disiz, « Tous du même zgueg » avec Lino, et même « Rage Musik » avec Fouta Barge — la preuve que les liens n'ont jamais été totalement rompus.",
      },
    ],
  },
  // ============================================
  // EP
  // ============================================
  "hors-serie": {
    bg: "#1A100A",
    headerBg: "linear-gradient(170deg, #8A4035, #6A3028, #1A100A)",
    accent: "#D4A030",
    accentMuted: "rgba(212,160,48,0.12)",
    textPrimary: "white",
    textSecondary: "rgba(255,255,255,0.5)",
    cardBg: "rgba(212,160,48,0.06)",
    border: "rgba(212,160,48,0.12)",
    shadow: "0 30px 70px rgba(138,64,53,0.4)",
    quote: "H(OR)S-Série — le OR est en or. Un projet hors cadre, hors format, hors normes. 12 titres sélectionnés à travers la discographie, réunis sur un seul disque. L'essentiel, concentré.",
    quoteAuthor: "Fdy Phenomen — Addictive Music, 2021",
    story: [
      {
        title: "L'or dans le titre",
        text: "H(OR)S-SÉRIE. Le « OR » est en lettres d'or sur la pochette. Un jeu de mots qui dit tout : ce projet est en or. Photo signée Bruce Serbin — Fdy de profil, lunettes miroir, fond terre cuite. La classe, l'élégance, la maturité d'un artiste qui sait ce qu'il vaut.",
      },
      {
        title: "Un condensé de carrière",
        text: "Hors Série pioche dans toute la discographie. « Problème cardiaque » remonte à Ça d'vait arriver (2002). « Illusion » avec Singuila vient de Qui Peut Tuer (2011). « Viens pas me compliquer » et « Trop » sont issus de The Prequel (2013). 12 titres triés sur le volet — le best-of non officiel.",
      },
      {
        title: "Addictive Music",
        text: "Sorti sur le label Addictive Music en juillet 2021, Hors Série marque le retour de Fdy dans le circuit après Flamboyant (2018). Un tremplin vers ce qui deviendra, quatre ans plus tard, Chanteur de Rap.",
      },
    ],
  },
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { artistSlug, projectSlug } = await params;
  const project = await getProjectBySlug(artistSlug, projectSlug);

  if (!project) return notFound();

  const products = await getProductsByProject(project.id);
  const singles = await getChildProjects(project.id);
  const theme = themes[projectSlug] ?? {
    bg: "#0f0f0f", headerBg: "linear-gradient(to bottom, #1a1a1a, #0f0f0f)",
    accent: "#C8A050", accentMuted: "rgba(200,160,80,0.08)",
    textPrimary: "white", textSecondary: "rgba(255,255,255,0.4)",
    cardBg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.06)",
    shadow: "0 30px 70px rgba(0,0,0,0.5)",
  };

  return (
    <div style={{ background: theme.bg }}>
      {/* ============================================
          HERO — Pochette + infos
          ============================================ */}
      <section className="relative overflow-hidden px-4 py-16" style={{ background: theme.headerBg }}>
        {/* Pochette floutée en fond */}
        <div className="absolute inset-0 overflow-hidden">
          <img src={project.cover_url} alt="" className="h-full w-full scale-125 object-cover blur-[80px]" style={{ opacity: 0.12 }} />
          <div className="absolute inset-0" style={{ background: `${theme.bg}cc` }} />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <nav className="mb-8 flex items-center gap-2 text-sm" style={{ color: theme.textSecondary }}>
            <Link href="/" className="transition hover:opacity-70">Accueil</Link>
            <span>/</span>
            <Link href={`/artists/${artistSlug}`} className="transition hover:opacity-70">{project.artist.name}</Link>
            <span>/</span>
            <span style={{ color: theme.accent }}>{project.title}</span>
          </nav>

          <div className="grid gap-10 md:grid-cols-2">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[460px] overflow-hidden rounded-xl" style={{ boxShadow: theme.shadow }}>
                <img src={project.cover_url} alt={project.title} className="block h-auto w-full" />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: theme.accentMuted, color: theme.accent }}>
                  {projectTypeLabel(project.type)}
                </span>
                <span className="text-sm" style={{ color: theme.textSecondary }}>{project.release_year}</span>
              </div>

              <Link href={`/artists/${artistSlug}`} className="mt-3 text-sm font-semibold transition hover:opacity-80" style={{ color: theme.accent }}>
                {project.artist.name}
              </Link>

              <h1 className="mt-1 text-3xl font-black md:text-5xl" style={{ color: theme.textPrimary }}>{project.title}</h1>

              <p className="mt-4 leading-relaxed" style={{ color: theme.textSecondary }}>{project.description}</p>

              <div className="mt-6 text-sm" style={{ color: theme.textSecondary }}>
                {project.tracklist.length} titres
                {singles.length > 0 && <span> &middot; {singles.length} single{singles.length > 1 ? "s" : ""}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CITATION
          ============================================ */}
      {theme.quote && (
        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 overflow-hidden">
            <img src={project.cover_url} alt="" className="h-full w-full object-cover" style={{ objectPosition: "center 40%", opacity: 0.06 }} />
          </div>
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <blockquote className="text-lg font-light italic leading-relaxed md:text-2xl" style={{ color: theme.accent }}>
              &laquo;&nbsp;{theme.quote}&nbsp;&raquo;
            </blockquote>
            {theme.quoteAuthor && (
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: theme.textSecondary }}>
                {theme.quoteAuthor}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ============================================
          L'HISTOIRE — Narration immersive
          ============================================ */}
      {theme.story && theme.story.length > 0 && (
        <section className="relative px-4 py-16">
          <div className="relative mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-2xl font-black md:text-3xl" style={{ color: theme.textPrimary }}>
              L&apos;histoire
            </h2>

            <div className="space-y-12">
              {theme.story.map((chapter, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: theme.accentMuted, color: theme.accent }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {i < theme.story!.length - 1 && (
                      <div className="mt-2 w-px flex-1" style={{ background: theme.border }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <h3 className="text-lg font-bold" style={{ color: theme.textPrimary }}>{chapter.title}</h3>
                    <p className="mt-2 leading-relaxed" style={{ color: theme.textSecondary }}>{chapter.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          SINGLES
          ============================================ */}
      {singles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="mb-6 text-xl font-bold" style={{ color: theme.textPrimary }}>Singles extraits de l&apos;album</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {singles.map((single) => (
              <Link
                key={single.id}
                href={`/artists/${artistSlug}/${single.slug}`}
                className="group flex gap-5 overflow-hidden rounded-xl border p-4 transition hover:border-white/15"
                style={{ borderColor: theme.border, background: theme.cardBg }}
              >
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg">
                  <img src={single.cover_url} alt={single.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="mb-1 inline-block w-fit rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: theme.accentMuted, color: theme.accent }}>Single</span>
                  <h3 className="text-lg font-bold" style={{ color: theme.textPrimary }}>{single.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm" style={{ color: theme.textSecondary }}>{single.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============================================
          TRACKLIST
          ============================================ */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          <div className="hidden md:col-span-2 md:block">
            <div className="sticky top-24 overflow-hidden rounded-xl" style={{ boxShadow: theme.shadow }}>
              <img src={project.cover_url} alt={project.title} className="block h-auto w-full" />
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{ color: theme.textPrimary }}>Tracklist</h2>
              <span className="text-sm" style={{ color: theme.textSecondary }}>{project.tracklist.length} titres</span>
            </div>

            <div className="overflow-hidden rounded-xl border" style={{ borderColor: theme.border, background: theme.cardBg }}>
              {project.tracklist.map((track, i) => {
                const isSingle = singles.some(
                  (s) => s.title.toLowerCase() === track.toLowerCase() || track.toLowerCase().includes(s.title.toLowerCase())
                );
                const ytId = getYouTubeId(track);
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-white/[0.03]"
                    style={{ borderBottom: i !== project.tracklist.length - 1 ? `1px solid ${theme.border}` : "none" }}
                  >
                    {ytId ? (
                      <YouTubePlayer videoId={ytId} trackTitle={track} />
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-right text-sm font-bold" style={{ color: `${theme.accent}55` }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                    <span className={`flex-1 text-sm ${isSingle ? "font-medium" : ""}`} style={{ color: isSingle ? theme.accent : theme.textSecondary }}>
                      {track}
                    </span>
                    {isSingle && (
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-xs" style={{ background: theme.accentMuted, color: theme.accent }}>Single</span>
                    )}
                    <BuyTrackButton
                      title={track}
                      artist={project.artist.name}
                      album={project.title}
                      price={TRACK_PRICE}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FORMATS DISPONIBLES
          ============================================ */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-xl font-bold" style={{ color: theme.textPrimary }}>
          {projectSlug === "chanteur-de-rap" ? "Formats disponibles" : "Format disponible"}
        </h2>

        {/* Produits physiques uniquement pour Chanteur de Rap (sans t-shirt) */}
        {projectSlug === "chanteur-de-rap" && products.length > 0 && (
          <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((p) => p.category !== "tshirt")
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        )}

        {/* Album digital */}
        <BuyAlbumDigital
          title={project.title}
          artist={project.artist.name}
          trackCount={project.tracklist.length}
          price={999}
          coverUrl={project.cover_url}
        />
      </section>
    </div>
  );
}
