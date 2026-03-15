interface FlamboyantFlowerProps {
  className?: string;
  color?: string;
  opacity?: number;
}

export default function FlamboyantFlower({
  className = "",
  color = "#DC143C",
  opacity = 0.15,
}: FlamboyantFlowerProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {/* Pétales de fleur de flamboyant */}
      <g transform="translate(100,100)">
        {/* 5 pétales disposés en étoile */}
        <ellipse
          cx="0"
          cy="-45"
          rx="22"
          ry="48"
          fill={color}
          transform="rotate(0)"
        />
        <ellipse
          cx="0"
          cy="-45"
          rx="22"
          ry="48"
          fill={color}
          transform="rotate(72)"
        />
        <ellipse
          cx="0"
          cy="-45"
          rx="22"
          ry="48"
          fill={color}
          transform="rotate(144)"
        />
        <ellipse
          cx="0"
          cy="-45"
          rx="22"
          ry="48"
          fill={color}
          transform="rotate(216)"
        />
        <ellipse
          cx="0"
          cy="-45"
          rx="22"
          ry="48"
          fill={color}
          transform="rotate(288)"
        />
        {/* Coeur de la fleur */}
        <circle cx="0" cy="0" r="10" fill={color} opacity={0.8} />
        {/* Étamines */}
        <line
          x1="0"
          y1="0"
          x2="15"
          y2="-30"
          stroke={color}
          strokeWidth="1.5"
          opacity={0.6}
        />
        <circle cx="15" cy="-30" r="3" fill={color} opacity={0.7} />
        <line
          x1="0"
          y1="0"
          x2="-12"
          y2="-28"
          stroke={color}
          strokeWidth="1.5"
          opacity={0.6}
        />
        <circle cx="-12" cy="-28" r="3" fill={color} opacity={0.7} />
      </g>
    </svg>
  );
}

export function FlamboyantLeaf({
  className = "",
  color = "#2D5A27",
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
      {/* Feuille bipennée du flamboyant */}
      <g transform="translate(60,30)">
        {/* Tige principale */}
        <line
          x1="-55"
          y1="0"
          x2="55"
          y2="0"
          stroke={color}
          strokeWidth="1.5"
        />
        {/* Folioles paires */}
        {[-45, -35, -25, -15, -5, 5, 15, 25, 35, 45].map((x, i) => (
          <g key={i}>
            <ellipse
              cx={x}
              cy={-8}
              rx="4"
              ry="7"
              fill={color}
              transform={`rotate(-10, ${x}, -8)`}
            />
            <ellipse
              cx={x}
              cy={8}
              rx="4"
              ry="7"
              fill={color}
              transform={`rotate(10, ${x}, 8)`}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
