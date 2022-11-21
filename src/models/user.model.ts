import mongoose from 'mongoose'
import Joi from 'joi'
import bcrypt from 'bcrypt'
import { MongoObjectId } from '../types/mongoObjectId.type'
import { Timestamps } from '../types/timestamps.type'

type UserType = {
  email: string
  password: string
  tokens: string[]
}
type UserDto = UserType & MongoObjectId & Timestamps


const schema = new mongoose.Schema<UserType & Timestamps>({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    match: /.+@.+\..{2,}/
  },
  password: {
    type: String,
    required: true,
  },
  tokens: {
    type: [{ type: String }],
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})

schema.index({email: 1},{ unique: true } )

schema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  user.password = await bcrypt.hash(user.password, 8)
  next()
})


const User = mongoose.model('User', schema)

export default User
export type { UserType, UserDto }



export function userValidateSchemaPost() {
  return (
    Joi.object({
      email: Joi.string().email({ tlds: { allow: false } }).required(),
      password: Joi.string().min(6).required(),
    })
  )
}
export function userValidateSchemaPatch() {
  return (
    Joi.object({
      email: Joi.string().email({ tlds: { allow: false } }),
      password: Joi.string().min(6),
    })
  )
}
