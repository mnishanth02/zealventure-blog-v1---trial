import { FC } from 'react'
import { ImSpinner3 } from 'react-icons/im'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface AlertDialogCustomProps {
  title: string
  content: string
  loading?: boolean
  handleDelete(): void
}

const AlertDialogCustom: FC<AlertDialogCustomProps> = ({
  title,
  content,
  loading = false,
  handleDelete,
}) => {
  return (
    <div>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{content}</AlertDialogDescription>
      </AlertDialogHeader>
      {!loading && (
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      )}
      {loading && (
        <AlertDialogFooter className="mt-4">
          <p className="flex items-center space-x-2">
            <ImSpinner3 className="animate-spin" />
            <span>Pleae wait</span>
          </p>
        </AlertDialogFooter>
      )}
    </div>
  )
}

export default AlertDialogCustom
