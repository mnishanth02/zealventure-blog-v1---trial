import { NextRequest } from 'next/server'
import formidable from 'formidable'

export const config = {
  api: { bodyParser: false },
}

export async function GET(request: NextRequest) {
  const {} = request
}

export async function POST(req: any, res: any) {
  const form = formidable()
  form.parse(req, (err, fields, files) => {
    if (err) res.status(500).json({ error: err.mesage })
    // const imageFile = files.image && (files.image as formidable.File)
  })
}
