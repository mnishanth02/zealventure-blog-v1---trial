import { count } from 'console'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  charCount?: boolean
  count?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, charCount = false, count = 100, ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-secondary dark:focus:border-secondary-foreground/40',
            className,
          )}
          ref={ref}
          {...props}
        />
        {charCount && (
          <p className="absolute text-sm font-light bottom-1 right-2">{`${props.value?.toString()
            .length}/${count}`}</p>
        )}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
