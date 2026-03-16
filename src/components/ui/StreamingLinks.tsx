interface StreamingLinksProps {
  artistName: string;
  projectTitle: string;
}

const platforms = [
  {
    name: "Spotify",
    baseUrl: "https://open.spotify.com/search/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    name: "Apple Music",
    baseUrl: "https://music.apple.com/fr/search?term=",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0019.7.247a10.073 10.073 0 00-1.93-.181C17.08.015 16.39 0 12.004 0h-.01C7.614 0 6.921.015 6.231.066a10.08 10.08 0 00-1.93.181A5.023 5.023 0 002.425.891C1.307 1.624.562 2.624.245 3.934A9.195 9.195 0 00.006 6.124C-.009 6.814 0 7.507 0 11.997v.006c0 4.49-.009 5.18.006 5.873a9.23 9.23 0 00.24 2.19c.317 1.31 1.062 2.31 2.18 3.043a5.02 5.02 0 001.875.644 10.07 10.07 0 001.93.181c.69.051 1.38.066 5.77.066h.01c4.38 0 5.07-.015 5.76-.066a10.08 10.08 0 001.93-.181 5.023 5.023 0 001.875-.644c1.118-.733 1.863-1.733 2.18-3.043a9.2 9.2 0 00.24-2.19c.015-.69.006-1.383.006-5.873v-.006c0-4.49.009-5.183-.006-5.873zM17.45 16.71l-1.89.955c-3.244 1.636-5.884 2.964-5.884 2.964-.167.084-.34.13-.517.13a.87.87 0 01-.407-.1.861.861 0 01-.454-.777V7.803a.866.866 0 01.442-.765.87.87 0 01.888.02s2.64 1.328 5.884 2.964l1.89.955a.881.881 0 01.48.777.884.884 0 01-.432.957z" />
      </svg>
    ),
  },
  {
    name: "Deezer",
    baseUrl: "https://www.deezer.com/search/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.81 4.16v3.03H24V4.16h-5.19zM6.27 8.38v3.027h5.189V8.38H6.27zm12.54 0v3.027H24V8.38h-5.19zM6.27 12.594v3.027h5.189v-3.027H6.27zm6.271 0v3.027h5.19v-3.027h-5.19zm6.27 0v3.027H24v-3.027h-5.19zM0 16.81v3.029h5.19v-3.03H0zm6.27 0v3.029h5.189v-3.03H6.27zm6.271 0v3.029h5.19v-3.03h-5.19zm6.27 0v3.029H24v-3.03h-5.19z" />
      </svg>
    ),
  },
  {
    name: "YouTube Music",
    baseUrl: "https://music.youtube.com/search?q=",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228 18.228 15.432 18.228 12 15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
      </svg>
    ),
  },
];

export default function StreamingLinks({ artistName, projectTitle }: StreamingLinksProps) {
  const query = encodeURIComponent(`${artistName} ${projectTitle}`);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs text-white/30">Écouter sur :</span>
      {platforms.map((p) => (
        <a
          key={p.name}
          href={`${p.baseUrl}${query}`}
          target="_blank"
          rel="noopener noreferrer"
          title={`Écouter sur ${p.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/30 transition hover:text-white/60"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          {p.icon}
        </a>
      ))}
    </div>
  );
}
