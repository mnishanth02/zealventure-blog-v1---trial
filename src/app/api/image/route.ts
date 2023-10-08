import cloudinary from '@/lib/cloudinary'
import { NextRequest, NextResponse } from 'next/server'
import streamifier from 'streamifier'
import { CloudinaryResponse } from '../../../../types/app'

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    const { resources } = await cloudinary.api.resources({
      resource_type: 'image',
      type: 'upload',
      prefix: 'zealventure/blog',
    })
    const images = resources.map(({ secure_url }: any) => ({ src: secure_url }))

    return NextResponse.json({ images }, { status: 200 })
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const POST = async (req: NextRequest, res: NextResponse) => {
  const formData = await req.formData()
  const data = (await formData.get('image')) as Blob
  const buffer = Buffer.from(await data.arrayBuffer())

  try {
    const response = new Promise((resolve, reject) => {
      return streamifier.createReadStream(buffer).pipe(
        cloudinary.uploader.upload_stream(
          {
            folder: 'zealventure/blog',
            upload_preset: 'yeqhjlwt',
            use_filename: true,
          },
          (error, result) => {
            if (error) {
              console.log('error-<', error)
              reject(error)
            }
            resolve(result)
            // console.log('Result -<< ', result)
          },
        ),
      )
    })

    const resultFinal = (await response) as CloudinaryResponse
    return NextResponse.json({ src: resultFinal.secure_url }, { status: 200 })
  } catch (error) {
    console.log('error->>', error)
  }
}
