import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,211,160,0.03)_0%,_transparent_60%)]" />
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  );
}
