import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  // @base-ui/react/input does not reliably forward aria-invalid to the DOM
  // element, so the Tailwind `aria-invalid:*` CSS selectors never fire.
  // We read the prop explicitly and apply error styles via cn() instead.
  const invalid =
    props['aria-invalid'] === true || props['aria-invalid'] === 'true';

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Base + focus + disabled
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none",
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
        "md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
        // Error state — applied via JS so it works regardless of DOM attribute forwarding.
        // The ! (Tailwind important) ensures the error border wins even when the
        // field is simultaneously focused (focus-visible:border-ring would otherwise win).
        invalid && [
          "border-destructive!",
          "ring-1 ring-destructive/20!",
          "focus-visible:border-destructive!",
          "focus-visible:ring-1! focus-visible:ring-destructive/20!",
          "dark:border-destructive/50! dark:ring-destructive/40!",
        ],
        className
      )}
      {...props}
    />
  )
}

export { Input }

