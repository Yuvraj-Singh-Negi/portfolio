import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-green text-black hover:bg-accent-green-dim shadow-[0_0_20px_rgba(34,211,160,0.2)] hover:shadow-[0_0_30px_rgba(34,211,160,0.3)]",
        secondary:
          "border border-border bg-elevation-2 text-foreground hover:bg-elevation-3 hover:border-border-light",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-elevation-2",
        danger:
          "bg-accent-red/10 text-accent-red border border-accent-red/20 hover:bg-accent-red/20",
        outline: "border border-border bg-transparent text-foreground hover:bg-elevation-2",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-9 px-3.5",
        lg: "h-10 px-5",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
