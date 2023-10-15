;
// Helpers for API
import { readFileSync, writeFile, writeFileSync } from 'fs';
import { Readable } from 'stream';
import { NextApiRequest } from 'next';
import Post, { PostModelSchema } from '@/models/Post';
import { UploadApiResponse, UploadStream } from 'cloudinary';
import formidable from 'formidable';
import { getServerSession } from 'next-auth';



import { CloudinaryResponse, PostDetails, UserProfile } from '@/types/app';
import { options } from '@/app/api/auth/[...nextauth]/options';



import cloudinary from './cloudinary';
import dbConnect from './dbConnect';


export const formatPosts = (posts: PostModelSchema[]): PostDetails[] => {
  return posts.map((post) => ({
    id: post?._id.toString(),
    title: post.title,
    slug: post.slug,
    tags: post.tags,
    meta: post.meta,
    thumbnail: post.thumbnail?.url || '',
    createdAt: post.createdAt.toString(),
  }))
}

export const readPostFromDb = async (limit: number = 9, pageNo: number = 0) => {
  if (!limit || limit > 10)
    throw Error('Please use Limit under 10 and a valid Page No')
  const skip = limit * pageNo

  try {
    await dbConnect()
    const posts = await Post.find()
      .sort({ createdAt: 'desc' })
      .select('-content')
      .skip(skip)
      .limit(limit)

    return posts
  } catch (error) {
    console.log('Error->', error)
  }
}

export const isAdmin = async () => {
  const session = await getServerSession(options)
  const user = session?.user as UserProfile
  return user && user.role === 'admin'
}

export async function uploadStream(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((res, rej) => {
    const theTransformStream = cloudinary.uploader.upload_stream(
      {
        folder: 'zealventure/blog',
        upload_preset: 'yeqhjlwt',
        use_filename: true,
        chunk_size: 10000,
        resource_type: 'image',
      },
      (err, result) => {
        if (err) return rej(err)
        if (result) res(result)
      },
    )
    let str = Readable.from(buffer)
    str.pipe(theTransformStream)
  })
}

export async function uploadFile(fileString: string) {
  // let _buffer = Buffer.from(buffer, 'base64')
  // const filebuffer = Buffer.toString('base64')
  // const sd = (await toBase64(file)) as string
  // console.log('Sd->', sd)

  // console.log('thumbnail as string -> ', fileString)

  return await cloudinary.uploader.upload(fileString, {
    folder: 'zealventure/blog',
    upload_preset: 'yeqhjlwt',
    use_filename: true,
    resource_type: 'image',
    chunk_size: 100000,
  })

  // console.log('secureURL', secure_url)
  // console.log('publick', public_id)
}

interface FormidablePromise<T> {
  files: formidable.Files
  body: T
}

export const readFile = <T extends object>(
  req: NextApiRequest,
): Promise<FormidablePromise<T>> => {
  const form = formidable()
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)

      resolve({ files, body: fields as T })
    })
  })
}

// Convert a file to base64 string
const toBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve(fileReader.result)
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}