"use client";

import { cn } from "@/lib/utils";

interface WolfMascotProps {
  size?: number;
  animate?: boolean;
  glowIntensity?: "low" | "medium" | "high";
  className?: string;
}

export function WolfMascot({
  size = 120,
  animate = true,
  glowIntensity = "medium",
  className,
}: WolfMascotProps) {
  const glowMap = {
    low: { opacity: 0.4, blur: 4 },
    medium: { opacity: 0.7, blur: 8 },
    high: { opacity: 1, blur: 12 },
  };

  const glow = glowMap[glowIntensity];

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        {/* Glow effect behind eyes */}
        <filter id={`glow-${glowIntensity}`}>
          <feGaussianBlur stdDeviation={glow.blur} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Wolf head silhouette */}
        <path
          d="M100 20 L140 60 L155 50 L150 80 L170 100 L155 120 L160 150 L130 165 L100 175 L70 165 L40 150 L45 120 L30 100 L50 80 L45 50 L60 60 L100 20Z"
          className="fill-zinc-900 stroke-zinc-700"
          strokeWidth="1.5"
        />

        {/* Inner face */}
        <path
          d="M100 50 L125 75 L130 100 L125 130 L100 145 L75 130 L70 100 L75 75 L100 50Z"
          className="fill-[#0A0A0A]"
        />

        {/* Left ear inner */}
        <path
          d="M65 55 L55 40 L60 65"
          className="fill-[#0A0A0A]"
        />

        {/* Right ear inner */}
        <path
          d="M135 55 L145 40 L140 65"
          className="fill-[#0A0A0A]"
        />

        {/* Snout */}
        <path
          d="M90 120 Q100 135 110 120 L105 140 Q100 145 95 140Z"
          className="fill-[#0A0A0A]"
        />

        {/* Nose */}
        <ellipse cx="100" cy="118" rx="5" ry="3" className="fill-zinc-600" />

        {/* Left eye */}
        <g filter={animate ? `url(#glow-${glowIntensity})` : undefined}>
          <ellipse cx="78" cy="88" rx="8" ry="6" className="fill-black" />
          <ellipse
            cx="78"
            cy="88"
            rx="5"
            ry="4"
            className="fill-[#7DD3FC]"
            opacity={glow.opacity}
          >
            {animate && (
              <animate
                attributeName="opacity"
                values={`${glow.opacity};${glow.opacity * 0.6};${glow.opacity}`}
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </ellipse>
          <circle cx="76" cy="86" r="2" className="fill-white" opacity="0.8">
            {animate && (
              <animate
                attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="1.5s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>

        {/* Right eye */}
        <g filter={animate ? `url(#glow-${glowIntensity})` : undefined}>
          <ellipse cx="122" cy="88" rx="8" ry="6" className="fill-black" />
          <ellipse
            cx="122"
            cy="88"
            rx="5"
            ry="4"
            className="fill-[#7DD3FC]"
            opacity={glow.opacity}
          >
            {animate && (
              <animate
                attributeName="opacity"
                values={`${glow.opacity};${glow.opacity * 0.6};${glow.opacity}`}
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </ellipse>
          <circle cx="120" cy="86" r="2" className="fill-white" opacity="0.8">
            {animate && (
              <animate
                attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="1.5s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>

        {/* Forehead markings */}
        <path
          d="M85 60 Q100 55 115 60"
          stroke="#27272A"
          strokeWidth="1"
          fill="none"
        />

        {/* Cheek fur lines */}
        <line x1="65" y1="100" x2="72" y2="95" stroke="#27272A" strokeWidth="1" />
        <line x1="135" y1="100" x2="128" y2="95" stroke="#27272A" strokeWidth="1" />
        <line x1="60" y1="110" x2="70" y2="108" stroke="#27272A" strokeWidth="1" />
        <line x1="140" y1="110" x2="130" y2="108" stroke="#27272A" strokeWidth="1" />
      </svg>
    </div>
  );
}
