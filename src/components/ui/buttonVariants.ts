import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-700 text-white hover:bg-blue-800",
        outline: "border border-slate-300 bg-white text-slate-700 hover:border-blue-300",
        ghost: "text-slate-700 hover:bg-slate-100"
      },
      size: {
        default: "h-9 px-3 py-2",
        sm: "h-8 rounded-md px-2 text-xs",
        lg: "h-10 rounded-md px-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
