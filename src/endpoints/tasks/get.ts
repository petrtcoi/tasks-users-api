import { Request, Response } from "express"

import { ApiError } from "../../types/apiError.type"
import Task, { TaskDto, TaskType } from "../../models/task.model"
import { isValidObjectIdString } from "../../utils/isValidObjectIdString"
import { AppError } from "../../types/AppError"



type ReqParams = {
  taskid: string
}
type ResponseType = TaskType



const get = async (req: Request<ReqParams>, res: Response<ResponseType | ApiError>) => {
  const taskId = req.params.taskid

  if (isValidObjectIdString(taskId) === false) {
    throw new AppError('tasks', 'taskid must by ObjectId', 400)
  }

  const task: TaskDto | null = await Task.findOne({ _id: taskId })
  
  if (task === null) {
    throw new AppError('tasks', 'cant find the task by taskId', 404)
  }
  console.log(task._id)
  res.status(200).send(task)
  return
}


export default get