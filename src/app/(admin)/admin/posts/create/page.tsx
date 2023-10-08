import Tiptap from '@/components/editor/TipTap'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Zealventure - New Post',
}

function CreatePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Tiptap />
    </div>
  )
}

export default CreatePage
