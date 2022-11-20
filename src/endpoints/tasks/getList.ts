import { Request, Response } from "express"

import { ApiError } from "../../types/apiError.type"
import Task, { TaskType, taskValidateSchemaGetListFilters } from "../../models/task.model"
import { AppError } from "../../types/AppError"

const DEFAULT_LIMIT = 10


type ReqQuery = {
  limit?: number
  offset?: number
  ownerId?: string
  deadlineDayIso?: string
}
const schema = taskValidateSchemaGetListFilters()
type ResponseType = TaskType[]




const getList = async (req: Request<{}, {}, {}, ReqQuery>, res: Response<ResponseType | ApiError>) => {
  const props = req.query 
  const { error } = schema.validate(props, { abortEarly: false })
  if (error !== undefined) {
    throw new AppError('tasks', error.message, 400)
  }

  let filters = {}
  if (props.ownerId !== undefined) filters = Object.assign(filters, { ownerId: props.ownerId })
  if (props.deadlineDayIso !== undefined) filters = Object.assign(filters, { deadlineDayIso: props.deadlineDayIso })

  let options = {
    limit: props.limit || DEFAULT_LIMIT,
    skip: props.offset || 0
  }

  const tasks = await Task.find(filters, {}, options)
  res.status(200).send(tasks)
  return
}




export default getList