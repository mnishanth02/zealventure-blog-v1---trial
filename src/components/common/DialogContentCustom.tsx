import { FC } from 'react'

import { DialogDescription, DialogTitle } from '../ui/dialog'

interface DialogContentCustomProps {
  title: string
  content: string
}

const DialogContentCustom: FC<DialogContentCustomProps> = ({}) => {
  return (
    <div>
      <DialogTitle>Are you sure absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </div>
  )
}

export default DialogContentCustom
