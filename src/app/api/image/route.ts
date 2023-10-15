import { NextRequest, NextResponse } from 'next/server'

import cloudinary from '@/lib/cloudinary'
import { isAdmin } from '@/lib/helpers'
import { isBase64Image } from '@/lib/utils'

export const GET = async () => {
  try {
    const admin = await isAdmin()
    if (!admin)
      return NextResponse.json(
        { error: 'Unauthorized request!' },
        { status: 401 },
      )

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
  const admin = await isAdmin()
  if (!admin)
    return NextResponse.json(
      { error: 'Unauthorized request!' },
      { status: 401 },
    )

  const formData = await req.formData()
  let body = Object.fromEntries(formData)
  const { image } = body

  try {
    if (image && isBase64Image(image as string)) {
      const { secure_url, url } = await cloudinary.uploader.upload(
        image.toString(),
        {
          folder: 'zealventure/blog',
          upload_preset: 'yeqhjlwt',
          use_filename: true,
        },
      )
      return NextResponse.json({ src: secure_url }, { status: 200 })
    }
    // const response = new Promise((resolve, reject) => {
    //   return streamifier.createReadStream(buffer).pipe(
    //     cloudinary.uploader.upload_stream(
    //       {
    //         folder: 'zealventure/blog',
    //         upload_preset: 'yeqhjlwt',
    //         use_filename: true,
    //       },
    //       (error, result) => {
    //         if (error) {
    //           console.log('error-<', error)
    //           reject(error)
    //         }
    //         resolve(result)
    //       },
    //     ),
    //   )
    // })

    // const resultFinal = (await response) as CloudinaryResponse
  } catch (error: any) {
    console.log('error->>', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
