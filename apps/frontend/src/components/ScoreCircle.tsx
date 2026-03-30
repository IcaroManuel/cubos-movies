interface ScoreCircleProps {
  score: number;
}

export function ScoreCircle({ score }: ScoreCircleProps) {
  const size = 98;
  const strokeWidth = 6;
  const radius = 44;

  const circumference = 2 * Math.PI * radius;
  const safeScore = score || 0;
  const offset = circumference - (safeScore / 100) * circumference;

  let scoreColor = '#F2C94C'; // Amarelo
  if (safeScore < 60) {
    scoreColor = '#EF4444'; // Vermelho
  } else if (safeScore >= 80) {
    scoreColor = '#10B981'; // Verde
  }

  return (
    <div className="relative flex h-[98px] w-[98px] items-center justify-center rounded-full bg-[#121113]/50 backdrop-blur-[4px]">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 transform"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2B2B2B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex items-baseline gap-[2px]">
        <span className="text-2xl font-bold tracking-tighter text-white">{safeScore}</span>
        <span className="text-sm font-bold text-gray-400">%</span>
      </div>
    </div>
  );
}
