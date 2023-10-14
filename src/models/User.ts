import { Model, model, models, ObjectId, Schema } from 'mongoose'

export interface UserModelSchema {
  name: string
  email: string
  role: 'user' | 'admin'
  provider: 'google' | 'github' | 'credentials'
  password?: string
  avatar?: string
  createdAt: Date
}
const UserSchema = new Schema<UserModelSchema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    password: {
      type: String,
    },
    provider: {
      type: String,
      enum: ['github', 'google', 'credentials'],
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true },
)

const User = models?.User || model('User', UserSchema)

export default User as Model<UserModelSchema>
