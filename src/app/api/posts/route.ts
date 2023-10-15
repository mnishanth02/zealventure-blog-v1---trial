import { writeFile } from 'fs/promises'
import path, { join } from 'path'
import { NextApiRequest } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import Post from '@/models/Post'
import formidable from 'formidable'

import { CloudinaryResponse, PostDetails } from '@/types/app'
import cloudinary from '@/lib/cloudinary'
import dbConnect from '@/lib/dbConnect'
import {
  formatPosts,
  isAdmin,
  readFile,
  readPostFromDb,
  uploadFile,
  uploadStream,
} from '@/lib/helpers'
import { isBase64Image } from '@/lib/utils'
import { PostValidationSchema, validateSchema } from '@/lib/validator'

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    const params = request.nextUrl.searchParams
    const limit = params.get('limit') as string
    const pageNo = params.get('pageNo') as string

    const posts = await readPostFromDb(parseInt(limit), parseInt(pageNo))

    if (posts) {
      const formatedPosts = formatPosts(posts)

      return NextResponse.json({ posts: formatedPosts }, { status: 200 })
    }
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//  Create New Post
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const admin = await isAdmin()
    if (!admin)
      return NextResponse.json(
        { error: 'Unauthorized request!' },
        { status: 401 },
      )

    const formData = await req.formData()
    let body = Object.fromEntries(formData)
    // console.log('body', body)

    let tags = []
    if (body.tags) tags = JSON.parse(body.tags as string)

    // console.log('thumbnail', body)
    // let thumbnail = ''
    // if (body.thumbnail) thumbnail = JSON.parse(body.thumbnail as string)

    const error = validateSchema(PostValidationSchema, { ...body, tags })
    if (error) return NextResponse.json({ error }, { status: 400 })

    const { title, content, slug, meta, thumbnail } = body

    await dbConnect()

    const postExist = await Post.findOne({ slug })

    if (postExist)
      return NextResponse.json(
        { error: 'Slug need to be Unique!' },
        { status: 400 },
      )

    const newPost = new Post({
      title,
      content,
      slug,
      meta,
      tags,
    })

    // console.log('ssthumbnaillthumbnaill-<>', thumbnail)
    if (thumbnail && isBase64Image(thumbnail as string)) {
      // const fileData = await (thumbnail as File).arrayBuffer()
      // const buffer = Buffer.from(fileData)

      try {
        const { secure_url, public_id } = await uploadFile(thumbnail as string)

        // const { secure_url, public_id } = await cloudinary.uploader.upload(
        //   thumbnail.toString(),
        //   {
        //     folder: 'zealventure/blog',
        //     upload_preset: 'yeqhjlwt',
        //     use_filename: true,
        //   },
        // )

        // return

        // const base64Data = buffer.toString('base64')
        // const path = `/tmp/${file.name}`

        // const filePath = path.join(process.cwd(), '/public/images', 'files.png')
        // console.log('file Path', filePath)

        // const res = await writeFile(filePath, buffer)
        // const { secure_url, public_id } = await uploadStream(buffer)

        console.log('secure URL', secure_url)
        console.log('Public URL', public_id)

        // console.log('res-new uploadstream', res)

        // const { secure_url, url } = await cloudinary.uploader.upload(
        //   thumbnail.toString(),
        //   {
        //     folder: 'zealventure/blog',
        //     upload_preset: 'yeqhjlwt',
        //     transformation: {
        //       width: 500,
        //       height: 500,
        //       crop: 'fill',
        //     },
        //   },
        // )

        newPost.thumbnail = {
          url: secure_url,
          public_id: public_id,
        }
      } catch (error) {
        console.log(error)
        return NextResponse.json({ error: error }, { status: 400 })
      }
    }

    await newPost.save()
    return NextResponse.json({ post: newPost }, { status: 200 })
  } catch (error: any) {
    console.log(error.response.data)
    return NextResponse.json({ error: error }, { status: 400 })
  }
}
