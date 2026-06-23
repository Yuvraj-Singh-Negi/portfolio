import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

export function initializePostHog() {
  if (typeof window !== "undefined") {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (key && host) {
      posthog.init(key, {
        api_host: host,
        person_profiles: "identified_only",
        capture_pageview: false,
        loaded: (ph) => {
          if (process.env.NODE_ENV !== "production") {
            ph.opt_out_capturing();
          }
        },
      });
    }
  }
}

export function captureEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== "undefined") {
    posthog.capture(event, properties);
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    posthog.identify(userId, traits);
  }
}

export function captureException(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

export function setSentryUser(userId: string, email?: string) {
  Sentry.setUser({ id: userId, email });
}
