import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/** Tombol stiker: garis tepi tebal, bayangan pekat, "tertekan" saat diklik. */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-[14px] font-sans font-bold whitespace-nowrap outline-none select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lit disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "press border-[2.5px] border-ink bg-ink text-white shadow-[3px_3px_0_var(--ink)]",
        accent: "press border-[2.5px] border-ink bg-ink text-white shadow-[3px_3px_0_var(--ink)]",
        secondary: "press border-[2.5px] border-ink bg-white text-ink shadow-[3px_3px_0_var(--ink)] hover:bg-hi",
        ghost: "text-ink hover:bg-hi",
        link: "text-ink underline underline-offset-4",
      },
      size: {
        default: "h-10 px-4 text-[15px]",
        sm: "h-9 px-3 text-sm",
        lg: "h-12 px-6 text-[17px]",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
