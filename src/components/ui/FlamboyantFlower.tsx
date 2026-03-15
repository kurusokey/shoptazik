interface FlamboyantFlowerProps {
  className?: string;
  opacity?: number;
}

// Fleur de flamboyant réaliste — fidèle au tatouage de la pochette
// Pétales rouges froissés, étamines saillantes, feuille verte
export default function FlamboyantFlower({
  className = "",
  opacity = 1,
}: FlamboyantFlowerProps) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <g transform="translate(150,150)">
        {/* Pétale 1 — haut gauche */}
        <path
          d="M-10,-20 C-35,-80 -80,-90 -70,-55 C-60,-20 -40,-30 -25,-15 C-15,-8 -5,-15 -10,-20Z"
          fill="#D41920"
        />
        <path
          d="M-15,-25 C-30,-65 -65,-75 -58,-48 C-50,-25 -35,-30 -22,-18Z"
          fill="#E8302A"
          opacity={0.7}
        />
        {/* Pétale 2 — haut droit */}
        <path
          d="M10,-20 C35,-85 85,-80 65,-50 C50,-25 35,-28 20,-15 C12,-8 5,-15 10,-20Z"
          fill="#C01818"
        />
        <path
          d="M18,-28 C40,-72 72,-68 56,-44 C44,-25 32,-28 22,-18Z"
          fill="#E83030"
          opacity={0.6}
        />
        {/* Pétale 3 — gauche */}
        <path
          d="M-15,-5 C-85,-25 -95,15 -60,20 C-30,24 -25,10 -18,2 C-12,-3 -10,-2 -15,-5Z"
          fill="#D41920"
        />
        <path
          d="M-20,-2 C-70,-15 -78,12 -52,16 C-30,18 -26,8 -20,2Z"
          fill="#B81515"
          opacity={0.5}
        />
        {/* Pétale 4 — droite */}
        <path
          d="M15,-5 C90,-20 92,25 58,22 C30,20 22,8 16,0 C12,-4 12,-3 15,-5Z"
          fill="#C81A1A"
        />
        <path
          d="M22,0 C72,-12 76,18 50,18 C30,17 24,8 20,2Z"
          fill="#E83828"
          opacity={0.5}
        />
        {/* Pétale 5 — bas (le pétale "étendard" avec touches orange/jaune) */}
        <path
          d="M-5,10 C-30,70 5,90 15,65 C22,48 18,30 8,18 C3,12 -2,10 -5,10Z"
          fill="#D41920"
        />
        <path
          d="M0,18 C-15,55 5,70 12,52 C16,40 14,30 8,22Z"
          fill="#E85028"
          opacity={0.6}
        />
        <path
          d="M2,22 C-5,45 5,55 10,42 C13,34 10,28 6,24Z"
          fill="#F0A030"
          opacity={0.4}
        />

        {/* Nervures des pétales */}
        <line x1="-12" y1="-22" x2="-50" y2="-60" stroke="#A01010" strokeWidth="0.8" opacity={0.4} />
        <line x1="12" y1="-22" x2="52" y2="-58" stroke="#A01010" strokeWidth="0.8" opacity={0.4} />
        <line x1="-16" y1="-3" x2="-62" y2="5" stroke="#A01010" strokeWidth="0.8" opacity={0.3} />
        <line x1="16" y1="-3" x2="60" y2="6" stroke="#A01010" strokeWidth="0.8" opacity={0.3} />
        <line x1="0" y1="14" x2="5" y2="58" stroke="#A01010" strokeWidth="0.8" opacity={0.3} />

        {/* Coeur de la fleur */}
        <circle cx="0" cy="0" r="8" fill="#8B1515" />
        <circle cx="0" cy="0" r="5" fill="#A02020" />

        {/* Étamines longues et recourbées */}
        <path d="M0,0 C15,-40 25,-55 30,-62" stroke="#C01818" strokeWidth="1.2" fill="none" />
        <circle cx="30" cy="-62" r="3" fill="#D41920" />
        <path d="M0,0 C-20,-35 -28,-52 -22,-65" stroke="#C01818" strokeWidth="1.2" fill="none" />
        <circle cx="-22" cy="-65" r="3" fill="#D41920" />
        <path d="M0,0 C25,-20 40,-35 48,-38" stroke="#B81818" strokeWidth="1" fill="none" />
        <circle cx="48" cy="-38" r="2.5" fill="#D41920" />
        <path d="M0,0 C-25,-15 -42,-28 -50,-30" stroke="#B81818" strokeWidth="1" fill="none" />
        <circle cx="-50" cy="-30" r="2.5" fill="#D41920" />
      </g>
    </svg>
  );
}

