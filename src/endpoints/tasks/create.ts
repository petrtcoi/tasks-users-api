import { Request, Response } from "express"

import { ApiError } from "../../types/apiError.type"
import Task, { TaskType } from "../../models/task.model"
import { taskValidateSchemaForPost } from '../../models/task.model'
import { AppError } from "../../types/AppError"



type ReqBody = Pick<TaskType, 'ownerId' | 'title' | 'description' | 'deadlineDayIso'>
type ResponseType = TaskType
const schema = taskValidateSchemaForPost()



const create = async (req: Request<{}, {}, ReqBody>, res: Response<ResponseType | ApiError>) => {

  if (req.body === undefined) {
    throw new AppError('tasks', 'body is undefined', 400)
  }
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error !== undefined) {
    throw new AppError('tasks', error.message, 400)
  }



  const task = new Task(req.body)
  await task.save()

  res.status(200).send(task)
  return
}


export default create