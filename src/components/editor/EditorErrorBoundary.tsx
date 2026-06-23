"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class EditorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#050505] p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm font-medium text-zinc-400">
              Editor encountered an error
            </p>
            <p className="max-w-md text-xs text-zinc-600">
              {this.state.error?.message ?? "Unknown error"}
            </p>
          </div>
          <button
            onClick={this.handleRetry}
            className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
