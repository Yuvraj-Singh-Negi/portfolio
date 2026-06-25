import { Container } from "@/components/layout/Container";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 py-8">
      <Container>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-zinc-600">
            &copy; 2026 Yuvraj Singh Negi
          </p>
          <p className="text-xs text-zinc-700">
            Built with Next.js &amp; Tailwind CSS
          </p>
        </div>
      </Container>
    </footer>
  );
}
