import { Request, Response } from "express"

import { ApiError } from "../../types/apiError.type"
import Task, { TaskType } from "../../models/task.model"
import { taskValidateSchemaForPatch } from '../../models/task.model'
import { isValidObjectIdString } from "../../utils/isValidObjectIdString"
import { AppError } from "../../types/AppError"



type ReqParams = {
  taskid: string
}
type ReqBody = Partial<Pick<TaskType, 'ownerId' | 'title' | 'description' | 'deadlineDayIso'>>
type ResponseType = TaskType
const updatesSchema = taskValidateSchemaForPatch()



const update = async (req: Request<ReqParams, {}, ReqBody>, res: Response<ResponseType | ApiError>) => {
  const taskId = req.params.taskid
  const updates = req.body
  if (updates === undefined) {
    throw new AppError('tasks', 'updates are undefined', 400)
  }

  if (isValidObjectIdString(taskId) === false) {
    throw new AppError('tasks', 'taskid must by ObjectId', 400)
  }
  const { error } = updatesSchema.validate(updates, { abortEarly: false })
  if (error !== undefined) {
    throw new AppError('tasks', error.message, 400)
  }

  const task = await Task.findOneAndUpdate({ _id: taskId }, updates, { upsert: false, returnNewDocument: true })
  if (task === null) {
    throw new AppError('tasks', 'cant find the task by taskId', 404)

  }

  res.status(200).send(task)
  return
}


export default update