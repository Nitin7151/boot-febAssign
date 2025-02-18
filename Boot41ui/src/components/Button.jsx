import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700',
        destructive: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-indigo-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export function Button({
  className,
  variant,
  size,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
