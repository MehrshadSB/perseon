import { cn } from "@/lib/utils";
import type { JSX } from "react";

type InputFieldProps = {
  className?: string;
  field?: any;
  label?: JSX.Element | string;
  type?: string;
};

export function Input({
  className,
  field,
  label,
  type,
  ...props
}: InputFieldProps & React.ComponentProps<"input">) {
  console.log(field.state.meta.errors);

  return (
    <div className="field">
      <label>
        {label}
        <input
          id={type}
          autoComplete={type}
          type={type}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "rounded-xs!",
            `${field.state.meta.errors.length >= 1 ? "border-red-700" : "border-gray-600"}`,
            className,
          )}
          {...props}
        />
      </label>

      {field.state.meta.errors ? (
        <div className="text-xs font-medium py-1 text-red-500 dark:text-red-400 drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]">
          {field.state.meta.errors.join(", ")}
        </div>
      ) : null}
    </div>
  );
}
