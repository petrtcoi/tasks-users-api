import mongoose from "mongoose"

export const isValidObjectIdString = (value: string) => {
  return mongoose.Types.ObjectId.isValid(value)
}