import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}
const inputClass = `flex h-10 w-full transition rounded-md border border-input  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50
dark:bg-secondary dark:focus:border-secondary-foreground/40`

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ className, type, label, ...props }, ref) => {
    return (
      <label className="relative block">
        <span className="absolute pl-2 text-sm -translate-y-1/2 top-1/2">
          {label}
        </span>
        <input
          type={type}
          className={cn(inputClass, className)}
          ref={ref}
          {...props}
        />
      </label>
    )
  },
)
InputWithLabel.displayName = 'InputWithLabel'

export { InputWithLabel }
