'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    if (typeof window !== 'undefined' && (window as unknown as { __SENTRY__?: { captureException: (e: Error, opts?: unknown) => void } }).__SENTRY__) {
      (window as unknown as { __SENTRY__: { captureException: (e: Error, opts?: unknown) => void } }).__SENTRY__.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900/50 border border-zinc-800">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-zinc-100">Something went wrong</h2>
            <p className="mb-6 text-zinc-500">
              We caught an unexpected error. The development team has been notified.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left p-3 rounded-md bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400">
                <summary className="cursor-pointer mb-1 font-mono">Error details</summary>
                <pre className="overflow-auto max-h-40">{this.state.error.message}</pre>
                {this.state.error.stack && (
                  <pre className="mt-2 overflow-auto max-h-40">{this.state.error.stack}</pre>
                )}
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button variant="outline" onClick={this.handleHome} className="gap-2">
                <Home className="h-4 w-4" />
                Go home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
