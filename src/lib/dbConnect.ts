import mongoose from 'mongoose'

const uri = process.env.MONGOODB_URL as string

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(uri)
    console.log('DB Connection Successful')

    return connection
  } catch (error) {
    console.log('DB Connection Failed', error)
  }
}

export default dbConnect
