import cloudinary from '@/lib/cloudinary'
import { NextRequest, NextResponse } from 'next/server'
import streamifier from 'streamifier'

export const GET = async (request: NextRequest, response: NextResponse) => {
  console.log('Testing Response')
  // return Response.json('success')
  NextResponse.json({ image: 'Success fr GET' }, { status: 200 })
}

export const POST = async (req: NextRequest, res: NextResponse) => {
  const formData = await req.formData()
  const data = (await formData.get('image')) as Blob
  const buffer = Buffer.from(await data.arrayBuffer())

  try {
    let cld_upload_stream = await cloudinary.uploader.upload_stream(
      {
        folder: 'zealventure',
        upload_preset: 'yeqhjlwt',
      },
      (error, result) => {
        console.log(error, result)
      },
    )
    const s = streamifier.createReadStream(buffer).pipe(cld_upload_stream)
  } catch (error) {
    console.log('error->>', error)
  }

  return NextResponse.json({ image: 'testing' }, { status: 200 })
}
