import Joi from 'joi'
import mongoose from 'mongoose'
import { MongoObjectId } from '../types/mongoObjectId.type'
import { Timestamps } from '../types/timestamps.type'




type TaskType = {
  ownerId: string
  title: string
  description?: string
  deadlineDayIso?: string
}
type TaskDto = TaskType & MongoObjectId & Timestamps


const schema = new mongoose.Schema<TaskType & Timestamps>({
  ownerId: {
    type: String,
    trim: true,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: false,
  },
  deadlineDayIso: {
    type: String,
    trim: true,
    required: false,
  },
}, {
  timestamps: true,
  versionKey: false
})

const Task = mongoose.model('Task', schema)

export default Task
export type { TaskType, TaskDto }




export function taskValidateSchemaForPost() {
  return Joi.object({
    ownerId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string(),
    deadlineDayIso: Joi.date().iso()
  })
}
export function taskValidateSchemaForPatch() {
  return Joi.object({
    ownerId: Joi.string(),
    title: Joi.string(),
    description: Joi.string().allow(null, ''),
    deadlineDayIso: Joi.date().iso().allow(null)
  })
}
export function taskValidateSchemaGetListFilters() {
  return (
    Joi.object({
      limit: Joi.number().min(1).integer(),
      offset: Joi.number().min(0).integer(),
      ownerId: Joi.string(),
      deadlineDayIso: Joi.date().iso()
    })
  )

}