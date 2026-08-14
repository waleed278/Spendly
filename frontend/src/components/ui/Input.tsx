import { InputHTMLAttributes, LabelHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Label = ({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("mb-1.5 block text-xs font-medium text-fg-muted", className)} {...props} />
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            "h-10 w-full rounded-lg border border-border bg-bg px-3 text-sm text-fg placeholder:text-fg-subtle",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500",
            icon && "pl-9",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-fg-subtle",
        "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
