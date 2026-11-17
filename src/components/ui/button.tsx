import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/** Satu bentuk tombol di seluruh app: bentuk tuts (sudut bawah membulat). */
const buttonVariants = cva(
  "key-shape group/button inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-sans font-semibold whitespace-nowrap transition-[background-color,color,transform] duration-150 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oxblood active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-ink text-white hover:bg-[#3a2a2d]",
        accent: "bg-oxblood text-paper hover:bg-[#5e0910]",
        secondary: "bg-secondary text-ink hover:bg-[#d9d5d5]",
        ghost: "text-ink hover:bg-panel",
        link: "text-oxblood underline-offset-4 hover:underline",
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
