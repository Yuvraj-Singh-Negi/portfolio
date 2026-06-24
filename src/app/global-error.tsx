'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Error - OpenCode</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="dark bg-[#050505] text-zinc-100 antialiased">
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900/50 border border-zinc-800">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-100">Application Error</h2>
            <p className="mb-6 text-zinc-500">
              A critical error occurred during rendering. Please try refreshing the page.
            </p>
            {error.digest && (
              <p className="mb-6 text-xs text-zinc-600 font-mono">Error ID: {error.digest}</p>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'} className="gap-2">
                <Home className="h-4 w-4" />
                Go home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
