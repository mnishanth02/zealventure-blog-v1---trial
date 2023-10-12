import cloudinary from '@/lib/cloudinary'
import dbConnect from '@/lib/dbConnect'
import { PostValidationSchema, validateSchema } from '@/lib/validator'
import Post from '@/models/Post'
import { NextRequest, NextResponse } from 'next/server'
import streamifier from 'streamifier'
import { CloudinaryResponse } from '@/types/app'
import { formatPosts, readPostFromDb } from '@/lib/helpers'

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
    const formData = await req.formData()
    let body = Object.fromEntries(formData)
    console.log(body)

    let tags = []
    if (body.tags) tags = JSON.parse(body.tags as string)

    const error = validateSchema(PostValidationSchema, { ...body, tags })
    if (error) return NextResponse.json({ error }, { status: 400 })

    const { title, content, slug, meta } = body
    await dbConnect()

    const postExist = await Post.findOne({ slug })
    console.log('postexist->', postExist)

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

    if (body.thumbnail) {
      const data = body.thumbnail as Blob
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
        newPost.thumbnail = {
          url: resultFinal.secure_url,
          public_id: resultFinal.public_id,
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
  }
}
