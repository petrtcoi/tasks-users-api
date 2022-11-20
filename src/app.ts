import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import { dotenvConfig } from './env.config'

require('express-async-errors')

import tasksRouter from './endpoints/tasks/router'
import usersRouter from './endpoints/users/router'
import { handleError } from './middlewares/handleError'
import { authUser } from './middlewares/authUser'
import { UserDto } from './models/user.model'

dotenvConfig()
Object.freeze(Object.prototype)

const app: Express = express()

// MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ROUTERS
app.use('/tasks', authUser, tasksRouter)
app.use('/users', usersRouter)

// ERROR HANDLER
app.use(handleError)


mongoose.connect(process.env.MONGODB_URL ?? '', {})
  .then(() => {
    app.emit('ready')
  }).catch((err) => {
    app.emit('error')
  })

// ADD USER TO REQUEST (AUTH MIDDLEWARE)
declare global {
  namespace Express {
    interface Request {
      user: UserDto
    }
  }
}
// ADD _ID TO JWTPAYLOAD  (AUTH MIDDLEWARE)
declare module "jsonwebtoken" {
  export interface JwtPayload {
    _id: mongoose.Types.ObjectId
  }
}


export default app