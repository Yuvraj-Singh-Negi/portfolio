import { type HTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-elevation-3 text-muted-foreground border border-border",
        success: "bg-accent-green/10 text-accent-green border border-accent-green/20",
        warning: "bg-accent-amber/10 text-accent-amber border border-accent-amber/20",
        danger: "bg-accent-red/10 text-accent-red border border-accent-red/20",
        ai: "bg-accent-purple/10 text-accent-purple border border-accent-purple/20",
        knowledge: "bg-accent-blue/10 text-accent-blue border border-accent-blue/20",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(badgeVariants({ variant, size, className }))} {...props} />
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