// Bouquet de fleurs — le tatouage complet comme sur la pochette
export function FlamboyantTattoo({
  className = "",
  opacity = 1,
}: FlamboyantFlowerProps) {
  return (
    <svg
      viewBox="0 0 500 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {/* Feuilles vertes derrière */}
      <g opacity={0.8}>
        {/* Feuille composée 1 */}
        <g transform="translate(100,400) rotate(-30)">
          <line x1="-60" y1="0" x2="60" y2="0" stroke="#2A5520" strokeWidth="1.5" />
          {[-50,-38,-26,-14,-2,10,22,34,46].map((x,i) => (
            <g key={`l1-${i}`}>
              <ellipse cx={x} cy={-6} rx={3.5} ry={5.5} fill="#2A5520" />
              <ellipse cx={x} cy={6} rx={3.5} ry={5.5} fill="#1A4015" />
            </g>
          ))}
        </g>
        {/* Feuille composée 2 */}
        <g transform="translate(380,350) rotate(20)">
          <line x1="-50" y1="0" x2="50" y2="0" stroke="#2A5520" strokeWidth="1.5" />
          {[-40,-28,-16,-4,8,20,32,44].map((x,i) => (
            <g key={`l2-${i}`}>
              <ellipse cx={x} cy={-5.5} rx={3} ry={5} fill="#1A4015" />
              <ellipse cx={x} cy={5.5} rx={3} ry={5} fill="#2A5520" />
            </g>
          ))}
        </g>
        {/* Feuille composée 3 */}
        <g transform="translate(200,500) rotate(-10)">
          <line x1="-45" y1="0" x2="45" y2="0" stroke="#3A6830" strokeWidth="1.2" />
          {[-36,-24,-12,0,12,24,36].map((x,i) => (
            <g key={`l3-${i}`}>
              <ellipse cx={x} cy={-5} rx={3} ry={4.5} fill="#2A5520" />
              <ellipse cx={x} cy={5} rx={3} ry={4.5} fill="#3A6830" />
            </g>
          ))}
        </g>
      </g>

      {/* Fleur 1 — grande, centre */}
      <g transform="translate(250,220) scale(1.3)">
        <path d="M-10,-20 C-35,-80 -80,-90 -70,-55 C-60,-20 -40,-30 -25,-15 C-15,-8 -5,-15 -10,-20Z" fill="#D41920" />
        <path d="M10,-20 C35,-85 85,-80 65,-50 C50,-25 35,-28 20,-15 C12,-8 5,-15 10,-20Z" fill="#C01818" />
        <path d="M-15,-5 C-85,-25 -95,15 -60,20 C-30,24 -25,10 -18,2Z" fill="#D41920" />
        <path d="M15,-5 C90,-20 92,25 58,22 C30,20 22,8 16,0Z" fill="#C81A1A" />
        <path d="M-5,10 C-30,70 5,90 15,65 C22,48 18,30 8,18Z" fill="#D41920" />
        <path d="M0,18 C-15,55 5,70 12,52 C16,40 14,30 8,22Z" fill="#F06030" opacity={0.5} />
        <circle cx="0" cy="0" r="7" fill="#8B1515" />
        <path d="M0,0 C15,-40 25,-55 30,-62" stroke="#C01818" strokeWidth="1.3" fill="none" />
        <circle cx="30" cy="-62" r="3.5" fill="#D41920" />
        <path d="M0,0 C-20,-35 -28,-52 -22,-65" stroke="#C01818" strokeWidth="1.3" fill="none" />
        <circle cx="-22" cy="-65" r="3.5" fill="#D41920" />
      </g>

      {/* Fleur 2 — haut gauche */}
      <g transform="translate(140,140) scale(1) rotate(-15)">
        <path d="M-10,-20 C-35,-75 -75,-82 -65,-50 C-55,-20 -38,-28 -24,-14Z" fill="#E82828" />
        <path d="M10,-18 C32,-78 78,-72 60,-45 C46,-22 32,-26 18,-12Z" fill="#D41920" />
        <path d="M-14,-4 C-78,-22 -88,14 -55,18 C-28,22 -24,8 -16,1Z" fill="#C81818" />
        <path d="M14,-4 C82,-18 85,22 52,20 C28,18 20,7 14,-1Z" fill="#D41920" />
        <path d="M-4,10 C-28,62 4,80 14,58 C20,42 16,26 7,16Z" fill="#C01818" />
        <circle cx="0" cy="0" r="6" fill="#901515" />
        <path d="M0,0 C12,-35 20,-48 26,-55" stroke="#B81818" strokeWidth="1.1" fill="none" />
        <circle cx="26" cy="-55" r="3" fill="#D42020" />
      </g>

      {/* Fleur 3 — droite */}
      <g transform="translate(370,200) scale(0.9) rotate(25)">
        <path d="M-10,-20 C-32,-72 -72,-78 -62,-48 C-52,-18 -36,-26 -22,-13Z" fill="#D41920" />
        <path d="M10,-18 C30,-75 75,-70 58,-42 C44,-20 30,-24 17,-11Z" fill="#C81818" />
        <path d="M-13,-4 C-75,-20 -82,13 -52,17 C-26,20 -22,7 -15,1Z" fill="#E82828" />
        <path d="M13,-4 C78,-16 80,20 50,18 C26,16 18,6 13,-1Z" fill="#C01818" />
        <path d="M-3,9 C-25,58 3,75 13,55 C18,40 15,24 6,15Z" fill="#D41920" />
        <circle cx="0" cy="0" r="6" fill="#8B1515" />
        <path d="M0,0 C-18,-32 -24,-48 -20,-58" stroke="#B81818" strokeWidth="1" fill="none" />
        <circle cx="-20" cy="-58" r="2.8" fill="#D42020" />
      </g>

      {/* Fleur 4 — bas gauche (plus petite, bourgeon) */}
      <g transform="translate(160,360) scale(0.7) rotate(-5)">
        <path d="M-8,-16 C-28,-60 -60,-66 -52,-40 C-44,-16 -30,-22 -19,-10Z" fill="#E83030" />
        <path d="M8,-15 C26,-62 62,-58 48,-36 C36,-18 24,-20 14,-9Z" fill="#D41920" />
        <path d="M-11,-3 C-62,-16 -68,10 -44,14 C-22,17 -19,6 -13,0Z" fill="#C81818" />
        <path d="M11,-3 C65,-14 66,18 42,16 C22,14 16,5 11,-1Z" fill="#D41920" />
        <circle cx="0" cy="0" r="5" fill="#901515" />
      </g>

      {/* Fleur 5 — bas droite (bourgeon) */}
      <g transform="translate(340,380) scale(0.65) rotate(15)">
        <path d="M-8,-16 C-28,-58 -58,-64 -50,-38 C-42,-14 -28,-20 -18,-9Z" fill="#D41920" />
        <path d="M8,-14 C24,-58 58,-54 44,-34 C34,-16 22,-18 12,-8Z" fill="#C01818" />
        <path d="M-10,-2 C-58,-14 -64,10 -40,13 C-20,15 -17,5 -12,0Z" fill="#E82828" />
        <path d="M10,-2 C60,-12 62,16 38,14 C20,12 14,4 10,-1Z" fill="#C81818" />
        <circle cx="0" cy="0" r="4.5" fill="#8B1515" />
      </g>

      {/* Boutons / petits bourgeons */}
      <g transform="translate(100,280) scale(0.4) rotate(-25)">
        <ellipse cx="0" cy="-15" rx="10" ry="22" fill="#C01818" />
        <ellipse cx="-8" cy="-8" rx="8" ry="18" fill="#D41920" transform="rotate(20)" />
      </g>
      <g transform="translate(420,300) scale(0.35) rotate(30)">
        <ellipse cx="0" cy="-15" rx="10" ry="22" fill="#D41920" />
        <ellipse cx="8" cy="-8" rx="8" ry="18" fill="#C81818" transform="rotate(-15)" />
      </g>
    </svg>
  );
}

// Petite feuille seule
export function FlamboyantLeaf({
  className = "",
  opacity = 0.1,
}: FlamboyantFlowerProps) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <g transform="translate(60,30)">
        <line x1="-55" y1="0" x2="55" y2="0" stroke="#2A5520" strokeWidth="1.5" />
        {[-45, -35, -25, -15, -5, 5, 15, 25, 35, 45].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy={-7} rx={3.5} ry={6} fill="#2A5520" transform={`rotate(-10, ${x}, -7)`} />
            <ellipse cx={x} cy={7} rx={3.5} ry={6} fill="#1A4015" transform={`rotate(10, ${x}, 7)`} />
          </g>
        ))}
      </g>
    </svg>
  );
}
