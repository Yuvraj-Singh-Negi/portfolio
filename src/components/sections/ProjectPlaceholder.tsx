interface ProjectPlaceholderProps {
  title: string;
  index: number;
}

export function ProjectPlaceholder({ title, index }: ProjectPlaceholderProps) {
  const initials = title
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-white/[0.02]">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <span
        className="select-none text-5xl font-bold tracking-tighter text-zinc-800 transition-all duration-500 group-hover:text-zinc-700"
        aria-hidden="true"
      >
        {initials || `P${index + 1}`}
      </span>
    </div>
  );
}
