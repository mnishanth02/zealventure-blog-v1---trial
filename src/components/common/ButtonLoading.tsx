import { FC, MouseEventHandler } from 'react';
import { Loader2 } from 'lucide-react';
import { ClassNameValue } from 'tailwind-merge'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'

interface ButtonLoadingProps {
  title: string
  loading?: boolean
  disabled?: boolean
  type: any
  variant: any
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: ClassNameValue
}

const ButtonLoading: FC<ButtonLoadingProps> = ({
  title,
  loading = false,
  disabled,
  type,
  variant = 'default',
  onClick,
  className,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex items-center w-full px-6 py-2 space-x-2 font-semibold transition',
        className,
      )}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{title} </span>
    </Button>
  )
}

export default ButtonLoading