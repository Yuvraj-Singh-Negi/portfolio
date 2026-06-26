interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 text-small text-zinc-500 ${className}`}
    >
      {children}
    </span>
  );
}
