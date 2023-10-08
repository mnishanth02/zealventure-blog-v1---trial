import { FC, MouseEventHandler } from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

interface ButtonLoadingProps {
  title: string
  loading?: boolean
  disabled?: boolean
  type: any
  variant: any
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const ButtonLoading: FC<ButtonLoadingProps> = ({
  title,
  loading = false,
  disabled,
  type,
  variant = 'default',
  onClick,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      className="flex items-center w-full px-6 py-2 space-x-2 font-semibold transition"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{title} </span>
    </Button>
  )
}

export default ButtonLoading
