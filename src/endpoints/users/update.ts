import { Request, Response } from "express"

import { ApiError } from "../../types/apiError.type"
import User, { UserType } from "../../models/user.model"
import { userValidateSchemaPatch } from '../../models/user.model'
import { isValidObjectIdString } from "../../utils/isValidObjectIdString"
import { AppError } from "../../types/AppError"
import { getErrorMsg } from "../../utils/getErrorMsg"



type ReqParams = {
  userid: string
}
type ReqBody = Partial<Pick<UserType, 'email' | 'password'>>
type ResponseType = UserType
const updatesSchema = userValidateSchemaPatch()



const update = async (req: Request<ReqParams, {}, ReqBody>, res: Response<ResponseType | ApiError>) => {
  const userId = req.params.userid
  const updates = req.body

  if (updates === undefined) {
    throw new AppError('users', 'updates are undefined', 400)
  }
  if (isValidObjectIdString(userId) === false) {
    throw new AppError('users', 'userid must by ObjectId', 400)
  }
  const { error } = updatesSchema.validate(updates, { abortEarly: false })
  if (error !== undefined) {
    throw new AppError('users', error.message, 400)
  }

  let user = await User.findOne({ _id: userId })
  if (user === null) {
    throw new AppError('users', 'cant find the user by userid', 404)
  }

  if (updates.password) user.password = updates.password
  if (updates.email) user.email = updates.email

  try {
    const result = await user.save()
    result.tokens = []
    result.password = ''
    res.status(200).send(result)
    return
  } catch (err) {
    throw new AppError('users', `Не получилось создать пользователя. ${getErrorMsg(err)}`, 500)
  }

}


export default update