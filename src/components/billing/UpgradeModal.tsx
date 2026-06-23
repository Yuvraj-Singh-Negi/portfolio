"use client";

import { useState, useCallback } from "react";
import { X, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradeModalProps {
  open?: boolean;
  onClose?: () => void;
  currentTier?: string;
}

const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "3 projects",
      "50 generations/month",
      "100K tokens/month",
      "No deployments",
    ],
    cta: "Current Plan",
    disabled: true,
    variantId: "",
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$29",
    period: "per month",
    features: [
      "20 projects",
      "500 generations/month",
      "1M tokens/month",
      "Deploy to Vercel",
      "Custom domains",
    ],
    cta: "Upgrade to Pro",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_ID_PRO ?? "",
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: "$99",
    period: "per month",
    features: [
      "Unlimited projects",
      "5K generations/month",
      "10M tokens/month",
      "Priority support",
      "Team access",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    variantId: process.env.NEXT_PUBLIC_LS_VARIANT_ID_ENTERPRISE ?? "",
  },
];

export function UpgradeModal({
  open: externalOpen,
  onClose: externalOnClose,
  currentTier,
}: UpgradeModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const isOpen = externalOpen ?? internalOpen;
  const handleClose = externalOnClose ?? (() => setInternalOpen(false));

  const handleUpgrade = useCallback(async (plan: typeof PLANS[number]) => {
    if (plan.disabled || !plan.variantId) return;
    setLoading(plan.id);

    try {
      const res = await fetch("/api/v1/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "current",
          variantId: plan.variantId,
          email: "placeholder",
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(null);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-4">
        <div className="rounded-xl border border-zinc-800 bg-[#0A0A0A] p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                Upgrade your plan
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {currentTier
                  ? `You're currently on the ${currentTier} plan`
                  : "Choose the plan that fits your needs"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((plan) => {
              const isLoading = loading === plan.id;
              const isCurrent = plan.id === currentTier;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "flex flex-col rounded-lg border p-5 transition-colors",
                    isCurrent
                      ? "border-zinc-700 bg-zinc-900"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                  )}
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-zinc-100">
                      {plan.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-zinc-100">
                        {plan.price}
                      </span>
                      <span className="text-xs text-zinc-500">
                        /{plan.period}
                      </span>
                    </div>
                  </div>

                  <ul className="mb-6 flex-1 space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-xs text-zinc-400"
                      >
                        <ArrowUpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(plan)}
                    disabled={plan.disabled || isLoading}
                    className={cn(
                      "inline-flex h-9 w-full items-center justify-center rounded-md text-sm font-medium transition-colors",
                      plan.disabled
                        ? "cursor-default border border-zinc-800 bg-zinc-900 text-zinc-600"
                        : "border border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
                    )}
                  >
                    {isLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-zinc-300" />
                    ) : (
                      plan.cta
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
